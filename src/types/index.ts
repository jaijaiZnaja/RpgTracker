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