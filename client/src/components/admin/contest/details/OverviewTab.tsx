import React from "react";
import { CodingContestType, DailyContestType } from "../../../../types";
import { Clock, Users, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

interface OverviewTabProps {
  contest: DailyContestType | CodingContestType;
  timeLeft: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ contest, timeLeft }) => (
  <div className="space-y-6">
    {/* Time Section */}
    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-blue-600" />
        <span className="text-sm text-gray-600">Time Remaining:</span>
      </div>
      <span className="text-lg font-semibold text-blue-600">{timeLeft}</span>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Participants</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{contest.participants.length}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Questions</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{contest.questions.length}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Completed</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {contest.participants.filter(p => p.status === "Completed").length}
        </p>
      </div>
    </div>

    {/* Rules Section */}
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center space-x-2 mb-4">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Contest Rules</h2>
      </div>
      <div className="space-y-2">
        {contest.rules?.split('\n').map((rule, index) => (
          <p key={index} className="text-gray-600">{rule}</p>
        ))}
      </div>
    </div>
  </div>
);

export default OverviewTab;