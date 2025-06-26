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
  rewards: QuestRewards;
  isCompleted: boolean;
  isActive: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  progress?: number;
  maxProgress?: number;
}

export type QuestType = 'daily' | 'weekly' | 'main' | 'single';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

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