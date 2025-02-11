import React from "react";

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  // Ensure score stays within range (0-100)
  const validScore = Math.min(100, Math.max(0, score));

  // Calculate circumference of the circle
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dashoffset based on score
  const dashOffset = circumference - (validScore / 100) * circumference;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500 stroke-green-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-red-500 stroke-red-500";
  };

  return (
    <div className="relative size-56 m-auto flex items-center justify-center">
      <svg className="transform -rotate-90 w-72 h-72" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-300 dark:text-neutral-700"
        />

        {/* Dynamic score circle */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          stroke="currentColor"
          strokeWidth="3.5"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={`stroke-current ${getScoreColor(validScore)}`}
        />
      </svg>

      {/* Score display */}
      <span className="absolute text-5xl" style={{ color: getScoreColor(validScore) }}>
        {validScore}%
      </span>
    </div>
  );
};
