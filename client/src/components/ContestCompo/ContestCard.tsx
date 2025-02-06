import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ContestCardProps {
  title: string;
  description: string;
  icon: typeof LucideIcon;
  iconColor: string;
  buttonColor: string;
  onClick: () => void;
}

const ContestCard = ({ title, description, icon: Icon, iconColor, buttonColor, onClick }: ContestCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="flex flex-col items-center text-center">
        <Icon className={`w-16 h-16 ${iconColor} mb-4`} />
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <button 
          className={`px-6 py-3 ${buttonColor} text-white rounded-full transition-colors duration-300 transform hover:scale-105`}
        >
          Start Challenge
        </button>
      </div>
    </div>
  );
};

export default ContestCard;