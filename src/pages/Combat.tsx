import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Zap, Sword, Package, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { combatAPI } from '../lib/supabase';
import { Monster, Skill } from '../types';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';

const Combat: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, gainExperience } = useAuth();
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [playerMP, setPlayerMP] = useState(50);
  const [monsterHP, setMonsterHP] = useState(0);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [menuState, setMenuState] = useState<'main' | 'skills'>('main');
  const [playerSkills, setPlayerSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    initializeCombat();
    loadPlayerSkills();
  }, []);

  useEffect(() => {
    if (user?.character) {
      setPlayerHP(user.character.vitals.currentHP);
      setPlayerMP(user.character.vitals.currentMP);
    }
  }, [user]);

  const initializeCombat = async () => {
    try {
      setIsLoading(true);
      const monster = await combatAPI.getRandomMonster();
      setCurrentMonster(monster);
      setMonsterHP(monster.hp);
      addToCombatLog(`A wild ${monster.name} appears!`);
    } catch (error) {
      console.error('Failed to initialize combat:', error);
      addToCombatLog('Failed to load monster. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlayerSkills = async () => {
    if (!user) return;
    try {
      const unlockedSkills = await combatAPI.getPlayerUnlockedSkills(user.id);
      const skills = unlockedSkills.map(us => us.skill).filter(Boolean) as Skill[];
      setPlayerSkills(skills);
    } catch (error) {
      console.error('Failed to load player skills:', error);
    }
  };

  const handleVictory = async () => {
    if (!user || !user.character || !currentMonster) return;

    addToCombatLog(`${currentMonster.name} is defeated!`);
    addToCombatLog(`You gained ${currentMonster.exp_reward} EXP and ${currentMonster.gold_reward} Gold!`);
    setIsBattleOver(true);

    // อัปเดตทองของผู้เล่น
    const updatedCharacter = { 
      ...user.character, 
      gold: (user.character.gold || 0) + currentMonster.gold_reward 
    };
    await updateUser({ character: updatedCharacter });

    // เรียกใช้ฟังก์ชันกลางเพื่อจัดการ EXP และการเลเวลอัป
    await gainExperience(currentMonster.exp_reward);
  };

  const addToCombatLog = (message: string) => {
    setCombatLog(prev => [...prev, message].slice(-10)); // Keep last 10 messages
  };

  const handleBattleClick = () => {
    setMenuState('skills');
  };

  const handleBackClick = () => {
    setMenuState('main');
  };

  const handleBagClick = () => {
    console.log('BAG clicked');
    setMenuState('main');
  };

  const handleRunClick = () => {
    console.log('RUN clicked');
    addToCombatLog('You fled from battle!');
    setTimeout(() => {
      navigate('/adventure');
    }, 1500);
  };

  const handleSkillUse = (skill: Skill) => {
    if (!isPlayerTurn || !currentMonster || !user || playerMP < skill.mana_cost || isBattleOver) return;

    // 2. เมื่อผู้เล่นโจมตี ให้เปลี่ยนเป็นตาของมอนสเตอร์ทันที
    setIsPlayerTurn(false);

    // Calculate skill damage based on character class and stats
    let skillDamage = skill.damage;
    if (skill.required_class === 'Wizard') {
      skillDamage += user.character.stats.intelligence * 2;
    } else if (skill.required_class === 'Fighter') {
      skillDamage += user.character.stats.strength * 1.5;
    } else if (skill.required_class === 'Ranger') {
      skillDamage += user.character.stats.dexterity * 1.5;
    }

    const damage = Math.max(1, Math.floor(skillDamage - currentMonster.defense / 2));
    const newMonsterHP = Math.max(0, monsterHP - damage);
    const newPlayerMP = playerMP - skill.mana_cost;

    // Update monster HP and player MP
    setMonsterHP(newMonsterHP);
    setPlayerMP(newPlayerMP);
    addToCombatLog(`You use ${skill.name}! ${currentMonster.name} takes ${damage} damage.`);

    // Check if monster is defeated
    if (newMonsterHP <= 0) {
      handleVictory()
      return;
    }
    // Trigger monster's turn after a short delay
    setTimeout(() => {
      monsterTurn();
    }, 10);
  };

  const monsterTurn = () => {
    if (!currentMonster || !user || isBattleOver) return;

    // Calculate monster damage (monster attack - player defense)
    const playerDefense = 5 + user.character.stats.dexterity; // Base defense + dexterity
    const damage = Math.max(1, currentMonster.attack - playerDefense);
    const newPlayerHP = Math.max(0, playerHP - damage);

    setPlayerHP(newPlayerHP);
    addToCombatLog(`${currentMonster.name} attacks! You take ${damage} damage.`);

    // Check if player is defeated
    if (newPlayerHP <= 0) {
      addToCombatLog('You have been defeated!');
      setIsBattleOver(true);
      return;
    }

    // Return to main menu for player's next turn
    setTimeout(() => {
      setMenuState('main');
      setIsPlayerTurn(true); // <--- คืนตาให้ผู้เล่น
    }, 1000);
  };

  const handleGoBack = () => {
    navigate('/adventure');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Preparing for battle...</p>
        </div>
      </div>
    );
  }

  if (!currentMonster) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">Failed to load monster</p>
          <Button onClick={handleGoBack} variant="primary">
            Return to Adventure
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Flee Battle
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Combat - Grassy Plains</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Combat Log - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 h-full">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <Sword className="w-5 h-5 mr-2" />
                Battle Log
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 h-[calc(100%-3rem)] overflow-y-auto">
                {combatLog.map((message, index) => (
                  <div key={index} className="text-sm text-gray-700 mb-2 last:mb-0">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Combat Area - Right Side */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Top Area - Monster */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex-1">
              <div className="text-center">
                {/* Monster Sprite */}
                <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-red-200 to-red-400 rounded-full flex items-center justify-center border-4 border-red-300">
                  {currentMonster.image_url ? (
                    <img
                      src={currentMonster.image_url}
                      alt={currentMonster.name}
                      className="w-40 h-40 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-8xl">👹</span>
                  )}
                </div>

                {/* Monster Name */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentMonster.name}</h2>

                {/* Monster HP Bar */}
                <div className="max-w-md mx-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">HP</span>
                    <span className="font-medium text-gray-700">{monsterHP}/{currentMonster.hp}</span>
                  </div>
                  <ProgressBar
                    current={monsterHP}
                    max={currentMonster.hp}
                    color="health"
                    showText={false}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Area - Player and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Player Area */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                  {/* Player Avatar */}
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center border-4 border-gold-400">
                    <Sword className="w-16 h-16 text-white" />
                  </div>

                  {/* Player Name */}
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {user?.character.name || 'Hero'}
                  </h3>

                  {/* Player HP Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">HP</span>
                      <span className="font-medium text-gray-700">{playerHP}/{user?.character.vitals.maxHP}</span>
                    </div>
                    <ProgressBar
                      current={playerHP}
                      max={user?.character.vitals.maxHP || 100}
                      color="health"
                      showText={false}
                    />
                  </div>

                  {/* Player MP Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">MP</span>
                      <span className="font-medium text-gray-700">{playerMP}/{user?.character.vitals.maxMP}</span>
                    </div>
                    <ProgressBar
                      current={playerMP}
                      max={user?.character.vitals.maxMP || 50}
                      color="mana"
                      showText={false}
                    />
                  </div>
                </div>
              </div>

              {/* Action Menu */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">Actions</h3>
                
                {isBattleOver ? (
                  <div className="text-center">
                    {playerHP <= 0 && (
                      <div className="text-red-600 mb-4">
                        <Heart className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-lg font-bold">Defeat!</p>
                        <p className="text-sm">You have been defeated...</p>
                      </div>
                    )}
                    {monsterHP <= 0 && (
                      <div className="text-green-600 mb-4">
                        <Sword className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-lg font-bold">Victory!</p>
                        <p className="text-sm">You have defeated the {currentMonster.name}!</p>
                      </div>
                    )}
                    <Button onClick={handleGoBack} variant="gold" size="lg" className="w-full">
                      Return to Adventure
                    </Button>
                  </div>
                ) : menuState === 'main' ? (
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={handleBattleClick}
                      variant="danger"
                      size="lg"
                      className="w-full flex items-center justify-center"
                    >
                      <Sword className="w-5 h-5 mr-2" />
                      BATTLE
                    </Button>
                    
                    <Button
                      onClick={handleBagClick}
                      variant="secondary"
                      size="lg"
                      className="w-full flex items-center justify-center"
                    >
                      <Package className="w-5 h-5 mr-2" />
                      BAG
                    </Button>
                    
                    <Button
                      onClick={handleRunClick}
                      variant="secondary"
                      size="lg"
                      className="w-full flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      RUN
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {playerSkills.slice(0, 4).map((skill) => (
                        <Button
                          key={skill.id}
                          onClick={() => handleSkillUse(skill)}
                          disabled={playerMP < skill.mana_cost}
                          variant="primary"
                          size="sm"
                          className="p-3 text-xs"
                        >
                          <div className="text-center">
                            <div className="font-semibold">{skill.name}</div>
                            <div className="text-xs opacity-75">{skill.mana_cost} MP</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    {playerSkills.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        <p className="text-sm">No skills unlocked yet!</p>
                        <p className="text-xs">Complete quests to unlock skills.</p>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleBackClick}
                      variant="secondary"
                      size="lg"
                      className="w-full flex items-center justify-center"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Combat;