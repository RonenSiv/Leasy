import cv2
import numpy as np
from pydub import AudioSegment
import ffmpeg
from moviepy.editor import VideoFileClip, concatenate_videoclips, AudioFileClip
import os
import subprocess
from RIFE import inference_img
import whisper
from whisper.utils import get_writer
import openai
import sys
import pysrt
import soundfile as sf
# import librosa
# import torch
# import torch.nn as nn
# import torchaudio
# import torchaudio.transforms as T
# from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC, AdamW
from gtts import gTTS
import io

# Capture stdout and stderr
real_stdout = sys.stdout
real_stderr = sys.stderr
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

from TTS.api import TTS
import argparse

sys.path.append(r'C:\Users\Omer\Documents\GitHub\Leasy\services\server\storage\app\public\RIFE') 

# Define the path to the RIFE folder
rife_folder = r"C:\Users\Omer\Documents\GitHub\Leasy\services\server\storage\app\public\RIFE"  # Adjust if necessary
inference_script = os.path.join(rife_folder, "inference_img.py")
os.makedirs(rife_folder, exist_ok=True)  # Ensure the folder exists

target_dir = r"C:\Users\Omer\Documents\GitHub\Leasy\services\server\public\storage"
os.chdir(target_dir)
with open("key.txt", "r", encoding="utf-8") as file:
    key = file.read()
openai.api_key = key
tts = TTS(model_name="tts_models/multilingual/multi-dataset/your_tts", progress_bar=False, gpu=True)

def is_black_frame(frame, threshold=10):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)
    return brightness < threshold

def transcribe_audio(audio_path):
    model = whisper.load_model("base")  # You can use 'small', 'medium', 'large', etc.
    result = model.transcribe(audio=audio_path, language="en", fp16=False)
    return result

def fix_subtitles_gpt(srt_path, cuts_as_text):
    lineList = []
    # read file line by line
    with open(srt_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    file.close()

    # store all text into a list
    for line in lines:
        line = line.strip()
        lineList.append(line)

    # for every item in the list, append a space at end
    for i in range(len(lineList)):
        lineList[i] = lineList[i] + ' '

    # Finish with list.join() to bring everything together
    text = ' '.join(lineList)
    with open("prompt.txt", "r", encoding="utf-8") as file:
        prompt = file.read()
    formatted_prompt = eval(f"f'''{prompt}'''")
    print(f"this is the prompt:@@@@@@\n\n{formatted_prompt}@@@@\n\n")
    result = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": f"{formatted_prompt}"
            }
        ]
    )
    print(f"\n\nGPT MESSAGE: {result.choices[0].message.content}\n\n")
    return result.choices[0].message.content

def parse_srt(srt_file):
    subs = pysrt.open(srt_file)
    return [
        (
            sub.start.hours * 3600 + sub.start.minutes * 60 + sub.start.seconds + sub.start.milliseconds / 1000.0,
            sub.end.hours * 3600 + sub.end.minutes * 60 + sub.end.seconds + sub.end.milliseconds / 1000.0,
            sub.text.strip(),
        )
        for sub in subs
    ]

# def segment_audio(audio_file, aligned_data, output_dir="audio_segments", target_sample_rate=16000):
#     """
#     Segment audio based on aligned data and resample to the target sample rate.
#     """
#     os.makedirs(output_dir, exist_ok=True)
#     audio, sr = librosa.load(audio_file, sr=None)

#     # Resample the full audio file to the target sample rate
#     if sr != target_sample_rate:
#         audio = librosa.resample(audio, orig_sr=sr, target_sr=target_sample_rate)
#         sr = target_sample_rate

#     for i, (start_time, end_time, text) in enumerate(aligned_data):
#         start_sample = int(start_time * sr)
#         end_sample = int(end_time * sr)
#         segment = audio[start_sample:end_sample]
#         output_path = os.path.join(output_dir, f"segment_{i}.wav")
#         sf.write(output_path, segment, sr)
#     return output_dir

# def preprocess_data(audio_dir, aligned_data, processor, target_sample_rate=16000):
#     """
#     Preprocess audio segments by resampling if necessary and preparing them for the model.
#     """
#     data = []
#     resampler = T.Resample(orig_freq=44100, new_freq=target_sample_rate)  # Resampler to handle 44.1 kHz -> 16 kHz

#     for i, (_, _, text) in enumerate(aligned_data):
#         audio_path = os.path.join(audio_dir, f"segment_{i}.wav")
#         waveform, sample_rate = torchaudio.load(audio_path)

#         # Resample the audio if needed
#         if sample_rate != target_sample_rate:
#             waveform = resampler(waveform)

#         # Process the audio for the model
#         input_values = processor(waveform.squeeze().numpy(), sampling_rate=target_sample_rate, return_tensors="pt").input_values
#         data.append((input_values, text))
#     return data

# def train_model(audio_dir, srt_dir):
#     """
#     Train a Wav2Vec2 model using the provided audio and subtitle files.
#     """
#     # Load Pretrained Model and Processor
#     model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
#     processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
#     optimizer = AdamW(model.parameters(), lr=5e-5)

#     # Unfreeze model parameters
#     for param in model.parameters():
#         param.requires_grad = True

#     # Move the model to the appropriate device
#     device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#     model.to(device)
#     model.train()  # Ensure the model is in training mode

#     # Parse subtitles and segment audio
#     aligned_data = parse_srt(srt_dir)
#     audio_segments_dir = segment_audio(audio_dir, aligned_data)
#     processed_data = preprocess_data(audio_segments_dir, aligned_data, processor)

#     # Initialize CTC loss function
#     loss_fn = nn.CTCLoss(blank=processor.tokenizer.pad_token_id, zero_infinity=True)

#     # Training loop
#     for input_values, text in processed_data:
#         # Convert text to token IDs
#         labels = processor.tokenizer(
#             text,
#             return_tensors="pt",
#             padding=True,
#             truncation=True
#         ).input_ids.squeeze(0)

#         # Ensure tensors are on the correct device
#         labels = labels.to(torch.long).to(device)
#         input_values = input_values.clone().detach().requires_grad_(True).to(device)

#         # Forward pass
#         outputs = model(input_values)
#         logits = outputs.logits  # (batch_size, time_steps, vocab_size)

#         # Compute input lengths (time steps) and target lengths (label lengths)
#         input_lengths = torch.tensor([logits.size(1)], dtype=torch.long).to(device)
#         target_lengths = torch.tensor([labels.size(0)], dtype=torch.long).to(device)

#         # Compute CTC loss
#         loss = loss_fn(
#             logits.log_softmax(2).permute(1, 0, 2),  # (time_steps, batch_size, vocab_size)
#             labels,
#             input_lengths,
#             target_lengths
#         ).requires_grad_(True)

#         # Backward pass
#         loss.backward()
#         optimizer.step()
#         optimizer.zero_grad()

#         # Optional: Print loss for monitoring
#         print(f"Training loss: {loss.item()}")

#     # Save the trained model and processor
#     torch.save(model.state_dict(), "trained_model.pth")
#     processor.save_pretrained("trained_model_processor")

#     return model, processor

def detect_silent_audio(audio_segment, silence_threshold=-50.0, chunk_size=5):
    silent_ranges = []
    start = None
    for i in range(0, len(audio_segment), chunk_size):
        chunk = audio_segment[i:i + chunk_size]
        if chunk.dBFS < silence_threshold:
            if start is None:
                start = i
        else:
            if start is not None:
                silent_ranges.append((start, i))
                start = None
    if start is not None:
        silent_ranges.append((start, len(audio_segment)))
    return silent_ranges

def analyze_video_for_cuts(video_path):
    video = cv2.VideoCapture(video_path)
    audio_path = 'temp_audio.wav'
    
    # Extract FPS from the video file
    fps = video.get(cv2.CAP_PROP_FPS)
    
    # Extract audio from the video file
    try:
        ffmpeg.input(video_path).output(audio_path).run(quiet=False, overwrite_output=True, capture_stdout=True, capture_stderr=True)
    except ffmpeg.Error as e:
        print("FFmpeg Error Output:\n", e.stderr.decode())
    audio = AudioSegment.from_wav(audio_path)

    # Detect silent parts in audio
    silence_threshold = -50.0
    audio_silent_ranges = detect_silent_audio(audio, silence_threshold)
    
    video_silent_ranges = []
    black_start = None
    frame_count = 0

    while True:
        ret, frame = video.read()
        if not ret:
            break
        
        frame_time = (frame_count / fps) * 1000  # convert frame count to ms using dynamic fps
        if is_black_frame(frame):
            if black_start is None:
                black_start = frame_time
        else:
            if black_start is not None:
                video_silent_ranges.append((black_start, frame_time))
                black_start = None
        frame_count += 1
    
    if black_start is not None:
        video_silent_ranges.append((black_start, frame_count / fps * 1000))

    cuts = []
    for video_range in video_silent_ranges:
        for audio_range in audio_silent_ranges:
            overlap_start = max(video_range[0], audio_range[0])
            overlap_end = min(video_range[1], audio_range[1])
            if overlap_start < overlap_end:
                # Extend the start and end of each cut by 200 ms
                adjusted_start = max(0, overlap_start - 200)
                adjusted_end = overlap_end + 200
                cuts.append((adjusted_start, adjusted_end))
        
    # Clean up
    video.release()
    print("Detected Cuts (in milliseconds):")
    for start, end in cuts:
        print(f"Cut from {start:.2f} ms to {end:.2f} ms")
    return cuts

def text_to_audio(text, sample_rate=16000):
    # Use gTTS to convert text to speech
    tts = gTTS(text)
    audio_io = io.BytesIO()
    tts.write_to_fp(audio_io)
    audio_io.seek(0)
    audio_segment = AudioSegment.from_file(audio_io, format="mp3")
    audio_segment = audio_segment.set_frame_rate(sample_rate).set_channels(1)
    
    # Convert to numpy array and normalize the samples
    samples = np.array(audio_segment.get_array_of_samples()).astype(np.float32)
    normalized_samples = samples / (2 ** 15)  # Normalize for 16-bit PCM
    return normalized_samples


# def generate_audio_with_trained_model(text, model, processor, vocoder=None, sample_rate=16000):
#     if vocoder is None:
#         # Fallback to gTTS-based synthesis if no vocoder is provided
#         return text_to_audio(text, sample_rate)
#     # Otherwise, use your TTS model and vocoder pipeline
#     # (This part would include your custom synthesis code)
#     mel_spectrogram = model.synthesize(text, speaker_embedding=None)  # Adjust accordingly
#     waveform = vocoder.infer_waveform(mel_spectrogram)
#     return waveform

def generate_audio_with_coqui_tts(text, speaker_wav="temp_audio.wav", sample_rate=16000):
    """
    Generate audio using Coqui TTS.
    
    Parameters:
      text (str): The text to synthesize.
      speaker_wav (str): Path to the reference speaker audio (your temp_audio.wav).
      sample_rate (int): The desired sample rate.
    
    Returns:
      waveform (np.array): The synthesized waveform as a numpy array.
    """
    try:
        # Use the Coqui TTS API; passing speaker_wav clones the voice from that file.
        waveform = tts.tts(text, language="en", speaker_wav=speaker_wav)
        return waveform
    except Exception as e:
        print(f"Error using Coqui TTS: {e}. Falling back to gTTS.")
        return text_to_audio(text, sample_rate)


def fill_video_cuts(cuts, video_path):
    video_clip = VideoFileClip(video_path)
    video = cv2.VideoCapture(video_path)
    
    # Extract FPS from the video file
    fps = video.get(cv2.CAP_PROP_FPS)

    # Extract resolution from the video file
    width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    resolution = f"{width}x{height}"

    fourcc = int(video.get(cv2.CAP_PROP_FOURCC))
    codec = "".join([chr((fourcc >> 8 * i) & 0xFF) for i in range(4)])

    clips = []
    previous_end = 0

    for start, end in cuts:
        if start > previous_end:
            clips.append(video_clip.subclip(previous_end / 1000.0, start / 1000.0))
        
        duration = (end - start) / 1000.0

        # Capture the last frame before the cut
        video.set(cv2.CAP_PROP_POS_MSEC, max(start - 1, 0))
        ret, last_frame = video.read()
        if not ret:
            print(f"Warning: Could not retrieve last frame before cut at {start} ms.")
            continue  # Skip this cut if no frame is available

        # Convert BGR to RGB and save as img0.png
        last_frame = cv2.cvtColor(last_frame, cv2.COLOR_BGR2RGB)
        cv2.imwrite(os.path.join(rife_folder, "img0.png"), last_frame)
        
        # Capture the first frame after the cut
        video.set(cv2.CAP_PROP_POS_MSEC, min(end + 1, video_clip.duration * 1000))
        ret, first_frame = video.read()
        if not ret:
            print(f"Warning: Could not retrieve first frame after cut at {end} ms.")
            continue
        
        # Convert BGR to RGB and save as img1.png
        first_frame = cv2.cvtColor(first_frame, cv2.COLOR_BGR2RGB)
        cv2.imwrite(os.path.join(rife_folder, "img1.png"), first_frame)

        num_of_frames = int(duration * fps)
        temp = np.log2(num_of_frames)

        # Run the RIFE interpolation and ffmpeg commands
        # command = [
        #     "python", inference_script,
        #     "--img", "img0.png", "img1.png",
        #     f"--exp={int(np.ceil(temp))}"
        # ]
        command2 = [
            "ffmpeg", "-y", "-r", str(fps), "-f", "image2",
            "-i", os.path.join(rife_folder, "output", "img%d.png"),
            "-s", resolution, "-c:v", codec,
            "-pix_fmt", "yuv420p",
            os.path.join(rife_folder, "output", "concat.mp4"),
            "-q:v", "0", "-q:a", "0"
        ]

        inference_img.fix_image(img=["RIFE/img0.png", "RIFE/img1.png"], exp=int(np.ceil(temp)), num=num_of_frames)
        print(f"this is the command:\n\n {command2}\n\n")
        subprocess.run(command2, cwd=rife_folder)

        output_dir = os.path.join(rife_folder, "output")
        for file_name in os.listdir(output_dir):
            if file_name.endswith('.png'):
                os.remove(os.path.join(output_dir, file_name))

        # Append the interpolated clip
        mp4_clip = VideoFileClip(os.path.join(rife_folder, "output", "concat.mp4"))
        clips.append(mp4_clip)
        
        previous_end = end
    
    if previous_end < video_clip.duration * 1000.0:
        clips.append(video_clip.subclip(previous_end / 1000.0, video_clip.duration))
    
    final_video = concatenate_videoclips(clips)
    
    # Handle audio by overlaying silence where needed
    audio_path = 'temp_audio.wav'
    ffmpeg.input(video_path).output(audio_path).run(quiet=True, overwrite_output=True)
    audio = AudioSegment.from_file(audio_path)
    
    for i, (start, end) in enumerate(cuts):
        duration = end - start
        if i < len(generated_audio_segments := []):  # In case there are no generated segments yet
            pass

    # Transcribe and fix subtitles, then train the model
    final_audio_path = "temp_filled_audio.wav"
    audio.export(final_audio_path, format="wav")

    result = transcribe_audio(final_audio_path)
    sub_writer = get_writer("srt", "./")
    sub_writer(result, final_audio_path)

    # Train or load the model to be used for synthesizing the missing words
    # device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # trained_model, trained_processor = train_model("temp_filled_audio.wav", "temp_filled_audio.srt")

    # Fix subtitles and get list of changed words (new_word_list)
    cuts_string = ",".join(f"{start:.2f}-{end:.2f}" for start, end in cuts)
    new_string = fix_subtitles_gpt("temp_filled_audio.srt", cuts_string)
    new_srt = new_string.split('$')[0]
    new_word_list = new_string.split('$')[1]

    # Convert new words from the fixed subtitles into audio using the trained model
    new_words = new_word_list.split("~")  # Assuming the words are separated by tilde (~)
    generated_audio_segments = []

    for i, word in enumerate(new_words):
        if not word.strip() or word.strip().lower() == "none":
            silence_duration_ms = 1000  # Duration in milliseconds
            num_samples = int(16000 * (silence_duration_ms / 1000.0))
            silence_audio_array = np.zeros(num_samples, dtype=np.float32)
            audio_segment_path = f"generated_segment_{i}.wav"
            sf.write(audio_segment_path, silence_audio_array, 16000)
            generated_audio_segments.append((audio_segment_path, "silence"))
        else:
            try:
                # generated_audio_array = generate_audio_with_trained_model(word, trained_model, trained_processor)
                generated_audio_array = generate_audio_with_coqui_tts(word, speaker_wav="temp_audio.wav")
                
                audio_segment_path = f"generated_segment_{i}.wav"
                sf.write(audio_segment_path, generated_audio_array, 16000)
                generated_audio_segments.append((audio_segment_path, word))
            except Exception as e:
                print(f"Error generating audio for word '{word}': {e}")

    # Reload the original audio
    audio = AudioSegment.from_file(audio_path)

    # Overlay generated audio segments onto the original audio at cut locations,
    # adjusting their volume to match the video's audio.
    for i, (start, end) in enumerate(cuts):
        duration = end - start
        if i < len(generated_audio_segments):
            generated_audio_segment_path, generated_text = generated_audio_segments[i]
            generated_audio_segment = AudioSegment.from_file(generated_audio_segment_path, format="wav")

            # Adjust volume to match the overall video's audio volume
            target_dBFS = audio.dBFS
            change_in_dBFS = target_dBFS - generated_audio_segment.dBFS
            generated_audio_segment = generated_audio_segment.apply_gain(change_in_dBFS)

            # Adjust audio length to match cut duration if needed
            if len(generated_audio_segment) > duration:
                generated_audio_segment = generated_audio_segment[:duration]
            elif len(generated_audio_segment) < duration:
                silence_pad = AudioSegment.silent(duration=(duration - len(generated_audio_segment)))
                generated_audio_segment += silence_pad

            # Overlay the generated audio at the correct position
            audio = audio.overlay(generated_audio_segment, position=start)

    # Save the final audio with the synthesized speech
    final_audio_path = "final_filled_audio.wav"
    audio.export(final_audio_path, format="wav")

    # Integrate the final audio into the video
    final_video = final_video.set_audio(AudioFileClip(final_audio_path))
    final_video.write_videofile("filled_output.mp4", codec="libx264", fps=fps)

    # Clean up temporary audio files
    os.remove(audio_path)
    os.remove(final_audio_path)
    for segment_path, _ in generated_audio_segments:
        os.remove(segment_path)

    print("Video with fixed audio has been successfully created: filled_output.mp4")

    # Load the video
    video_clip = VideoFileClip("filled_output.mp4")
    # Save to a new file
    video_clip.write_videofile(video_path, codec="libx264", audio_codec="aac")

# Example usage after detecting cuts
# cuts = analyze_video_for_cuts("output5.mp4")
# fill_video_cuts(cuts, "output5.mp4")


def main():    
    print("Current Working Directory:", os.getcwd())
    target_dir = r"C:\Users\Omer\Documents\GitHub\Leasy\services\server\public\storage"
    os.chdir(target_dir)
    print("Current Working Directory After The Change:", os.getcwd())

    parser = argparse.ArgumentParser(description="Process an argument.")
    parser.add_argument("input_value", type=str, help="An input value to process")
    args = parser.parse_args()

    print(f"Received argument: {args.input_value}")

    cuts = analyze_video_for_cuts(args.input_value)
    if cuts:
        fill_video_cuts(cuts, args.input_value)
    else:
        print("No cuts found")
    # Restore stdout and stderr before printing "ok"
    sys.stdout = real_stdout
    sys.stderr = real_stderr
    print("ok")

if __name__ == "__main__":
    main()
