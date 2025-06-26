import React, { useState } from 'react';
import { User, Settings, Trophy, Users, Info, Plus, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'achievements' | 'friends'>('overview');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    displayName: user?.displayName || '',
    characterName: user?.character.name || '',
  });

  if (!user) return null;

  const handleSaveSettings = () => {
    updateUser({
      displayName: settings.displayName,
      character: {
        ...user.character,
        name: settings.characterName,
      },
    });
    setIsSettingsModalOpen(false);
  };

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

  const handleStatReset = () => {
    const totalAllocated = (user.character.stats.strength - 5) + 
                          (user.character.stats.dexterity - 5) + 
                          (user.character.stats.intelligence - 5);
    
    updateUser({
      character: {
        ...user.character,
        stats: {
          strength: 5,
          dexterity: 5,
          intelligence: 5,
          availablePoints: user.character.stats.availablePoints + totalAllocated,
        },
      },
    });
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'settings', label: 'Setting', icon: Settings },
    { key: 'achievements', label: 'Achievement', icon: Trophy },
    { key: 'friends', label: 'Friends', icon: Users },
  ];

  const equipmentSlots = {
    left: [
      { type: 'helmet', icon: '🪖', name: 'Head' },
      { type: 'armor', icon: '🛡️', name: 'Chest' },
      { type: 'boots', icon: '🥾', name: 'Legs/Feet' },
    ],
    right: [
      { type: 'weapon', icon: '⚔️', name: 'Weapon' },
      { type: 'accessory', icon: '🎒', name: 'Accessory' },
      { type: 'ring', icon: '💍', name: 'Ring' },
    ],
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Top Navigation Bar */}
      <div className="border-b-4 border-black mb-8">
        <nav className="flex space-x-12 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 text-lg font-bold ${
                activeTab === tab.key
                  ? 'text-black border-b-4 border-black pb-2'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Equipment Slots */}
          <div className="col-span-2">
            <div className="border-4 border-gray-400 rounded-lg p-4 bg-gray-50">
              <div className="space-y-4">
                {equipmentSlots.left.map((slot, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 border-2 border-black bg-white rounded flex items-center justify-center"
                  >
                    <span className="text-2xl opacity-30">{slot.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Central Character Panel */}
          <div className="col-span-4">
            <div className="border-4 border-gray-400 rounded-lg p-6 bg-gray-50 text-center">
              {/* Avatar */}
              <div className="w-32 h-32 mx-auto mb-4 border-4 border-black rounded-full bg-white flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>

              {/* Name */}
              <div className="mb-4">
                <div className="text-xl font-bold text-black">
                  {user.character.name || 'NAME'}
                </div>
              </div>

              {/* Class/Title */}
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 bg-white border-2 border-black rounded-full px-4 py-2">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {user.character.level}
                  </div>
                  <span className="font-bold text-black">{user.character.class.toUpperCase()}</span>
                  <Info className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Base Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border-2 border-black rounded-lg p-3 text-center">
                  <div className="text-xs font-bold text-black mb-1">STR</div>
                  <div className="text-xl font-bold text-black">{user.character.stats.strength}</div>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-3 text-center">
                  <div className="text-xs font-bold text-black mb-1">DEX</div>
                  <div className="text-xl font-bold text-black">{user.character.stats.dexterity}</div>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-3 text-center">
                  <div className="text-xs font-bold text-black mb-1">INT</div>
                  <div className="text-xl font-bold text-black">{user.character.stats.intelligence}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Equipment Slots */}
          <div className="col-span-2">
            <div className="border-4 border-gray-400 rounded-lg p-4 bg-gray-50">
              <div className="space-y-4">
                {equipmentSlots.right.map((slot, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 border-2 border-black bg-white rounded flex items-center justify-center"
                  >
                    <span className="text-2xl opacity-30">{slot.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Account */}
          <div className="col-span-4 space-y-6">
            {/* Experience Bar */}
            <div>
              <div className="text-lg font-bold text-black mb-2">
                Next Lvl {user.character.experience}/{user.character.experienceToNext}
              </div>
              <div className="w-full bg-white border-4 border-black rounded-full h-8 overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-500"
                  style={{ 
                    width: `${Math.min((user.character.experience / user.character.experienceToNext) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="border-4 border-black rounded-lg p-4 bg-gray-50">
              <div className="text-lg font-bold text-black mb-4 border-b-2 border-black pb-2">
                STATS
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-white border-2 border-black rounded flex items-center justify-center">
                      <span className="text-lg font-bold">{user.character.stats.strength}</span>
                    </div>
                    <span className="font-bold text-black">Strength</span>
                  </div>
                  <button
                    onClick={() => handleStatIncrease('strength')}
                    disabled={user.character.stats.availablePoints <= 0}
                    className="w-8 h-8 bg-white border-2 border-black rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-white border-2 border-black rounded flex items-center justify-center">
                      <span className="text-lg font-bold">{user.character.stats.dexterity}</span>
                    </div>
                    <span className="font-bold text-black">Dexterity</span>
                  </div>
                  <button
                    onClick={() => handleStatIncrease('dexterity')}
                    disabled={user.character.stats.availablePoints <= 0}
                    className="w-8 h-8 bg-white border-2 border-black rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-white border-2 border-black rounded flex items-center justify-center">
                      <span className="text-lg font-bold">{user.character.stats.intelligence}</span>
                    </div>
                    <span className="font-bold text-black">Intelligence</span>
                  </div>
                  <button
                    onClick={() => handleStatIncrease('intelligence')}
                    disabled={user.character.stats.availablePoints <= 0}
                    className="w-8 h-8 bg-white border-2 border-black rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Free Points */}
              <div className="mt-4 pt-4 border-t-2 border-black">
                <div className="flex items-center justify-between">
                  <div className="bg-white border-2 border-black rounded-lg px-4 py-2">
                    <span className="font-bold text-black">Free Point: {user.character.stats.availablePoints}</span>
                  </div>
                  <button
                    onClick={handleStatReset}
                    className="bg-white border-2 border-black rounded px-4 py-2 font-bold text-black hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-2 text-lg">
              <div className="font-bold text-black">
                Account: {user.displayName}
              </div>
              <div className="font-bold text-black">
                Email: {user.email}
              </div>
              <div className="font-bold text-black">
                Joined: {new Date(user.registrationDate).toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto">
          <div className="border-4 border-black rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Account Settings</h3>
              <Button onClick={() => setIsSettingsModalOpen(true)}>
                Edit Settings
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b-2 border-black">
                <span className="font-bold text-black">Display Name</span>
                <span className="font-bold text-black">{user.displayName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b-2 border-black">
                <span className="font-bold text-black">Character Name</span>
                <span className="font-bold text-black">{user.character.name || 'Unnamed Hero'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b-2 border-black">
                <span className="font-bold text-black">Email</span>
                <span className="font-bold text-black">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-black mb-6">Achievements</h3>
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-black font-bold mb-2">Achievement system coming soon!</p>
              <p className="text-gray-600">
                Complete quests and explore the world to unlock achievements.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-black mb-6">Friends</h3>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-black font-bold mb-2">Friends system coming soon!</p>
              <p className="text-gray-600">
                Connect with other adventurers and share your progress.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Edit Settings"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Character Name
            </label>
            <input
              type="text"
              value={settings.characterName}
              onChange={(e) => setSettings({ ...settings, characterName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter character name"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;