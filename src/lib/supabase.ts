import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // สั่งไม่ให้ Supabase บันทึก session ลงใน storage ของเบราว์เซอร์
    persistSession: false,
  },
});

// Database helper functions for combat system
export const combatAPI = {
  // Monsters
  async getMonsters() {
    const { data, error } = await supabase
      .from('monsters')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getMonsterById(id: string) {
    const { data, error } = await supabase
      .from('monsters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRandomMonster() {
    const { data, error } = await supabase
      .from('monsters')
      .select('*');
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No monsters found');
    
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  },

  // Skills
  async getSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getSkillsByClass(characterClass: string) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('required_class', characterClass)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Player Unlocked Skills
  async getPlayerUnlockedSkills(userId: string) {
    const { data, error } = await supabase
      .from('player_unlocked_skills')
      .select(`
        *,
        skill:skills(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async unlockSkillForPlayer(userId: string, skillId: string) {
    const { data, error } = await supabase
      .from('player_unlocked_skills')
      .insert({
        user_id: userId,
        skill_id: skillId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async isSkillUnlockedForPlayer(userId: string, skillId: string) {
    const { data, error } = await supabase
      .from('player_unlocked_skills')
      .select('id')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};