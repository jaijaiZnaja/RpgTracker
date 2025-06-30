import React from 'react';
import { Character, getClassBonuses } from '../../types';
import { Shield, Sword, Sparkles, User, Zap } from 'lucide-react';

interface CharacterPortraitProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  showClassInfo?: boolean;
}

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  character,
  size = 'md',
  showStats = false,
  showClassInfo = false,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const getClassIcon = (characterClass: string) => {
    switch (characterClass) {
      case 'Fighter':
        return <Sword className="w-6 h-6" />;
      case 'Ranger':
        return <Shield className="w-6 h-6" />;
      case 'Wizard':
        return <Sparkles className="w-6 h-6" />;
      case 'Adventurer':
        return <Zap className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const getClassColor = (characterClass: string) => {
    switch (characterClass) {
      case 'Fighter':
        return 'from-red-400 to-red-600 border-red-400';
      case 'Ranger':
        return 'from-green-400 to-green-600 border-green-400';
      case 'Wizard':
        return 'from-blue-400 to-blue-600 border-blue-400';
      case 'Adventurer':
        return 'from-purple-400 to-purple-600 border-purple-400';
      default:
        return 'from-primary-400 to-primary-600 border-gold-400';
    }
  };

  const classBonuses = getClassBonuses(character.class, character.level);

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getClassColor(character.class)} flex items-center justify-center text-white shadow-lg border-4`}>
        {getClassIcon(character.class)}
      </div>
      
      <div className="mt-2 text-center">
        <h3 className="font-semibold text-gray-800">
          {character.name || 'Unnamed Hero'}
        </h3>
        <p className="text-sm text-gray-600">
          Level {character.level} {character.class}
        </p>
        
        {showClassInfo && character.class !== 'Novice' && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg text-xs">
            <p className="text-gray-600 mb-1">{classBonuses.description}</p>
            <div className="flex justify-center space-x-2 text-xs">
              {classBonuses.hpBonus > 0 && (
                <span className="text-red-600">+{classBonuses.hpBonus} HP</span>
              )}
              {classBonuses.mpBonus > 0 && (
                <span className="text-blue-600">+{classBonuses.mpBonus} MP</span>
              )}
              {classBonuses.attackBonus > 0 && (
                <span className="text-orange-600">+{Math.floor(classBonuses.attackBonus)} ATK</span>
              )}
              {classBonuses.defenseBonus > 0 && (
                <span className="text-green-600">+{Math.floor(classBonuses.defenseBonus)} DEF</span>
              )}
            </div>
          </div>
        )}
      </div>

      {showStats && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-red-100 px-2 py-1 rounded">
            <div className="text-xs text-red-600 font-semibold">STR</div>
            <div className="text-sm font-bold text-red-800">{character.stats.strength}</div>
          </div>
          <div className="bg-green-100 px-2 py-1 rounded">
            <div className="text-xs text-green-600 font-semibold">DEX</div>
            <div className="text-sm font-bold text-green-800">{character.stats.dexterity}</div>
          </div>
          <div className="bg-blue-100 px-2 py-1 rounded">
            <div className="text-xs text-blue-600 font-semibold">INT</div>
            <div className="text-sm font-bold text-blue-800">{character.stats.intelligence}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterPortrait;