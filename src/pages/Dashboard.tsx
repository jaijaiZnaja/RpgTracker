import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import ProgressBar from '../components/UI/ProgressBar';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { User, Settings, Trophy, Users, Plus, Minus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { quests } = useGame();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'achievement' | 'friends'>('overview');

  if (!user) return null;

  const handleStatIncrease = (stat: 'strength' | 'dexterity' | 'intelligence') => {
    if (user.character.stats.availablePoints <= 0) return;

    updateUser({
      character: {
        ...user.character,
        stats: {
          ...user.character.stats,
          [stat]: user.character.stats[stat] + 1,
          availablePoints: user.character.stats.availablePoints - 1,
        },
      },
    });
  };

  const handleStatDecrease = (stat: 'strength' | 'dexterity' | 'intelligence') => {
    if (user.character.stats[stat] <= 1) return;

    updateUser({
      character: {
        ...user.character,
        stats: {
          ...user.character.stats,
          [stat]: user.character.stats[stat] - 1,
          availablePoints: user.character.stats.availablePoints + 1,
        },
      },
    });
  };

  const handleResetStats = () => {
    const totalPoints = user.character.stats.strength + user.character.stats.dexterity + user.character.stats.intelligence + user.character.stats.availablePoints;
    const baseStats = 5; // Starting value for each stat
    const availablePoints = totalPoints - (baseStats * 3);

    updateUser({
      character: {
        ...user.character,
        stats: {
          strength: baseStats,
          dexterity: baseStats,
          intelligence: baseStats,
          availablePoints: availablePoints,
        },
      },
    });
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'achievement', label: 'Achievement', icon: Trophy },
    { key: 'friends', label: 'Friends', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-8 border-b-2 border-gray-900">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-3 px-1 font-bold text-lg transition-all ${
                activeTab === tab.key
                  ? 'text-gray-900 border-b-4 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-6 h-6 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Equipment Slots */}
        <div className="space-y-4">
          <Card className="p-6 border-2 border-gray-300">
            <div className="grid grid-cols-2 gap-4">
              {/* Equipment Slots */}
              <div className="space-y-3">
                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  <span className="text-2xl">👑</span>
                </div>
                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  <span className="text-2xl">🥾</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  <span className="text-2xl">⚔️</span>
                </div>
                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  <span className="text-2xl">🪄</span>
                </div>
                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  <span className="text-2xl">💍</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Column - Character Info */}
        <div className="space-y-6">
          <Card className="p-8 border-2 border-gray-300 text-center">
            {/* Character Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-400">
              <User className="w-16 h-16 text-gray-600" />
            </div>

            {/* Character Name */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {user.character.name || 'NAME'}
            </h2>

            {/* Level Badge */}
            <div className="inline-flex items-center bg-gray-900 text-white px-4 py-2 rounded-full mb-6">
              <span className="w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                {user.character.level}
              </span>
              <span className="font-bold">{user.character.class.toUpperCase()}</span>
            </div>

            {/* Base Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                <div className="text-sm font-bold text-gray-600 mb-1">STR</div>
                <div className="text-2xl font-bold text-gray-900">{user.character.stats.strength}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                <div className="text-sm font-bold text-gray-600 mb-1">DEX</div>
                <div className="text-2xl font-bold text-gray-900">{user.character.stats.dexterity}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                <div className="text-sm font-bold text-gray-600 mb-1">INT</div>
                <div className="text-2xl font-bold text-gray-900">{user.character.stats.intelligence}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Stats & Account Info */}
        <div className="space-y-6">
          {/* Experience Bar */}
          <Card className="p-6 border-2 border-gray-300">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-900">Next Lvl</span>
                <span className="text-sm text-gray-600">
                  {user.character.experience}/{user.character.experienceToNext}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 border-2 border-gray-900">
                <div 
                  className="bg-gray-900 h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((user.character.experience / user.character.experienceToNext) * 100, 100)}%` 
                  }}
                >
                  <div className="h-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">EXP</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Management */}
          <Card className="p-6 border-2 border-gray-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-2">
              STATS
            </h3>
            
            <div className="space-y-4">
              {/* Strength */}
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-300">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900 w-16">STR</span>
                  <span className="text-xl font-bold text-gray-900 ml-4">
                    {user.character.stats.strength}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatDecrease('strength')}
                    disabled={user.character.stats.strength <= 1}
                    className="w-8 h-8 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatIncrease('strength')}
                    disabled={user.character.stats.availablePoints <= 0}
                    className="w-8 h-8 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dexterity */}
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-300">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900 w-16">DEX</span>
                  <span className="text-xl font-bold text-gray-900 ml-4">
                    {user.character.stats.dexterity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatDecrease('dexterity')}
                    disabled={user.character.stats.dexterity <= 1}
                    className="w-8 h-8 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatIncrease('dexterity')}
                    disabled={user.character.stats.availablePoints <= 0}
                    className="w-8 h-8 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Intelligence */}
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-300">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900 w-16">INT</span>
                  <span className="text-xl font-bold text-gray-900 ml-4">
                    {user.character.stats.intelligence}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatDecrease('intelligence')}
                    disabled={user.character.stats.intelligence <= 1}
                    className="w-8 h-8 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatIncrease('intelligence')}
                    disabled={user.character.stats.availablePoints <= 0}
                    className="w-8 h-8 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Free Points */}
            <div className="mt-4 p-3 bg-gray-200 rounded-lg border border-gray-300">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Free Point</span>
                <span className="text-xl font-bold text-gray-900">
                  {user.character.stats.availablePoints}
                </span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleResetStats}
                variant="secondary"
                size="sm"
                className="text-gray-600 underline bg-transparent border-none shadow-none hover:bg-gray-100"
              >
                Reset
              </Button>
            </div>
          </Card>

          {/* Account Info */}
          <Card className="p-6 border-2 border-gray-300">
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-bold text-gray-900">Account: </span>
                <span className="text-gray-700">{user.displayName}</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">Email: </span>
                <span className="text-gray-700">{user.email}</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">Joined: </span>
                <span className="text-gray-700">
                  {new Date(user.registrationDate).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;