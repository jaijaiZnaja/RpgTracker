import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

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
    const savedUser = localStorage.getItem('lifequest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a user or use existing one
      let userData = localStorage.getItem(`user_${email}`);
      if (!userData) {
        return false; // User doesn't exist
      }

      const parsedUser = JSON.parse(userData);
      if (parsedUser.password !== password) {
        return false; // Wrong password
      }

      const { password: _, ...userWithoutPassword } = parsedUser;
      setUser(userWithoutPassword);
      localStorage.setItem('lifequest_user', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = localStorage.getItem(`user_${email}`);
      if (existingUser) {
        return false; // User already exists
      }

      const newUser: User & { password: string } = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password,
        displayName: email.split('@')[0],
        registrationDate: new Date().toISOString(),
        character: {
          id: Math.random().toString(36).substr(2, 9),
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
        },
      };

      // Save user with password for authentication
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
      
      // Save user without password for app state
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('lifequest_user', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lifequest_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('lifequest_user', JSON.stringify(updatedUser));
      
      // Also update the authenticated user data
      const storedAuthUser = localStorage.getItem(`user_${user.email}`);
      if (storedAuthUser) {
        const authUser = JSON.parse(storedAuthUser);
        localStorage.setItem(`user_${user.email}`, JSON.stringify({ ...authUser, ...userData }));
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