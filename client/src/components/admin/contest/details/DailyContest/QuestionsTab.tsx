import React from "react";
import { DailyContestType } from "../../../../../types";
import { BookOpen, Edit, Trash2 } from "lucide-react";

interface QuestionsTabProps {
  contest: DailyContestType;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ contest }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Questions</h2>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
        <BookOpen className="w-4 h-4" />
        <span>Add Question</span>
      </button>
    </div>
    <div className="space-y-4">
      {contest.questions.map((question, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">Question {index + 1}</h3>
            <div className="flex space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{question.questionText}</p>
          <div className="space-y-2">
            {question.options?.map((option, optIndex) => (
              <div key={optIndex} className={`p-3 rounded-lg ${
                option === question.correctAnswer 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50'
              }`}>
                {option}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default QuestionsTab;