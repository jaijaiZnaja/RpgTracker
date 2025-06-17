import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  color?: 'health' | 'mana' | 'experience' | 'gold';
  showText?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  color = 'experience',
  showText = true,
  className = '',
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  const colorClasses = {
    health: 'bg-health',
    mana: 'bg-mana',
    experience: 'bg-experience',
    gold: 'bg-gold-500',
  };

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-800">
            {current} / {max}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;