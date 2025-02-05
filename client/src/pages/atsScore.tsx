import React, { useState, useRef } from 'react';
import { FileUpload } from '../components/atsScore/Upload';
import { LoadingState } from '../components/atsScore/LoadingState';
import { AnalysisResults } from '../components/atsScore/AnalysisResults';

function atsScore() {
  const [file, setFile] = useState<File | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setScore(77);
      setAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setScore(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Resume ATS Analyzer
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Upload your resume to analyze its ATS compatibility and get detailed feedback
            to improve your chances of getting past automated screening systems.
          </p>
        </div>

        {analyzing ? (
          <LoadingState />
        ) : !score ? (
          <FileUpload onFileUpload={handleFileUpload} fileInputRef={fileInputRef} />
        ) : (
          <AnalysisResults score={score} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default atsScore;