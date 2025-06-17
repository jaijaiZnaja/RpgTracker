import React from 'react';
import { Quest } from '../../types';
import { CheckCircle, Clock, Trophy, Star } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  onDelete: (questId: string) => void;
  showActions?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onDelete,
  showActions = true,
}) => {
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

  return (
    <Card className={`p-4 ${quest.isCompleted ? 'opacity-75 bg-gray-50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quest.difficulty)}`}>
            {getTypeIcon(quest.type)}
            <span className="ml-1 capitalize">{quest.type}</span>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty.toUpperCase()}
          </div>
        </div>
        {quest.isCompleted && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>

      <h3 className={`font-semibold mb-2 ${quest.isCompleted ? 'line-through text-gray-600' : 'text-gray-800'}`}>
        {quest.title}
      </h3>
      
      <p className={`text-sm mb-4 ${quest.isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
        {quest.description}
      </p>

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

      {showActions && !quest.isCompleted && (
        <div className="flex space-x-2">
          <Button
            onClick={() => onComplete(quest.id)}
            variant="success"
            size="sm"
            className="flex-1"
          >
            Complete Quest
          </Button>
          <Button
            onClick={() => onDelete(quest.id)}
            variant="danger"
            size="sm"
          >
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
};

export default QuestCard;