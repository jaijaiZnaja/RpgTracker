import React, { useState, useEffect } from 'react';
import { Map, Sword, Users, Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCombat } from '../contexts/CombatContext';
import { combatAPI } from '../lib/supabase';
import { Monster } from '../types';
import Button from '../components/UI/Button';
// import Card from '../components/UI/Card'; // เราจะใช้ div กับ class ตรงๆ เพื่อให้เหมือน Combat.tsx
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Adventure Mode</h1>
          <p className="text-gray-600 mt-1">Explore the world and battle monsters</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          

          {/* Right Column (Main Content) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Grassy Plains Zone Card */}
            <div className="bg-white rounded-lg shadow-lg relative overflow-hidden group transition-all duration-300">
              <div 
                className="h-64 bg-cover bg-center relative"
                style={{ backgroundImage: 'url(https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1200)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="text-white mb-4">
                    <h3 className="text-3xl font-bold mb-2">Grassy Plains</h3>
                    <p className="text-lg opacity-90 mb-1">Recommended Level: 1-5</p>
                    <p className="text-sm opacity-75">
                      A peaceful meadow where new adventurers begin their journey.
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
            </div>

            {/* Coming Soon Zones Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 border-dashed border-2 border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏔️</div>
                  <h3 className="font-semibold text-gray-700 mb-2">Mystic Mountains</h3>
                  <p className="text-sm text-gray-500 mb-4">Level 6-10 • Coming Soon</p>
                  <div className="text-xs text-gray-400">Unlock by reaching Level 6</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 border-dashed border-2 border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🌲</div>
                  <h3 className="font-semibold text-gray-700 mb-2">Enchanted Forest</h3>
                  <p className="text-sm text-gray-500 mb-4">Level 11-15 • Coming Soon</p>
                  <div className="text-xs text-gray-400">Unlock by completing Mystic Mountains</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 border-dashed border-2 border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏰</div>
                  <h3 className="font-semibold text-gray-700 mb-2">Shadow Citadel</h3>
                  <p className="text-sm text-gray-500 mb-4">Level 16+ • Coming Soon</p>
                  <div className="text-xs text-gray-400">The ultimate challenge awaits</div>
                </div>
              </div>
            </div>

            {/* Social Features Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Multiplayer Features</h3>
                <p className="text-gray-600 mb-4">
                  Team up with friends, compete in tournaments, and share your adventures.
                </p>
                <p className="text-sm text-gray-500">Coming Soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adventure;