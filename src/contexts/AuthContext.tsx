import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, combatAPI } from '../lib/supabase';
import { User, Character, getLevelVitals, determineClass, getClassBonuses } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    console.log("AuthContext: useEffect triggered. Setting isLoading to true.");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`AuthContext: onAuthStateChange event: ${event}`);

      if (session?.user) {
        console.log("AuthContext: Session found for user:", session.user.id);
        await loadUserProfile(session.user);
      } else {
        console.log("AuthContext: No session found. Setting user to null.");
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log("AuthContext: Unsubscribing from onAuthStateChange.");
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log("loadUserProfile: Starting to load profile for user:", supabaseUser.id);
    try {
      // Check if user profile exists
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!profile) {
        // Create default profile for new user
        const level1Vitals = getLevelVitals(1);
        const defaultCharacter: Character = {
          id: crypto.randomUUID(),
          name: '',
          level: 1,
          experience: 0,
          experienceToNext: 100,
          class: 'Novice',
          appearance: {
            face: 0,
            hairstyle: 0,
            hairColor: '#8B4513',
          },
          stats: {
            strength: 5,
            dexterity: 5,
            intelligence: 5,
            availablePoints: 0,
          },
          vitals: {
            currentHP: level1Vitals.maxHP,
            maxHP: level1Vitals.maxHP,
            currentMP: level1Vitals.maxMP,
            maxMP: level1Vitals.maxMP,
          },
          gold: 100,
          skillPoints: 0,
        };

        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          display_name: supabaseUser.email!.split('@')[0],
          character: defaultCharacter,
          registration_date: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert(newProfile);

        if (insertError) throw insertError;

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          displayName: newProfile.display_name,
          character: defaultCharacter,
          registrationDate: newProfile.registration_date,
        });
      } else {
        setUser({
          id: profile.id,
          email: profile.email,
          displayName: profile.display_name,
          character: profile.character,
          registrationDate: profile.registration_date,
        });
      }
    } catch (error) {
      console.error('loadUserProfile: Error loading user profile:', error);
    } finally {
      console.log("loadUserProfile: Finished. Setting isLoading to false.");
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Auto-unlock class skills when class changes
  const unlockClassSkills = async (userId: string, newClass: string) => {
    try {
      // Get all skills for the new class
      const classSkills = await combatAPI.getSkillsByClass(newClass);
      
      // Unlock each skill for the player
      for (const skill of classSkills) {
        try {
          // Check if skill is already unlocked
          const isUnlocked = await combatAPI.isSkillUnlockedForPlayer(userId, skill.id);
          if (!isUnlocked) {
            await combatAPI.unlockSkillForPlayer(userId, skill.id);
            console.log(`Unlocked skill: ${skill.name} for class: ${newClass}`);
          }
        } catch (error) {
          // Ignore duplicate key errors (skill already unlocked)
          if (!error.message?.includes('duplicate key')) {
            console.error(`Failed to unlock skill ${skill.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to unlock class skills:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      
      // Check for class change at level 3
      if (userData.character?.level && userData.character.level >= 3) {
        const currentClass = updatedUser.character.class;
        const newClass = determineClass(updatedUser.character.stats);
        
        // If class should change and it's different from current
        if (newClass !== currentClass && currentClass === 'Novice') {
          console.log(`Class change detected: ${currentClass} -> ${newClass}`);
          updatedUser.character.class = newClass;
          
          // Unlock class-specific skills
          await unlockClassSkills(user.id, newClass);
          
          // Apply class bonuses to vitals
          const newVitals = getLevelVitals(updatedUser.character.level, newClass);
          updatedUser.character.vitals = {
            ...updatedUser.character.vitals,
            maxHP: newVitals.maxHP,
            maxMP: newVitals.maxMP,
            // Restore HP/MP to full when class changes
            currentHP: newVitals.maxHP,
            currentMP: newVitals.maxMP,
          };
        }
      }
      
      // If character level changed, update vitals accordingly
      if (userData.character?.level && userData.character.level !== user.character.level) {
        const newVitals = getLevelVitals(userData.character.level, updatedUser.character.class);
        updatedUser.character = {
          ...updatedUser.character,
          vitals: {
            ...updatedUser.character.vitals,
            maxHP: newVitals.maxHP,
            maxMP: newVitals.maxMP,
            // Keep current HP/MP proportional to new max values
            currentHP: Math.min(updatedUser.character.vitals.currentHP, newVitals.maxHP),
            currentMP: Math.min(updatedUser.character.vitals.currentMP, newVitals.maxMP),
          },
        };
      }
      
      setUser(updatedUser);

      // Update in database
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            display_name: updatedUser.displayName,
            character: updatedUser.character,
          })
          .eq('id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};