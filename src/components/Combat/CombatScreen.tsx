import React from 'react';
import { Sword, Zap, Package, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { useCombat } from '../../contexts/CombatContext';
import Button from '../UI/Button';
import Card from '../UI/Card';
import ProgressBar from '../UI/ProgressBar';

const CombatScreen: React.FC = () => {
  const { combatState, performAction, endCombat } = useCombat();

  if (!combatState) return null;

  const { player, monster, battleLog, isActive, result, turn } = combatState;

  const handleAction = async (type: 'attack' | 'skill' | 'flee', skillId?: string) => {
    await performAction({ type, skillId });
  };

  const handleEndCombat = () => {
    endCombat();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-900 via-mystical-900 to-primary-800 z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Combat Arena */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Player Side */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">You</h3>
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center border-4 border-gold-400">
                <Sword className="w-16 h-16 text-white" />
              </div>
              
              {/* Player Stats */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>HP</span>
                    <span>{player.hp}/{player.maxHP}</span>
                  </div>
                  <ProgressBar
                    current={player.hp}
                    max={player.maxHP}
                    color="health"
                    showText={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>MP</span>
                    <span>{player.mp}/{player.maxMP}</span>
                  </div>
                  <ProgressBar
                    current={player.mp}
                    max={player.maxMP}
                    color="mana"
                    showText={false}
                  />
                </div>
              </div>
            </div>

            {/* Monster Side */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{monster.name}</h3>
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center border-4 border-red-300">
                {monster.image_url ? (
                  <img
                    src={monster.image_url}
                    alt={monster.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="text-4xl">👹</div>
                )}
              </div>
              
              {/* Monster Stats */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>HP</span>
                  <span>{monster.currentHP}/{monster.hp}</span>
                </div>
                <ProgressBar
                  current={monster.currentHP}
                  max={monster.hp}
                  color="health"
                  showText={false}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Battle Log */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Battle Log</h4>
          <div className="bg-gray-50 rounded-lg p-4 h-32 overflow-y-auto">
            {battleLog.map((log, index) => (
              <div key={index} className="text-sm text-gray-700 mb-1">
                {log}
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        {isActive && turn === 'player' ? (
          <Card className="p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Choose your action:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => handleAction('attack')}
                variant="danger"
                className="flex flex-col items-center p-4 h-auto"
              >
                <Sword className="w-6 h-6 mb-2" />
                <span>Attack</span>
              </Button>

              <div className="relative">
                <Button
                  onClick={() => {
                    // For now, just use the first available skill
                    const firstSkill = player.skills[0];
                    if (firstSkill && player.mp >= firstSkill.mana_cost) {
                      handleAction('skill', firstSkill.id);
                    }
                  }}
                  variant="mystical"
                  disabled={!player.skills.length || player.mp < (player.skills[0]?.mana_cost || 0)}
                  className="flex flex-col items-center p-4 h-auto w-full"
                >
                  <Zap className="w-6 h-6 mb-2" />
                  <span>Skill</span>
                </Button>
                {player.skills.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-mystical-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {player.skills.length}
                  </div>
                )}
              </div>

              <Button
                onClick={() => handleAction('attack')} // Placeholder for item usage
                variant="secondary"
                disabled
                className="flex flex-col items-center p-4 h-auto"
              >
                <Package className="w-6 h-6 mb-2" />
                <span>Item</span>
              </Button>

              <Button
                onClick={() => handleAction('flee')}
                variant="secondary"
                className="flex flex-col items-center p-4 h-auto"
              >
                <ArrowLeft className="w-6 h-6 mb-2" />
                <span>Flee</span>
              </Button>
            </div>

            {/* Skills List */}
            {player.skills.length > 0 && (
              <div className="mt-6">
                <h5 className="font-medium text-gray-700 mb-3">Available Skills:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {player.skills.map((skill) => (
                    <Button
                      key={skill.id}
                      onClick={() => handleAction('skill', skill.id)}
                      disabled={player.mp < skill.mana_cost}
                      variant="primary"
                      size="sm"
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span>{skill.name}</span>
                      </div>
                      <div className="text-xs opacity-75">
                        {skill.mana_cost} MP
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ) : turn === 'monster' ? (
          <Card className="p-6 text-center">
            <div className="animate-pulse">
              <h4 className="font-semibold text-gray-800">Monster's turn...</h4>
            </div>
          </Card>
        ) : null}

        {/* Combat Result */}
        {!isActive && result && (
          <Card className="p-6 text-center">
            <div className="mb-4">
              {result === 'victory' && (
                <div className="text-green-600">
                  <Trophy className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Victory!</h3>
                  <p>You have defeated the {monster.name}!</p>
                </div>
              )}
              {result === 'defeat' && (
                <div className="text-red-600">
                  <Heart className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Defeat</h3>
                  <p>You have been defeated...</p>
                </div>
              )}
              {result === 'fled' && (
                <div className="text-yellow-600">
                  <ArrowLeft className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Fled</h3>
                  <p>You escaped from battle!</p>
                </div>
              )}
            </div>
            <Button onClick={handleEndCombat} variant="gold" size="lg">
              Continue
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CombatScreen;