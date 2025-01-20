# print_path.py
import whisper
import sys

def transcribe_audio():
    # Check if the user passed a path as a command-line argument
    if len(sys.argv) < 2:
        print("Please provide a path.")
        return
    
    audio_path = sys.argv[1]
    model = whisper.load_model("base")  # You can use 'small', 'medium', 'large', etc.
    result = model.transcribe(audio=audio_path, language="he", fp16=False)
    return result['text']

if __name__ == "__main__":
    result = transcribe_audio()
    if result:
        print(result, end='')  