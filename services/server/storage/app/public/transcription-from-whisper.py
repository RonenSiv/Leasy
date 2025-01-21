# print_path.py
import whisper
import sys

def transcribe_audio():
    audio_path = sys.argv[1]
    model = whisper.load_model("base")  # You can use 'small', 'medium', 'large', etc.
    result = model.transcribe(audio=audio_path, language="he", fp16=False)
    return result['text']

if __name__ == "__main__":
    result = transcribe_audio()
    if result:
        print(result)  
#--------------------------------------------------------------------------------------------
# import openai
# import sys

# # Get the OpenAI API key and audio file path from command line arguments
# audio_file_path = sys.argv[1]  # First argument is the API key
# openai.api_key = sys.argv[2]  # Second argument is the audio file path

# # Transcribe the audio file
# with open(audio_file_path, "rb") as audio_file:
#     transcription = openai.Audio.transcribe(
#         model="whisper-1",
#         file=audio_file
#     )

# # Print the transcription text
# print(transcription["text"])

