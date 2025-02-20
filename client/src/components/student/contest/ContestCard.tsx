import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DailyContestType, CodingContestType } from '../../../types/index';

interface ContestCardProps {
  contest: DailyContestType | CodingContestType;
  type: 'daily' | 'coding';
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, type }) => {
  const navigate = useNavigate();
  // const now = new Date();
  // const isOngoing = now >= new Date(contest.startTime) && now <= new Date(contest.endTime);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-blue-700">{contest.title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">
        {contest.description || 'No description provided'}
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center text-gray-600 cursor-pointer">
          <Calendar size={18} className="mr-2" />
          <span>{formatDate(contest.startTime)}</span>
        </div>
        
        <div className="flex items-center text-gray-600 cursor-pointer">
          <Clock size={18} className="mr-2" />
          <span>{formatTime(contest.startTime)} - {formatTime(contest.endTime)}</span>
        </div>
        
        <div className="flex items-center text-gray-600 cursor-pointer">
          <Users size={18} className="mr-2" />
          <span>{contest.participants.length} Participants</span>
        </div>
      </div>  
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium cursor-pointer">
          {type === 'daily' ? 'Daily Contest' : 'Coding Contest'}
        </span>
        <button
          className="btn cursor-pointer px-4 py-2 text-blue-700 border border-blue-700 rounded-full transition-colors duration-300 transform hover:scale-105"
          onClick={() => navigate(type === 'daily' ? `/contest/daily/${contest._id}` : `/contest/coding/${contest._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ContestCard;
