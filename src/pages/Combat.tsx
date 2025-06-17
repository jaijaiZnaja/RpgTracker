import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sword, Shield, Zap, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from '../contexts/CombatContext';
import { combatAPI } from '../lib/supabase';
import { Monster } from '../types';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import CombatScreen from '../components/Combat/CombatScreen';

const Combat: React.FC = () => {
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

  const handleStartRandomCombat = async () => {
    await startCombat();
  };

  const handleStartSpecificCombat = async (monster: Monster) => {
    await startCombat(monster);
  };

  const handleGoBack = () => {
    navigate('/adventure');
  };

  // Show combat screen if combat is active
  if (combatState) {
    return <CombatScreen />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to World Map
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grassy Plains</h1>
            <p className="text-gray-600 mt-1">Choose your battle and test your skills</p>
          </div>
        </div>
      </div>

      {/* Zone Description */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">🌾</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Welcome to the Grassy Plains</h2>
            <p className="text-gray-600">A peaceful meadow perfect for new adventurers</p>
          </div>
        </div>
        <p className="text-gray-700">
          The gentle breeze carries the scent of wildflowers across these rolling hills. 
          This serene landscape is home to friendly creatures that provide excellent training 
          for budding heroes. Explore carefully - even in peaceful places, adventure awaits!
        </p>
      </Card>

      {/* Combat Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Random Encounter */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Sword className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Random Encounter</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Venture into the unknown and face whatever creature you might encounter. 
            Great for gaining experience and testing your luck!
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Random encounters may yield bonus rewards!
              </span>
            </div>
          </div>
          <Button
            onClick={handleStartRandomCombat}
            disabled={isLoading}
            variant="danger"
            size="lg"
            className="w-full"
          >
            {isLoading ? 'Searching for enemies...' : 'Start Random Battle'}
          </Button>
        </Card>

        {/* Specific Monster Selection */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-blue-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Choose Your Opponent</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Select a specific creature to battle. Study their stats and plan your strategy carefully.
          </p>
          
          {loadingMonsters ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-500 mt-3">Loading creatures...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monsters.map((monster) => (
                <div key={monster.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        {monster.image_url ? (
                          <img
                            src={monster.image_url}
                            alt={monster.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">👹</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">{monster.name}</h4>
                        <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                            HP: {monster.hp}
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                            ATK: {monster.attack}
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                            DEF: {monster.defense}
                          </span>
                        </div>
                        <div className="flex space-x-3 text-xs text-gray-500 mt-2">
                          <span>🏆 {monster.exp_reward} EXP</span>
                          <span>💰 {monster.gold_reward} Gold</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleStartSpecificCombat(monster)}
                      disabled={isLoading}
                      variant="primary"
                      className="flex items-center"
                    >
                      <Sword className="w-4 h-4 mr-2" />
                      Battle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <Package className="w-6 h-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Combat Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use skills wisely - they consume MP but deal more damage</li>
              <li>• Different monsters have different weaknesses</li>
              <li>• Fleeing from battle is always an option if things get tough</li>
              <li>• Victory rewards scale with monster difficulty</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Combat;