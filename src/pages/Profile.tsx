import React, { useState } from 'react';
import { User, Settings, Trophy, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import CharacterPortrait from '../components/Character/CharacterPortrait';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { achievements, friends } = useGame();
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

  const tabs = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'achievements', label: 'Achievements', icon: Trophy },
    { key: 'friends', label: 'Friends', icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your character and account settings</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 p-6">
            <CharacterPortrait character={user.character} size="lg" showStats />
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account:</span>
                <span className="font-medium">{user.displayName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="font-medium text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Joined:</span>
                <span className="font-medium text-sm">
                  {new Date(user.registrationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Character Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{user.character.stats.strength}</div>
                  <div className="text-sm text-red-700">Strength</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.character.stats.dexterity}</div>
                  <div className="text-sm text-green-700">Dexterity</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user.character.stats.intelligence}</div>
                  <div className="text-sm text-blue-700">Intelligence</div>
                </div>
              </div>
              {user.character.stats.availablePoints > 0 && (
                <div className="mt-4 p-3 bg-gold-50 rounded-lg">
                  <p className="text-gold-800 font-medium">
                    You have {user.character.stats.availablePoints} stat points to allocate!
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                  <span className="text-gold-700 font-medium">Gold</span>
                  <span className="text-xl font-bold text-gold-600">{user.character.gold}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-mystical-50 rounded-lg">
                  <span className="text-mystical-700 font-medium">Skill Points</span>
                  <span className="text-xl font-bold text-mystical-600">{user.character.skillPoints}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <Card className="p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>
            <Button onClick={() => setIsSettingsModalOpen(true)}>
              Edit Settings
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Display Name</span>
              <span className="font-medium">{user.displayName}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Character Name</span>
              <span className="font-medium">{user.character.name || 'Unnamed Hero'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Achievements</h3>
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Achievement system coming soon!</p>
            <p className="text-sm text-gray-400">
              Complete quests and explore the world to unlock achievements.
            </p>
          </div>
        </Card>
      )}

      {activeTab === 'friends' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Friends</h3>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Friends system coming soon!</p>
            <p className="text-sm text-gray-400">
              Connect with other adventurers and share your progress.
            </p>
          </div>
        </Card>
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