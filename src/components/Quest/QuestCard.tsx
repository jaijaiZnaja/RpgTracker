import React, { useState, useEffect } from 'react';
import { Quest } from '../../types';
import { CheckCircle, Clock, Trophy, Star, Gift } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { getQuestTimeRemaining, isQuestTimerExpired, formatTimeRemaining, QUEST_DURATIONS } from '../../types';

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  onDelete: (questId: string) => void;
  onClaimReward?: (questId: string) => void;
  showActions?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onDelete,
  onClaimReward,
  showActions = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!quest.duration || !quest.startedAt || quest.isCompleted) return;

    const updateTimer = () => {
      const remaining = getQuestTimeRemaining(quest);
      setTimeRemaining(remaining);
      setIsExpired(isQuestTimerExpired(quest));
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [quest.duration, quest.startedAt, quest.isCompleted]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      case 'epic':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Clock className="w-4 h-4" />;
      case 'weekly':
        return <Star className="w-4 h-4" />;
      case 'main':
        return <Trophy className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const handleStartQuest = () => {
    // Start the timer by setting startedAt to current time
    const updatedQuest = {
      ...quest,
      startedAt: new Date().toISOString(),
    };
    // This would need to be handled by the parent component
    // For now, we'll just call onComplete to simulate starting
    onComplete(quest.id);
  };

  const handleClaimReward = () => {
    if (onClaimReward) {
      onClaimReward(quest.id);
    } else {
      onComplete(quest.id);
    }
  };

  const isTimerQuest = quest.duration && quest.startedAt;
  const canClaimReward = isTimerQuest && isExpired && !quest.isCompleted;
  const isTimerRunning = isTimerQuest && !isExpired && !quest.isCompleted;
  const needsToStart = quest.duration && !quest.startedAt && !quest.isCompleted;

  return (
    <Card className={`p-4 ${quest.isCompleted ? 'opacity-75 bg-gray-50' : ''} ${canClaimReward ? 'ring-2 ring-gold-400 bg-gold-50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quest.difficulty)}`}>
            {getTypeIcon(quest.type)}
            <span className="ml-1 capitalize">{quest.type}</span>
          </div>
          {quest.duration && (
            <div className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600">
              {QUEST_DURATIONS[quest.duration].label}
            </div>
          )}
        </div>
        {quest.isCompleted && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        {canClaimReward && (
          <Gift className="w-5 h-5 text-gold-500 animate-bounce" />
        )}
      </div>

      <h3 className={`font-semibold mb-2 ${quest.isCompleted ? 'line-through text-gray-600' : 'text-gray-800'}`}>
        {quest.title}
      </h3>
      
      <p className={`text-sm mb-4 ${quest.isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
        {quest.description}
      </p>

      {/* Timer Display */}
      {isTimerQuest && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {isExpired ? 'Timer Completed!' : 'Time Left:'}
              </span>
            </div>
            <div className={`text-sm font-mono font-bold ${
              isExpired ? 'text-green-600' : 
              timeRemaining < 300000 ? 'text-red-600' : // Less than 5 minutes
              'text-gray-800'
            }`}>
              {isExpired ? '00:00:00' : formatTimeRemaining(timeRemaining)}
            </div>
          </div>
          {canClaimReward && (
            <div className="mt-2 text-xs text-gold-600 font-medium">
              🎉 Ready to claim rewards!
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center text-experience">
            <Trophy className="w-3 h-3 mr-1" />
            {quest.rewards.experience} XP
          </div>
          <div className="flex items-center text-gold-600">
            <span className="w-3 h-3 mr-1 bg-gold-500 rounded-full"></span>
            {quest.rewards.gold} Gold
          </div>
          {quest.rewards.skillPoints && (
            <div className="flex items-center text-mystical-600">
              <Star className="w-3 h-3 mr-1" />
              {quest.rewards.skillPoints} SP
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex space-x-2">
          {needsToStart && (
            <Button
              onClick={handleStartQuest}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              Start Quest
            </Button>
          )}
          
          {canClaimReward && (
            <Button
              onClick={handleClaimReward}
              variant="gold"
              size="sm"
              className="flex-1 animate-pulse"
            >
              <Gift className="w-4 h-4 mr-1" />
              Claim Reward
            </Button>
          )}
          
          {!quest.isCompleted && !needsToStart && !canClaimReward && !isTimerRunning && (
            <Button
              onClick={() => onComplete(quest.id)}
              variant="success"
              size="sm"
              className="flex-1"
            >
              Complete Quest
            </Button>
          )}

          {isTimerRunning && (
            <div className="flex-1 text-center text-sm text-gray-500 py-2">
              Quest in progress...
            </div>
          )}

          {!quest.isCompleted && (
            <Button
              onClick={() => onDelete(quest.id)}
              variant="danger"
              size="sm"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default QuestCard;