import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, Character } from '../types';

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
            currentHP: 100,
            maxHP: 100,
            currentMP: 50,
            maxMP: 50,
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

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
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