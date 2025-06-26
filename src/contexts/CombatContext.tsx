import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Monster, Skill, CombatState, CombatAction, CombatActionPayload } from '../types';
import { useAuth } from './AuthContext';
import { combatAPI } from '../lib/supabase';

interface CombatContextType {
  combatState: CombatState | null;
  availableSkills: Skill[];
  startCombat: (monster?: Monster) => Promise<void>;
  performAction: (action: CombatActionPayload) => Promise<void>;
  endCombat: () => void;
  isLoading: boolean;
  error: string | null;
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export const useCombat = () => {
  const context = useContext(CombatContext);
  if (context === undefined) {
    throw new Error('useCombat must be used within a CombatProvider');
  }
  return context;
};

interface CombatProviderProps {
  children: ReactNode;
}

export const CombatProvider: React.FC<CombatProviderProps> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlayerSkills = useCallback(async () => {
    if (!user) return;

    try {
      const unlockedSkills = await combatAPI.getPlayerUnlockedSkills(user.id);
      const skills = unlockedSkills.map(us => us.skill).filter(Boolean) as Skill[];
      setAvailableSkills(skills);
    } catch (err) {
      console.error('Failed to load player skills:', err);
      setError('Failed to load skills');
    }
  }, [user]);

  const startCombat = useCallback(async (monster?: Monster) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get monster (random if not provided)
      const combatMonster = monster || await combatAPI.getRandomMonster();
      
      // Load player skills
      await loadPlayerSkills();

      // Calculate player combat stats
      const playerAttack = 10 + user.character.stats.strength * 2;
      const playerDefense = 5 + user.character.stats.dexterity;

      // Initialize combat state
      const newCombatState: CombatState = {
        player: {
          hp: user.character.vitals.currentHP,
          maxHP: user.character.vitals.maxHP,
          mp: user.character.vitals.currentMP,
          maxMP: user.character.vitals.maxMP,
          attack: playerAttack,
          defense: playerDefense,
          skills: availableSkills,
        },
        monster: {
          ...combatMonster,
          currentHP: combatMonster.hp,
        },
        turn: 'player',
        battleLog: [`A wild ${combatMonster.name} appears!`],
        isActive: true,
      };

      setCombatState(newCombatState);
    } catch (err) {
      console.error('Failed to start combat:', err);
      setError('Failed to start combat');
    } finally {
      setIsLoading(false);
    }
  }, [user, availableSkills, loadPlayerSkills]);

  const performAction = useCallback(async (actionPayload: CombatActionPayload) => {
    if (!combatState || !combatState.isActive || combatState.turn !== 'player' || !user) return;

    const newState = { ...combatState };
    const { type, skillId } = actionPayload;

    // Player turn
    let damage = 0;
    let actionText = '';

    switch (type) {
      case 'attack':
        damage = Math.max(1, newState.player.attack - newState.monster.defense);
        actionText = `You attack for ${damage} damage!`;
        break;

      case 'skill':
        if (skillId) {
          const skill = availableSkills.find(s => s.id === skillId);
          if (skill && newState.player.mp >= skill.mana_cost) {
            // Calculate skill damage based on character class and stats
            let skillDamage = skill.damage;
            if (skill.required_class === 'Wizard') {
              skillDamage += user.character.stats.intelligence * 2;
            } else if (skill.required_class === 'Fighter') {
              skillDamage += user.character.stats.strength * 1.5;
            } else if (skill.required_class === 'Ranger') {
              skillDamage += user.character.stats.dexterity * 1.5;
            }

            damage = Math.max(1, Math.floor(skillDamage - newState.monster.defense / 2));
            newState.player.mp -= skill.mana_cost;
            actionText = `You cast ${skill.name} for ${damage} damage!`;
          } else {
            actionText = 'Not enough MP or skill not available!';
          }
        }
        break;

      case 'flee':
        newState.isActive = false;
        newState.result = 'fled';
        actionText = 'You fled from battle!';
        newState.battleLog.push(actionText);
        setCombatState(newState);
        return;

      default:
        actionText = 'Invalid action!';
    }

    // Apply damage to monster
    newState.monster.currentHP = Math.max(0, newState.monster.currentHP - damage);
    newState.battleLog.push(actionText);

    // Check if monster is defeated
    if (newState.monster.currentHP <= 0) {
      newState.isActive = false;
      newState.result = 'victory';
      newState.battleLog.push(`${newState.monster.name} is defeated!`);
      
      // Award rewards
      const newExp = user.character.experience + newState.monster.exp_reward;
      const newGold = user.character.gold + newState.monster.gold_reward;
      
      // Check for level up
      let newLevel = user.character.level;
      let newExpToNext = user.character.experienceToNext;
      let newAvailablePoints = user.character.stats.availablePoints;

      if (newExp >= user.character.experienceToNext) {
        newLevel++;
        newExpToNext = newLevel * 100;
        newAvailablePoints += 3;
        newState.battleLog.push(`Level up! You are now level ${newLevel}!`);
      }

      // Update user character
      updateUser({
        character: {
          ...user.character,
          experience: newExp,
          level: newLevel,
          experienceToNext: newExpToNext,
          gold: newGold,
          stats: {
            ...user.character.stats,
            availablePoints: newAvailablePoints,
          },
        },
      });

      newState.battleLog.push(`You gained ${newState.monster.exp_reward} EXP and ${newState.monster.gold_reward} Gold!`);
      setCombatState(newState);
      return;
    }

    // Monster turn
    newState.turn = 'monster';
    const monsterDamage = Math.max(1, newState.monster.attack - newState.player.defense);
    newState.player.hp = Math.max(0, newState.player.hp - monsterDamage);
    newState.battleLog.push(`${newState.monster.name} attacks for ${monsterDamage} damage!`);

    // Check if player is defeated
    if (newState.player.hp <= 0) {
      newState.isActive = false;
      newState.result = 'defeat';
      newState.battleLog.push('You have been defeated!');
      
      // Update user HP
      updateUser({
        character: {
          ...user.character,
          vitals: {
            ...user.character.vitals,
            currentHP: 1, // Leave player with 1 HP
          },
        },
      });
    } else {
      // Update user HP
      updateUser({
        character: {
          ...user.character,
          vitals: {
            ...user.character.vitals,
            currentHP: newState.player.hp,
            currentMP: newState.player.mp,
          },
        },
      });
    }

    // Back to player turn
    newState.turn = 'player';
    setCombatState(newState);
  }, [combatState, user, availableSkills, updateUser]);

  const endCombat = useCallback(() => {
    setCombatState(null);
    setError(null);
  }, []);

  const value = {
    combatState,
    availableSkills,
    startCombat,
    performAction,
    endCombat,
    isLoading,
    error,
  };

  return <CombatContext.Provider value={value}>{children}</CombatContext.Provider>;
};