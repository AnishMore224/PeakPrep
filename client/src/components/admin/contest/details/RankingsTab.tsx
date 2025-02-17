import React from "react";
import { CodingContestType, DailyContestType } from "../../../../types";
import { Trophy } from "lucide-react";

interface RankingsTabProps {
  contest: DailyContestType | CodingContestType;
}

const RankingsTab: React.FC<RankingsTabProps> = ({ contest }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-6">Rankings</h2>
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...contest.participants]
            .sort((a, b) => b.score - a.score)
            .map((participant, index) => (
              <tr key={participant.studentId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index < 3 && <Trophy className="w-4 h-4 text-yellow-400 mr-2" />}
                    <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.score}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    participant.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {participant.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(participant.score / 100) * 100}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RankingsTab;