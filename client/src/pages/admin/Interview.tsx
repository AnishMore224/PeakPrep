import React, { useState, useRef, useEffect } from "react";
import { Upload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Interview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [_isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStreamDestination = useRef<MediaStreamAudioDestinationNode | null>(
    null
  );
  const FLASK_API = import.meta.env.VITE_FLASK_API as string;

  useEffect(() => {
    if (isInterviewStarted) {
      startInterviewSession();

      // Speak the first question after a delay
      setTimeout(() => {
        speakQuestion(questions[currentQuestionIndex], () => {});
      }, 3000); // Delay the first question by 3 seconds
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [isInterviewStarted]);

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);

    const file = event.target.files?.[0];
    if (file) {
      if (fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append("resume", fileInputRef.current.files[0]);

        fetch(`${FLASK_API}/generate_questions`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setQuestions(data.questions);
          })
          .catch((error) => {
            console.error("Error generating questions:", error);
          })
          .finally(() => {
            setIsLoading(false);
            setHasUploadedResume(true);
          });
      } else {
        setIsLoading(false);
      }
    }
  };

  const startInterviewSession = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Initialize AudioContext and MediaStreamDestination
      audioContext.current = new AudioContext();
      mediaStreamDestination.current =
        audioContext.current.createMediaStreamDestination();

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm",
      });

      recordedChunksRef.current = []; // Reset recorded chunks

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data); // Store directly in ref
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.onstop = uploadRecording;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
  };

  const speakQuestion = (question: string, callback: () => void) => {
    const questionWithMark = question + "?";
    const utterance = new SpeechSynthesisUtterance(questionWithMark);
    utterance.lang = "en-US";
    utterance.onend = callback; // Callback to proceed to next action after speech
    utterance.volume = 1; // Set the speech volume to max
    utterance.rate = 1; // Set the speech rate to normal
    utterance.pitch = 1; // Set the speech pitch to normal
    window.speechSynthesis.speak(utterance);
  };

  const uploadRecording = async () => {
    if (recordedChunksRef.current.length === 0) {
      console.warn("No recorded chunks found.");
      return;
    }

    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "interview-recording.webm";
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    const formData = new FormData();
    formData.append("video", blob, "interview-recording.webm");

    try {
      const response = await fetch(`${FLASK_API}/complete_interview`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      // Navigate to the results page with the data
      navigate("/interview-result", { state: data });
    } catch (error) {
      console.error("Error uploading recording:", error);
    }
  };

  const completeQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      // Move to the next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      // Speak the next question after updating the index
      speakQuestion(questions[nextIndex], () => {});
    } else {
      stopRecording(); // Stop and upload recording when the interview is completed
    }
  };

  const startInterview = () => {
    setIsInterviewStarted(true);
  };

  if (!isInterviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-center">
              AI Video Interview
            </h1>
            <div className="space-y-6">
              <div className="text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleResumeUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center space-x-2"
                  disabled={hasUploadedResume}
                >
                  {hasUploadedResume ? (
                    <>
                      <Check size={20} />
                      <span>Resume Uploaded</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Upload Resume</span>
                    </>
                  )}
                </button>
                {isLoading && (
                  <div className="text-center text-gray-400 p-4">
                    Your interview is getting ready...
                  </div>
                )}
              </div>
              {hasUploadedResume && !isLoading && (
                <button
                  onClick={startInterview}
                  className="w-full py-4 bg-green-500 hover:bg-green-600 rounded-lg font-semibold"
                >
                  Start Interview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">AI Video Interview</h1>
          <p className="text-gray-300">
            Answer each question clearly and professionally
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg bg-black"
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Current Question:</h2>
              <p className="text-lg text-gray-300">
                {questions[currentQuestionIndex]}
              </p>
            </div>

            <div className="space-y-4">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={completeQuestion}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <Check size={20} />
                  <span>Next Question</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold"
                >
                  Complete Interview
                </button>
              )}
            </div>

            <div className="mt-6">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>
              <p className="text-center mt-2 text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
