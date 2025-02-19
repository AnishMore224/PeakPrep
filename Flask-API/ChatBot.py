from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import base64
import os
import io
from PIL import Image
import pdf2image
import google.generativeai as genai
import asyncio
import cv2
import PyPDF2
from openvino import Core
from deepgram import Deepgram
import speech_recognition as sr
from moviepy.video.io.VideoFileClip import VideoFileClip
import tempfile
import ffmpeg

# Load environment variables
load_dotenv()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
dg_client = Deepgram(os.getenv("DEEPGRAM_API_KEY"))
PORT=os.getenv("PORT")

# Load the OpenVINO face detector model
model_xml = "models/face-detection-adas-0001.xml"
model_bin = "models/face-detection-adas-0001.bin"
ie = Core()
net = ie.read_model(model=model_xml, weights=model_bin)
exec_net = ie.compile_model(model=net, device_name="CPU")
input_blob = net.input(0)
out_blob = net.output(0)

# Load Head Pose Estimation Model
head_pose_model_xml = "models/head-pose-estimation-adas-0001.xml"
head_pose_model_bin = "models/head-pose-estimation-adas-0001.bin"
head_pose_net = ie.read_model(model=head_pose_model_xml, weights=head_pose_model_bin)
head_pose_exec_net = ie.compile_model(model=head_pose_net, device_name="CPU")

# Get input and output layers
head_pose_input_blob = head_pose_net.input(0)
yaw_output_blob = head_pose_net.output(0)   # Yaw (left-right movement)
pitch_output_blob = head_pose_net.output(1) # Pitch (up-down movement)
roll_output_blob = head_pose_net.output(2)  # Roll (tilt movement)

app = Flask(__name__)
CORS(app)

def get_gemini_response(input_text, pdf_content, chat_history):
    model = genai.GenerativeModel('gemini-1.5-flash')
    # Include chat history in the input
    full_input = chat_history + [input_text, pdf_content[0]]
    response = model.generate_content(full_input)
    return response.text

def get_gemini_response_resume(input, pdf_content, prompt):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([input, pdf_content[0], prompt])
    return response.text

def input_pdf_setup(uploaded_file):
    if uploaded_file is not None:
        # Convert PDF to image
        images = pdf2image.convert_from_bytes(uploaded_file.read())
        first_page = images[0]
        # Convert image to bytes
        img_byte_arr = io.BytesIO()
        first_page.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        pdf_parts = [
            {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_arr).decode()
            }
        ]
        return pdf_parts
    else:
        raise FileNotFoundError("No file uploaded")
    
def input_pdf_setup_text(uploaded_file):
    if uploaded_file:
        # Read the PDF file from the uploaded file object
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(uploaded_file.read()))
        
        # Extract text from all pages
        text = "".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
        
        return text
    else:
        raise FileNotFoundError("No file uploaded")
    
def analyze_video(video_path):
    """Detects suspicious activities from the interview video and returns the processed frames."""
    # with open("temp_video.mp4", "wb") as buffer:
    #     buffer.write(file.read())
    # cap = cv2.VideoCapture("temp_video.mp4")
    
    cap = cv2.VideoCapture(video_path)
    suspicious_detected = False
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * 5)  # Process every 5 seconds

    frame_count = 0
    processed_frames = []

    print("Processing video frames...")
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
        if frame_count % frame_interval != 0:
            continue

        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(frame, size=(672, 384), ddepth=cv2.CV_8U)

        # Perform face detection inference
        infer_request = exec_net.create_infer_request()
        infer_request.infer({input_blob.any_name: blob})
        result = infer_request.get_output_tensor(0).data
        print("Face detection inference done")
        faces_detected = 0
        for detection in result[0][0]:
            confidence = detection[2]
            if confidence > 0.5:
                faces_detected += 1
                xmin, ymin, xmax, ymax = int(detection[3] * w), int(detection[4] * h), int(detection[5] * w), int(detection[6] * h)
                cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (255, 0, 0), 2)

        # Flag suspicious if no face or multiple faces detected
        if faces_detected != 1:
            suspicious_detected = True
            cv2.putText(frame, "Suspicious Activity!", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        print("Face detection done")
        # Head Pose Estimation
        if faces_detected == 1:
            face_roi = frame[ymin:ymax, xmin:xmax]
            if face_roi.size > 0:
                face_blob = cv2.dnn.blobFromImage(face_roi, size=(60, 60), ddepth=cv2.CV_32F)
                head_pose_request = head_pose_exec_net.create_infer_request()
                head_pose_request.infer({head_pose_input_blob.any_name: face_blob})

                # yaw = head_pose_request.get_output_tensor(yaw_output_blob).data[0]
                # pitch = head_pose_request.get_output_tensor(pitch_output_blob).data[0]
                yaw = head_pose_request.get_output_tensor(0).data[0][0]
                pitch = head_pose_request.get_output_tensor(1).data[0][0]
                # roll = head_pose_request.get_output_tensor(2).data[0][0]


                # Mark suspicious if head is looking away (threshold: >20 degrees)
                if abs(yaw) > 20 or abs(pitch) > 20:
                    suspicious_detected = True
                    cv2.putText(frame, "Suspicious Head Movement!", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        print("Head pose estimation done")
        # Save the processed frame
        frame_filename = f"frame_{frame_count}.jpg"
        cv2.imwrite(frame_filename, frame)
        with open(frame_filename, "rb") as img_file:
            b64_string = base64.b64encode(img_file.read()).decode('utf-8')
            processed_frames.append(b64_string)
        os.remove(frame_filename)

    cap.release()
    print("Video processed")

    response_video = {"suspicious_activity": suspicious_detected, "frames": processed_frames}
    return response_video

def extract_audio_from_video(video_file):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
        video = VideoFileClip(video_file)
        video.audio.write_audiofile(temp_audio_file.name)
        video.close()  # Ensure the video file is properly closed
        print(f"Audio extracted to: {temp_audio_file.name}")
        return temp_audio_file.name

async def transcribe_audio(audio_file):
    with open(audio_file, 'rb') as audio:
        source = {'buffer': audio, 'mimetype': 'audio/wav'}
        print("Transcribing audio...")
        response = await dg_client.transcription.prerecorded(source, {'punctuate': True})
        transcript = response.get('results', {}).get('channels', [{}])[0].get('alternatives', [{}])[0].get('transcript', '')
        return transcript

def analyze_audio(video_path):
    if video_path:
            audio_file = extract_audio_from_video(video_path)
            audio_transcription = asyncio.run(transcribe_audio(audio_file))
            # os.remove(audio_file)
            return audio_transcription
    return "No audio file found."
            

def convert_webm_to_mp4(input_file_path):
    """Converts WebM video to MP4 format using temporary files."""
    try:
        # Create a temporary directory for the converted file
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_mp4_file:
            output_file_path = temp_mp4_file.name
            
            # Perform the conversion using FFmpeg and ensure audio is included
            ffmpeg.input(input_file_path).output(output_file_path, vcodec='libx264', acodec='aac').run(overwrite_output=True)
            print(f"Video converted to MP4: {output_file_path}")
            return output_file_path
    except ffmpeg.Error as e:
        print(f"Error converting WebM to MP4: {e}")
        return None
            
@app.route("/api/complete_interview", methods=["POST"])
def complete():
    ''' Detects the completion of the interview and returns the completion status. like the suspicious activities summary from audio and feedback'''
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400
    print("Video uploaded")
    file = request.files["video"]
    
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_webm_file:
        temp_webm_path = temp_webm_file.name
        with open(temp_webm_path, "wb") as f:
            f.write(file.read())

    # Convert WebM to MP4 using tempfile
    converted_video_path = convert_webm_to_mp4(temp_webm_path)
    
    if not converted_video_path:
        return jsonify({"error": "Error converting video to MP4"}), 500
    
    # Analyze the video for suspicious activities
    response_video = analyze_video(converted_video_path)
    response_audio = analyze_audio(converted_video_path)
    
    # Clean up temporary files
    # os.remove(temp_webm_path)
    # os.remove(converted_video_path)
    
    return jsonify({"suspicious_activity": response_video["suspicious_activity"], "frames": response_video["frames"],"audio":response_audio})    
    

@app.route("/api/generate_questions", methods=["POST"])
def generate_questions():
    """Generates interview questions based on resume PDF and job description using Gemini-1.5-Flash."""
    if "resume" not in request.files:
        return jsonify({"error": "No resume file uploaded"}), 400

    resume_file = request.files["resume"]
    job_desc = request.form.get("job_desc", "")

    try:
        # Extract text from the uploaded resume PDF
        resume_text = input_pdf_setup_text(resume_file)
        
        # Initialize Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"Generate five interview questions based on this resume: {resume_text} and job description: {job_desc}. Return each question as a separate line."
        
        response = model.generate_content(prompt)

        # Split response into an array of questions
        questions = response.text.split("\n")  # Splitting by newline

        # Clean up empty lines
        questions = [q.strip() for q in questions if q.strip()]

        return jsonify({"questions": questions})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/pdf-to-image', methods=['POST'])
def pdf_to_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    try:
        
        pdf_content = input_pdf_setup(file)
        return jsonify(pdf_content)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gemini-response', methods=['POST'])
def gemini_response():

    data = request.get_json()
    input_text = data.get('inputText')
    pdf_content = data.get('pdfContent')
    chat_history = data.get('chatHistory')
    try:
        response_text = get_gemini_response(input_text, pdf_content, chat_history)
        return jsonify({'text': response_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/gemini-response-resume', methods=['POST'])
def gemini_response_resume():
    job_description = request.form['jobDescription']
    prompt = request.form['prompt']
    file = request.files['file']
    print(job_description, prompt, file)
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    try:
        pdf_content = input_pdf_setup(file)
        response = get_gemini_response_resume(job_description, pdf_content, prompt)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(PORT) if PORT else 5000)
