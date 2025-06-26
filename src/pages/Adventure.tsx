import React, { useState, useEffect } from 'react';
import { Map, Sword, Users, Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from '../contexts/CombatContext';
import { combatAPI } from '../lib/gameApi';
import { Monster } from '../types';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import CombatScreen from '../components/Combat/CombatScreen';

const Adventure: React.FC = () => {
  const navigate = useNavigate();
  const { combatState, startCombat, isLoading } = useCombat();
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loadingMonsters, setLoadingMonsters] = useState(true);

  useEffect(() => {
    loadMonsters();
  }, []);

  const loadMonsters = async () => {
    try {
      const data = await combatAPI.getMonsters();
      setMonsters(data);
    } catch (error) {
      console.error('Failed to load monsters:', error);
    } finally {
      setLoadingMonsters(false);
    }
  };

  const handleEnterZone = () => {
    navigate('/combat');
  };

  const handleStartRandomCombat = async () => {
    await startCombat();
  };

  const handleStartSpecificCombat = async (monster: Monster) => {
    await startCombat(monster);
  };

  // Show combat screen if combat is active
  if (combatState) {
    return <CombatScreen />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Adventure Mode</h1>
          <p className="text-gray-600 mt-1">Explore the world and battle monsters</p>
        </div>
      </div>

      {/* World Map Section */}
      <div className="space-y-6">
        <div className="text-center">
          <Map className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">World Map</h2>
          <p className="text-gray-600">
            Choose your destination and embark on epic adventures
          </p>
        </div>

        {/* Grassy Plains Zone */}
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div 
            className="h-64 bg-cover bg-center relative"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1200)',
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Zone Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="text-white mb-4">
                <h3 className="text-3xl font-bold mb-2">Grassy Plains</h3>
                <p className="text-lg opacity-90 mb-1">Recommended Level: 1-5</p>
                <p className="text-sm opacity-75">
                  A peaceful meadow where new adventurers begin their journey. Home to gentle creatures and hidden treasures.
                </p>
              </div>
              
              <Button
                onClick={handleEnterZone}
                variant="gold"
                size="lg"
                className="self-start group-hover:scale-105 transition-transform duration-200 flex items-center"
              >
                Enter and Explore
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Coming Soon Zones Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-gray-50 border-dashed border-2 border-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🏔️
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">Mystic Mountains</h3>
              <p className="text-sm text-gray-500 mb-4">Level 6-10 • Coming Soon</p>
              <div className="text-xs text-gray-400">Unlock by reaching Level 6</div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50 border-dashed border-2 border-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🌲
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">Enchanted Forest</h3>
              <p className="text-sm text-gray-500 mb-4">Level 11-15 • Coming Soon</p>
              <div className="text-xs text-gray-400">Unlock by completing Mystic Mountains</div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50 border-dashed border-2 border-gray-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🏰
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">Shadow Citadel</h3>
              <p className="text-sm text-gray-500 mb-4">Level 16+ • Coming Soon</p>
              <div className="text-xs text-gray-400">The ultimate challenge awaits</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Combat Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Sword className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Random Encounter</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Face a random monster and test your combat skills. Perfect for quick battles and experience farming.
          </p>
          <Button
            onClick={handleStartRandomCombat}
            disabled={isLoading}
            variant="danger"
            className="w-full"
          >
            {isLoading ? 'Starting Combat...' : 'Start Random Battle'}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Trophy className="w-6 h-6 text-gold-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Monster Bestiary</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Choose specific monsters to battle and learn their attack patterns.
          </p>
          
          {loadingMonsters ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading monsters...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {monsters.map((monster) => (
                <div key={monster.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      {monster.image_url ? (
                        <img
                          src={monster.image_url}
                          alt={monster.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">👹</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{monster.name}</h4>
                      <p className="text-xs text-gray-500">
                        HP: {monster.hp} | ATK: {monster.attack} | DEF: {monster.defense}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartSpecificCombat(monster)}
                    disabled={isLoading}
                    size="sm"
                    variant="primary"
                  >
                    Battle
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Social Features Preview */}
      <Card className="p-6">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Multiplayer Features</h3>
          <p className="text-gray-600 mb-4">
            Team up with friends for guild raids, compete in tournaments, and share your adventures.
          </p>
          <p className="text-sm text-gray-500">Coming Soon!</p>
        </div>
      </Card>
    </div>
  );
};

export default Adventure;