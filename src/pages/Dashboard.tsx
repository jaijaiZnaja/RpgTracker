import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import CharacterPortrait from '../components/Character/CharacterPortrait';
import QuestCard from '../components/Quest/QuestCard';
import ProgressBar from '../components/UI/ProgressBar';
import Card from '../components/UI/Card';
import { Calendar, Trophy, Coins, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { quests, completeQuest, deleteQuest } = useGame();

  if (!user) return null;

  const activeDailies = quests.filter(q => q.type === 'daily' && q.isActive && !q.isCompleted);
  const activeWeeklies = quests.filter(q => q.type === 'weekly' && q.isActive && !q.isCompleted);
  const completedToday = quests.filter(q => {
    if (!q.completedAt) return false;
    const today = new Date().toDateString();
    const completedDate = new Date(q.completedAt).toDateString();
    return today === completedDate;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.character.name || 'Hero'}!
          </h1>
          <p className="text-gray-600 mt-1">Ready for another day of adventure?</p>
        </div>
      </div>

      {/* Character Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 p-6">
          <CharacterPortrait character={user.character} size="lg" showStats />
        </Card>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stats Cards */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Vitals</h3>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-health rounded-full"></div>
                <div className="w-3 h-3 bg-mana rounded-full"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Health</span>
                  <span className="font-medium">{user.character.vitals.currentHP}/{user.character.vitals.maxHP}</span>
                </div>
                <ProgressBar
                  current={user.character.vitals.currentHP}
                  max={user.character.vitals.maxHP}
                  color="health"
                  showText={false}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Mana</span>
                  <span className="font-medium">{user.character.vitals.currentMP}/{user.character.vitals.maxMP}</span>
                </div>
                <ProgressBar
                  current={user.character.vitals.currentMP}
                  max={user.character.vitals.maxMP}
                  color="mana"
                  showText={false}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
              <Trophy className="w-5 h-5 text-gold-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Level {user.character.level}</span>
                <span className="font-medium">{user.character.experience}/{user.character.experienceToNext}</span>
              </div>
              <ProgressBar
                current={user.character.experience}
                max={user.character.experienceToNext}
                color="experience"
                showText={false}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
              <Coins className="w-5 h-5 text-gold-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-600">{user.character.gold}</div>
                <div className="text-sm text-gray-600">Gold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-mystical-600">{user.character.skillPoints}</div>
                <div className="text-sm text-gray-600">Skill Points</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Progress</h3>
              <Calendar className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-experience">{completedToday.length}</div>
              <div className="text-sm text-gray-600">Quests Completed</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Active Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Dailies */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Today's Dailies</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{activeDailies.length} active</span>
            </div>
          </div>
          <div className="space-y-4">
            {activeDailies.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500 mb-4">No daily quests active</p>
                <p className="text-sm text-gray-400">Visit the Quest Tracker to add some daily habits!</p>
              </Card>
            ) : (
              activeDailies.slice(0, 3).map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={completeQuest}
                  onDelete={deleteQuest}
                />
              ))
            )}
          </div>
        </div>

        {/* Weekly Progress */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Weekly Quests</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Zap className="w-4 h-4" />
              <span>{activeWeeklies.length} active</span>
            </div>
          </div>
          <div className="space-y-4">
            {activeWeeklies.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500 mb-4">No weekly quests active</p>
                <p className="text-sm text-gray-400">Set up some weekly goals to earn skill points!</p>
              </Card>
            ) : (
              activeWeeklies.slice(0, 3).map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={completeQuest}
                  onDelete={deleteQuest}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;