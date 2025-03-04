import whisper
import sys
import os
import json

def transcribe_audio(audio_path):  
    model = whisper.load_model("base")  # Load the Whisper model
    result = model.transcribe(audio=audio_path, language="en", fp16=False)
    return result["segments"]  # Returning the segments with timestamps

def format_timestamp(seconds):
    """Convert seconds to HH:MM:SS,MS format."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)
    milliseconds = int((seconds % 1) * 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"

def main():
    if len(sys.argv) < 2:
        print("Usage: python script.py <audio_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]  
    segments = transcribe_audio(audio_path)  # Get transcription with timestamps
    
    transcription_data = [
        {
            "start": format_timestamp(segment["start"]),
            "end": format_timestamp(segment["end"]),
            "text": segment["text"]
        }
        for segment in segments
    ]
    
    json_output = json.dumps(transcription_data, ensure_ascii=False, indent=4)
    
    print(json_output)  # Print JSON to return to frontend

if __name__ == "__main__":
    main()
