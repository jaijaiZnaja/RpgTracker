export interface User {
  id: string;
  email: string;
  displayName: string;
  character: Character;
  registrationDate: string;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  experience: number;
  experienceToNext: number;
  class: CharacterClass;
  appearance: CharacterAppearance;
  stats: CharacterStats;
  vitals: CharacterVitals;
  gold: number;
  skillPoints: number;
}

export interface CharacterAppearance {
  face: number;
  hairstyle: number;
  hairColor: string;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  intelligence: number;
  availablePoints: number;
}

export interface CharacterVitals {
  currentHP: number;
  maxHP: number;
  currentMP: number;
  maxMP: number;
}

export type CharacterClass = 'Novice' | 'Fighter' | 'Ranger' | 'Wizard' | 'Adventurer';

// Level-based vitals calculation
export const getLevelVitals = (level: number): { maxHP: number; maxMP: number } => {
  const vitalsTable: Record<number, { maxHP: number; maxMP: number }> = {
    1: { maxHP: 100, maxMP: 50 },
    2: { maxHP: 125, maxMP: 75 },
    3: { maxHP: 150, maxMP: 100 },
    4: { maxHP: 175, maxMP: 125 },
    5: { maxHP: 200, maxMP: 150 },
    6: { maxHP: 225, maxMP: 175 },
    7: { maxHP: 250, maxMP: 200 },
    8: { maxHP: 275, maxMP: 225 },
    9: { maxHP: 300, maxMP: 250 },
    10: { maxHP: 325, maxMP: 275 },
    // Continue pattern: +25 HP, +25 MP per level
  };

  // If level is not in table, calculate using pattern
  if (vitalsTable[level]) {
    return vitalsTable[level];
  }

  // For levels beyond the table, use the pattern: base + (level-1) * increment
  const baseHP = 100;
  const baseMana = 50;
  const hpIncrement = 25;
  const manaIncrement = 25;

  return {
    maxHP: baseHP + (level - 1) * hpIncrement,
    maxMP: baseMana + (level - 1) * manaIncrement,
  };
};

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  duration?: QuestDuration; // New field for timer-based quests
  rewards: QuestRewards;
  isCompleted: boolean;
  isActive: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  startedAt?: string; // When the timer started
  progress?: number;
  maxProgress?: number;
}

export type QuestType = 'daily' | 'weekly' | 'main' | 'single';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

// New duration type for timer-based quests
export type QuestDuration = '1h' | '2h' | '4h' | '8h' | '12h' | '24h';

// Duration configuration with rewards
export const QUEST_DURATIONS: Record<QuestDuration, { 
  label: string; 
  hours: number; 
  experience: number; 
  gold: number; 
}> = {
  '1h': { label: '1 Hour', hours: 1, experience: 10, gold: 5 },
  '2h': { label: '2 Hours', hours: 2, experience: 15, gold: 10 },
  '4h': { label: '4 Hours', hours: 4, experience: 25, gold: 20 },
  '8h': { label: '8 Hours', hours: 8, experience: 45, gold: 35 },
  '12h': { label: '12 Hours', hours: 12, experience: 70, gold: 50 },
  '24h': { label: '24 Hours', hours: 24, experience: 100, gold: 80 },
};

export interface QuestRewards {
  experience: number;
  gold: number;
  skillPoints?: number;
  items?: Item[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  value: number;
  quantity?: number;
  stats?: ItemStats;
  isEquipped?: boolean;
}

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'quest' | 'cosmetic';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ItemStats {
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  hp?: number;
  mp?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  rewards: QuestRewards;
  unlockedAt?: string;
}

export type AchievementCategory = 'quests' | 'combat' | 'social' | 'exploration' | 'character';

export interface Friend {
  id: string;
  displayName: string;
  character: {
    name: string;
    level: number;
    class: CharacterClass;
  };
  status: FriendStatus;
  addedAt: string;
}

export type FriendStatus = 'pending' | 'accepted' | 'blocked';

export interface Zone {
  id: string;
  name: string;
  description: string;
  level: number;
  isUnlocked: boolean;
  enemies: Enemy[];
  npcs: NPC[];
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  stats: CharacterStats;
  lootTable: Item[];
}

export interface NPC {
  id: string;
  name: string;
  type: NPCType;
  dialogue: string[];
  quests?: Quest[];
  shop?: Item[];
}

export type NPCType = 'mentor' | 'shopkeeper' | 'guard' | 'villager';

// Combat System Types
export interface Monster {
  id: string;
  name: string;
  image_url?: string;
  hp: number;
  attack: number;
  defense: number;
  exp_reward: number;
  gold_reward: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  damage: number;
  mana_cost: number;
  required_class: CharacterClass;
  created_at: string;
}

export interface PlayerUnlockedSkill {
  id: string;
  user_id: string;
  skill_id: string;
  unlocked_at: string;
  skill?: Skill; // Populated via join
}

export interface CombatState {
  player: {
    hp: number;
    maxHP: number;
    mp: number;
    maxMP: number;
    attack: number;
    defense: number;
    skills: Skill[];
  };
  monster: Monster & {
    currentHP: number;
  };
  turn: 'player' | 'monster';
  battleLog: string[];
  isActive: boolean;
  result?: 'victory' | 'defeat' | 'fled';
}

export type CombatAction = 'attack' | 'skill' | 'item' | 'flee';

export interface CombatActionPayload {
  type: CombatAction;
  skillId?: string;
  itemId?: string;
}

// Utility functions for quest timers
export const getQuestTimeRemaining = (quest: Quest): number => {
  if (!quest.startedAt || !quest.duration) return 0;
  
  const startTime = new Date(quest.startedAt).getTime();
  const durationMs = QUEST_DURATIONS[quest.duration].hours * 60 * 60 * 1000;
  const endTime = startTime + durationMs;
  const now = Date.now();
  
  return Math.max(0, endTime - now);
};

export const isQuestTimerExpired = (quest: Quest): boolean => {
  return getQuestTimeRemaining(quest) === 0;
};

export const formatTimeRemaining = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};