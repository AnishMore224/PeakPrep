import React from 'react';
import { CheckCircle, AlertCircle, FileUp } from 'lucide-react';
import { ScoreGauge } from './ScoreGauge';

interface AnalysisResultsProps {
  score: number;
  onReset: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ score, onReset }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <ScoreGauge score={score} />
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 px-2">
            Key Findings
          </h3>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-3 sm:mb-4">Strengths</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-green-700">Strong keyword optimization for your industry</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-green-700">Clear section organization</span>
                </li>
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-3 sm:mb-4">Areas to Improve</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-amber-700">Add more quantifiable achievements</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-amber-700">Use more ATS-friendly section headers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-base sm:text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <FileUp className="w-5 h-5 mr-2" />
          Upload New Resume
        </button>
      </div>
    </div>
  );
};