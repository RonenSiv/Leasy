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
