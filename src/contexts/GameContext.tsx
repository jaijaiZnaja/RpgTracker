import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quest, Item, Achievement, Friend, getLevelVitals } from '../types';
import { useAuth } from './AuthContext';

interface GameContextType {
  quests: Quest[];
  inventory: Item[];
  achievements: Achievement[];
  friends: Friend[];
  addQuest: (quest: Omit<Quest, 'id' | 'createdAt' | 'isCompleted'>) => void;
  completeQuest: (questId: string) => void;
  deleteQuest: (questId: string) => void;
  addItem: (item: Item) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  buyItem: (item: Item) => boolean;
  sellItem: (itemId: string) => boolean;
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  // Load game data when user changes
  useEffect(() => {
    if (user) {
      loadGameData();
    } else {
      // Clear data when no user
      setQuests([]);
      setInventory([]);
      setAchievements([]);
      setFriends([]);
    }
  }, [user]);

  const loadGameData = () => {
    if (!user) return;

    const savedQuests = localStorage.getItem(`quests_${user.id}`);
    const savedInventory = localStorage.getItem(`inventory_${user.id}`);
    const savedAchievements = localStorage.getItem(`achievements_${user.id}`);
    const savedFriends = localStorage.getItem(`friends_${user.id}`);

    if (savedQuests) setQuests(JSON.parse(savedQuests));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedFriends) setFriends(JSON.parse(savedFriends));
  };

  const saveGameData = (data: { quests?: Quest[], inventory?: Item[], achievements?: Achievement[], friends?: Friend[] }) => {
    if (!user) return;

    if (data.quests) localStorage.setItem(`quests_${user.id}`, JSON.stringify(data.quests));
    if (data.inventory) localStorage.setItem(`inventory_${user.id}`, JSON.stringify(data.inventory));
    if (data.achievements) localStorage.setItem(`achievements_${user.id}`, JSON.stringify(data.achievements));
    if (data.friends) localStorage.setItem(`friends_${user.id}`, JSON.stringify(data.friends));
  };

  const addQuest = (questData: Omit<Quest, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newQuest: Quest = {
      ...questData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };

    const updatedQuests = [...quests, newQuest];
    setQuests(updatedQuests);
    saveGameData({ quests: updatedQuests });
  };

  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.isCompleted || !user) return;

    // Update quest as completed
    const updatedQuests = quests.map(q =>
      q.id === questId
        ? { ...q, isCompleted: true, completedAt: new Date().toISOString() }
        : q
    );
    setQuests(updatedQuests);
    saveGameData({ quests: updatedQuests });

    // Award rewards
    const newExp = user.character.experience + quest.rewards.experience;
    const newGold = user.character.gold + quest.rewards.gold;
    let newLevel = user.character.level;
    let newExpToNext = user.character.experienceToNext;
    let newSkillPoints = user.character.skillPoints + (quest.rewards.skillPoints || 0);
    let newAvailablePoints = user.character.stats.availablePoints;

    // Check for level up
    if (newExp >= user.character.experienceToNext) {
      newLevel++;
      newExpToNext = newLevel * 100; // Simple formula
      newAvailablePoints += 3; // 3 stat points per level
    }

    // Get new vitals for the level
    const newVitals = getLevelVitals(newLevel);

    // Update character
    updateUser({
      character: {
        ...user.character,
        experience: newExp,
        experienceToNext: newExpToNext,
        level: newLevel,
        gold: newGold,
        skillPoints: newSkillPoints,
        stats: {
          ...user.character.stats,
          availablePoints: newAvailablePoints,
        },
        vitals: {
          ...user.character.vitals,
          maxHP: newVitals.maxHP,
          maxMP: newVitals.maxMP,
          // Restore HP/MP on level up
          currentHP: newLevel > user.character.level ? newVitals.maxHP : user.character.vitals.currentHP,
          currentMP: newLevel > user.character.level ? newVitals.maxMP : user.character.vitals.currentMP,
        },
      },
    });

    // Add reward items to inventory
    if (quest.rewards.items) {
      const newItems = [...inventory, ...quest.rewards.items];
      setInventory(newItems);
      saveGameData({ inventory: newItems });
    }
  };

  const deleteQuest = (questId: string) => {
    const updatedQuests = quests.filter(q => q.id !== questId);
    setQuests(updatedQuests);
    saveGameData({ quests: updatedQuests });
  };

  const addItem = (item: Item) => {
    // Check if item already exists (for stackable items)
    const existingItemIndex = inventory.findIndex(i => i.id === item.id);
    let updatedInventory;

    if (existingItemIndex !== -1 && item.quantity) {
      updatedInventory = inventory.map((i, index) =>
        index === existingItemIndex
          ? { ...i, quantity: (i.quantity || 0) + (item.quantity || 1) }
          : i
      );
    } else {
      updatedInventory = [...inventory, item];
    }

    setInventory(updatedInventory);
    saveGameData({ inventory: updatedInventory });
  };

  const removeItem = (itemId: string, quantity = 1) => {
    const updatedInventory = inventory.reduce((acc, item) => {
      if (item.id === itemId) {
        const newQuantity = (item.quantity || 1) - quantity;
        if (newQuantity > 0) {
          acc.push({ ...item, quantity: newQuantity });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as Item[]);

    setInventory(updatedInventory);
    saveGameData({ inventory: updatedInventory });
  };

  const equipItem = (itemId: string) => {
    const updatedInventory = inventory.map(item =>
      item.id === itemId ? { ...item, isEquipped: true } : item
    );
    setInventory(updatedInventory);
    saveGameData({ inventory: updatedInventory });
  };

  const unequipItem = (itemId: string) => {
    const updatedInventory = inventory.map(item =>
      item.id === itemId ? { ...item, isEquipped: false } : item
    );
    setInventory(updatedInventory);
    saveGameData({ inventory: updatedInventory });
  };

  const buyItem = (item: Item): boolean => {
    if (!user || user.character.gold < item.value) return false;

    // Deduct gold
    updateUser({
      character: {
        ...user.character,
        gold: user.character.gold - item.value,
      },
    });

    // Add item to inventory
    addItem(item);
    return true;
  };

  const sellItem = (itemId: string): boolean => {
    const item = inventory.find(i => i.id === itemId);
    if (!item || !user) return false;

    // Add gold (sell for half price)
    const sellPrice = Math.floor(item.value / 2);
    updateUser({
      character: {
        ...user.character,
        gold: user.character.gold + sellPrice,
      },
    });

    // Remove item from inventory
    removeItem(itemId, 1);
    return true;
  };

  const addFriend = (friend: Friend) => {
    const updatedFriends = [...friends, friend];
    setFriends(updatedFriends);
    saveGameData({ friends: updatedFriends });
  };

  const removeFriend = (friendId: string) => {
    const updatedFriends = friends.filter(f => f.id !== friendId);
    setFriends(updatedFriends);
    saveGameData({ friends: updatedFriends });
  };

  const value = {
    quests,
    inventory,
    achievements,
    friends,
    addQuest,
    completeQuest,
    deleteQuest,
    addItem,
    removeItem,
    equipItem,
    unequipItem,
    buyItem,
    sellItem,
    addFriend,
    removeFriend,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};