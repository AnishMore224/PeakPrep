import { useLocation } from "react-router-dom";
export function InterviewResults() {
  const location = useLocation();
  const { suspicious_activity, frames, audio } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Interview Results</h1>
          <p className="text-gray-300">Suspicious activity analysis from your interview.</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Suspicious Activity:</h2>
          <p className={`text-lg ${suspicious_activity ? "text-red-500" : "text-green-500"}`}>
            {suspicious_activity ? "Suspicious activity detected" : "No suspicious activity detected"}
          </p>

          <h3 className="text-lg font-semibold mt-6">Video Frames:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {frames?.map((frame : string, index : number) => (
              <div key={index} className="flex justify-center">
                <img
                  src={`data:image/jpeg;base64,${frame}`}
                  alt={`Frame ${index + 1}`}
                  className="rounded-lg shadow-lg w-full max-w-xs"
                />
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-6">Audio Transcription:</h3>
          <p className="text-gray-300">{audio}</p>
        </div>
      </div>
    </div>
  );
}
