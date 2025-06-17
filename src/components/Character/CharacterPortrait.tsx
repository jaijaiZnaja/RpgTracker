import React from 'react';
import { Character } from '../../types';
import { Shield, Sword, Sparkles, User } from 'lucide-react';

interface CharacterPortraitProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
}

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  character,
  size = 'md',
  showStats = false,
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
      default:
        return <User className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-lg border-4 border-gold-400`}>
        {getClassIcon(character.class)}
      </div>
      
      <div className="mt-2 text-center">
        <h3 className="font-semibold text-gray-800">
          {character.name || 'Unnamed Hero'}
        </h3>
        <p className="text-sm text-gray-600">
          Level {character.level} {character.class}
        </p>
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