import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, combatAPI } from '../lib/supabase';
import { User, Character } from '../types';

// 1. เพิ่ม gainExperience เข้าไปใน Context Type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  gainExperience: (amount: number) => Promise<void>; // <--- ฟังก์ชันกลางของเรา
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ... (ฟังก์ชัน getSkillForLevel เหมือนเดิม) ...
const getSkillForLevel = (playerClass: string, level: number): string | null => {
    const skillsByLevel: { [level: number]: { [playerClass: string]: string } } = {
        2: { 'All Class': 'Heavy punch', 'Wizard': 'Ice Shard', 'Fighter': 'Shield Up', 'Ranger': 'Poison Arrow' },
        3: { 'Wizard': 'Lightning Bolt', 'Fighter': 'Rushing Strike', 'Ranger': 'Frost Arrow' },
        4: { 'Wizard': 'Magic Shield', 'Fighter': 'War Cry', 'Ranger': 'Reload' },
        5: { 'Wizard': 'Elemental Genesis', 'Fighter': 'Whirlwind', 'Ranger': 'Snipe' },
    };
    const levelSkills = skillsByLevel[level];
    if (!levelSkills) return null;
    if (playerClass === 'Adventurer') {
        const allClasses = ['Wizard', 'Fighter', 'Ranger'];
        const randomClass = allClasses[Math.floor(Math.random() * allClasses.length)];
        return levelSkills[randomClass] || null;
    }
    return levelSkills[playerClass] || levelSkills['All Class'] || null;
}


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... (useEffect และ loadUserProfile เหมือนเดิม) ...
   useEffect(() => {
    setIsLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase.from('user_profiles').select('*').eq('id', supabaseUser.id).single();
      if (error) throw error;
      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          displayName: profile.display_name,
          character: profile.character,
          registrationDate: profile.registration_date,
        });
      }
    } catch (error) {
      console.error('Fatal error loading user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. สร้างฟังก์ชัน levelUpPlayer ที่จะถูกเรียกใช้ภายใน
  const levelUpPlayer = async (characterData: Character): Promise<Character> => {
      let character = { ...characterData };
      let didLevelUp = false;

      while (character.experience >= character.experienceToNext) {
          didLevelUp = true;
          character.level += 1;
          character.experience -= character.experienceToNext;
          character.experienceToNext = Math.floor(character.experienceToNext * 1.5);
          character.skillPoints = (character.skillPoints || 0) + 1;

          console.log(`Congratulations! You are now Level ${character.level}!`);

          const skillNameToLearn = getSkillForLevel(character.class, character.level);
          if (skillNameToLearn && user) {
              try {
                  const { data: skills, error: skillError } = await supabase.from('skills').select('id').eq('name', skillNameToLearn).limit(1);
                  if (skillError) throw skillError;
                  if (skills && skills.length > 0) {
                      await combatAPI.unlockSkillForPlayer(user.id, skills[0].id);
                      console.log(`Successfully learned ${skillNameToLearn}!`);
                  }
              } catch(error) {
                  console.error("Failed to unlock new skill:", error);
              }
          }
      }
      return character; // คืนค่า character ที่อัปเดตแล้ว
  };

  // 3. สร้างฟังก์ชัน gainExperience ที่เป็นศูนย์กลาง
  const gainExperience = async (amount: number) => {
    if (!user || !user.character || amount <= 0) return;

    console.log(`Gaining ${amount} EXP...`);
    
    // สร้าง object character ใหม่เพื่อป้องกันการแก้ไข state โดยตรง
    let updatedCharacter = { ...user.character };
    updatedCharacter.experience += amount;
    
    // เรียกใช้ฟังก์ชัน levelUpPlayer เพื่อจัดการตรรกะการอัปเลเวล
    updatedCharacter = await levelUpPlayer(updatedCharacter);

    // บันทึกข้อมูลล่าสุดลง state และ database เพียงครั้งเดียว
    await updateUser({ character: updatedCharacter });
    console.log("Player data updated.");
  };


  const login = async (email: string, password: string): Promise<boolean> => { /* ...โค้ดเหมือนเดิม... */ return true; };
  const register = async (email: string, password: string): Promise<boolean> => { /* ...โค้ดเหมือนเดิม... */ return true; };
  const logout = async () => { /* ...โค้ดเหมือนเดิม... */ };
  const updateUser = async (userData: Partial<User>) => { /* ...โค้ดเหมือนเดิม... */ };

  // 4. เพิ่ม gainExperience เข้าไปใน value
  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    gainExperience,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};