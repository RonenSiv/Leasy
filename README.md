# Leasy (Learning Made Easy) 📚✨

## Project Overview

Leasy is a comprehensive web application designed to enhance the learning experience by providing various tools to
interact with video content. The platform allows users to upload videos and gain enriched outputs including enhanced
audio and video quality, transcriptions, summaries, quizlets, and an interactive chatbot to ask questions related to the
video content.

## Features

1. **Video and Audio Enhancement** 🎥🔊
    - Upload a video and receive enhanced versions with improved audio and visual quality.

2. **Video Transcription** 📝
    - Automatic generation of accurate transcriptions for uploaded videos.

3. **Video Summarization** ✂️📄
    - Summarizes the video content to provide a concise overview.

4. **Quizlet Generation** ❓🗂
    - Creates interactive quizlets based on the video content to aid in knowledge retention.

5. **Chatbot Interaction** 🤖💬
    - An AI-powered chatbot that answers questions related to the video content.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- Python 3.7+ installed
- Access to Google Cloud API for transcription and summarization services
- Access to a video enhancement API or library
- Access to a chatbot framework (e.g., Rasa, Dialogflow)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/leasy.git
   cd leasy
   ```
2. **Backend Setup**
    - Navigate to the backend directory and install dependencies:
       ```bash
       cd backend
       pip install -r requirements.txt
       ```
    - Configure environment variables for API keys and database settings
       ```bash
       cp ..env.example ..env
       ```
    - Run the backend server:
      ```bash
      php artisan serve
      ```
3. **Frontend Setup**
    - Navigate to the frontend directory and install dependencies:
      ```bash
      cd frontend
      npm install
      ```
    - Start the frontend development server
      ```bash
      npm start
      ```

## Usage

1. **Upload a Video** ⬆️🎞
    - Use the upload feature on the home page to select and upload a video file.

2. **Enhance Video and Audio** 🌟
    - Once uploaded, the system automatically enhances the video and audio quality.

3. **View Transcription** 📃
    - Navigate to the transcription tab to view the generated transcript of the video.

4. **View Summarization** 📄
    - The summarization tab provides a concise summary of the video content.

5. **Quizlet Interaction** 🗂
    - Access the quizlet tab to interact with quizlets generated from the video content.

6. **Chatbot** 🤖
    - Use the chatbot feature to ask questions related to the video and receive instant responses.

## Made By

This project was developed with passion and dedication by the Leasy team:

- [Ofir Goldberg](https://github.com/ofirgoldofir) - Backend Developer
- [Ronen Sivak](https://github.com/RonenSiv) - Frontend Developer
- [Omer Groman](https://github.com/zildogga) - Machine Learning Engineer
- [Ofir Goldberg](https://github.com/ofirgoldofir), [Omer Groman](https://github.com/zildogga), [Ronen Sivak](https://github.com/RonenSiv) -
  UX/UI Designers

## License

This project uses the following license: [MIT License](LICENSE).

