import React from 'react';

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const calculateArcPath = (score: number) => {
    const radius = 40;
    const startAngle = -180;
    const endAngle = 0;
    const scoreAngle = startAngle + ((endAngle - startAngle) * score) / 100;
    
    const startX = 50 - radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = 45 - radius * Math.sin((startAngle * Math.PI) / 180);
    const scoreX = 50 - radius * Math.cos((scoreAngle * Math.PI) / 180);
    const scoreY = 45 - radius * Math.sin((scoreAngle * Math.PI) / 180);

    const largeArcFlag = scoreAngle - startAngle <= 180 ? "0" : "1";

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${scoreX} ${scoreY}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="relative w-48 h-24 sm:w-64 sm:h-32 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 50">
        <path
          d="M 10 45 A 40 40 0 1 1 90 45"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d={calculateArcPath(score)}
          fill="none"
          stroke={score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444"}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[-20%] text-center">
        <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 font-medium">/100</div>
      </div>
    </div>
  );
};