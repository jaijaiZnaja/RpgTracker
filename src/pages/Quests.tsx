import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import QuestCard from '../components/Quest/QuestCard';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Card from '../components/UI/Card';
import { Quest, QuestType, QuestDuration, QUEST_DURATIONS } from '../types';

const Quests: React.FC = () => {
  const { quests, addQuest, completeQuest, deleteQuest } = useGame();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | QuestType>('all');
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    type: 'daily' as QuestType,
    duration: '2h' as QuestDuration,
    isActive: true,
  });

  const handleAddQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuest.title.trim()) return;

    // Get rewards based on duration
    const durationConfig = QUEST_DURATIONS[newQuest.duration];
    const rewards = {
      experience: durationConfig.experience,
      gold: durationConfig.gold,
      skillPoints: newQuest.type === 'weekly' ? 1 : undefined,
    };

    addQuest({
      ...newQuest,
      difficulty: 'medium', // Default difficulty for compatibility
      rewards,
    });

    setNewQuest({
      title: '',
      description: '',
      type: 'daily',
      duration: '2h',
      isActive: true,
    });
    setIsAddModalOpen(false);
  };

  const handleClaimReward = (questId: string) => {
    // Handle claiming timer-based quest rewards
    completeQuest(questId);
  };

  const filteredQuests = quests.filter(quest => {
    if (activeFilter === 'all') return true;
    return quest.type === activeFilter;
  });

  const questsByType = {
    daily: filteredQuests.filter(q => q.type === 'daily'),
    weekly: filteredQuests.filter(q => q.type === 'weekly'),
    main: filteredQuests.filter(q => q.type === 'main'),
    single: filteredQuests.filter(q => q.type === 'single'),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quest Tracker</h1>
          <p className="text-gray-600 mt-1">Manage your daily tasks and long-term goals</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} variant="gold">
          <Plus className="w-5 h-5 mr-2" />
          Add Quest
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All Quests' },
          { key: 'daily', label: 'Dailies' },
          { key: 'weekly', label: 'Weeklies' },
          { key: 'main', label: 'Main Quests' },
          { key: 'single', label: 'Single Tasks' },
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as any)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeFilter === filter.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Quest Lists */}
      {activeFilter === 'all' ? (
        <div className="space-y-8">
          {Object.entries(questsByType).map(([type, typeQuests]) => (
            <div key={type}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
                {type === 'single' ? 'Single Tasks' : `${type} Quests`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeQuests.length === 0 ? (
                  <Card className="p-6 col-span-full text-center">
                    <p className="text-gray-500">No {type} quests yet</p>
                  </Card>
                ) : (
                  typeQuests.map(quest => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={completeQuest}
                      onDelete={deleteQuest}
                      onClaimReward={handleClaimReward}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.length === 0 ? (
            <Card className="p-6 col-span-full text-center">
              <p className="text-gray-500">No {activeFilter} quests yet</p>
            </Card>
          ) : (
            filteredQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={completeQuest}
                onDelete={deleteQuest}
                onClaimReward={handleClaimReward}
              />
            ))
          )}
        </div>
      )}

      {/* Add Quest Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Quest"
        size="lg"
      >
        <form onSubmit={handleAddQuest} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quest Title
            </label>
            <input
              type="text"
              value={newQuest.title}
              onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter quest title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newQuest.description}
              onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Describe your quest"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quest Type
              </label>
              <select
                value={newQuest.type}
                onChange={(e) => setNewQuest({ ...newQuest, type: e.target.value as QuestType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="single">Single Task</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quest Duration
              </label>
              <select
                value={newQuest.duration}
                onChange={(e) => setNewQuest({ ...newQuest, duration: e.target.value as QuestDuration })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.entries(QUEST_DURATIONS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label} (Grants {config.experience} XP, {config.gold} Gold)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Quest Rewards Preview</h4>
            <div className="text-sm text-blue-700">
              <p>• Experience: {QUEST_DURATIONS[newQuest.duration].experience} XP</p>
              <p>• Gold: {QUEST_DURATIONS[newQuest.duration].gold} Gold</p>
              {newQuest.type === 'weekly' && <p>• Skill Points: 1 SP</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gold">
              Add Quest
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Quests;