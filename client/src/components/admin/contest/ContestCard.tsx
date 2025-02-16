import React from 'react';
import { Calendar, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { DailyContestType, CodingContestType } from '../../../types/index';

interface ContestCardProps {
    contest: DailyContestType | CodingContestType;
    type: 'daily' | 'coding';
    onEdit: (contest: DailyContestType | CodingContestType) => void;
    onDelete: (contest: DailyContestType | CodingContestType) => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, type, onEdit, onDelete }) => {

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
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(contest)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                    >
                        <Edit size={20} />
                    </button>
                    <button
                        onClick={() => onDelete(contest)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
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
            
            <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium cursor-pointer">
                    {type === 'daily' ? 'Daily Contest' : 'Coding Contest'}
                </span>
            </div>
        </div>
    );
};

export default ContestCard;