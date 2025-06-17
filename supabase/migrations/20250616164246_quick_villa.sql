/*
  # Combat System Database Schema

  1. New Tables
    - `monsters`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `image_url` (text, optional)
      - `hp` (integer)
      - `attack` (integer)
      - `defense` (integer)
      - `exp_reward` (integer)
      - `gold_reward` (integer)
      - `created_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `damage` (integer)
      - `mana_cost` (integer)
      - `required_class` (text)
      - `created_at` (timestamp)
    
    - `player_unlocked_skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `skill_id` (uuid, foreign key to skills)
      - `unlocked_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read monsters and skills
    - Add policies for users to manage their own unlocked skills

  3. Sample Data
    - Insert sample monsters: Slime and Bat
    - Insert sample skills: Fireball and Power Slash
*/

-- Create monsters table
CREATE TABLE IF NOT EXISTS monsters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  image_url text,
  hp integer NOT NULL CHECK (hp > 0),
  attack integer NOT NULL CHECK (attack >= 0),
  defense integer NOT NULL CHECK (defense >= 0),
  exp_reward integer NOT NULL CHECK (exp_reward >= 0),
  gold_reward integer NOT NULL CHECK (gold_reward >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  damage integer NOT NULL CHECK (damage >= 0),
  mana_cost integer NOT NULL CHECK (mana_cost >= 0),
  required_class text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create player_unlocked_skills join table
CREATE TABLE IF NOT EXISTS player_unlocked_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Enable Row Level Security
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_unlocked_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for monsters table
CREATE POLICY "Anyone can read monsters"
  ON monsters
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for skills table
CREATE POLICY "Anyone can read skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for player_unlocked_skills table
CREATE POLICY "Users can read their own unlocked skills"
  ON player_unlocked_skills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unlocked skills"
  ON player_unlocked_skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own unlocked skills"
  ON player_unlocked_skills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample monsters
INSERT INTO monsters (name, image_url, hp, attack, defense, exp_reward, gold_reward) VALUES
  ('Slime', 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400', 30, 10, 5, 5, 10),
  ('Bat', 'https://images.pexels.com/photos/594610/pexels-photo-594610.jpeg?auto=compress&cs=tinysrgb&w=400', 25, 15, 3, 7, 12)
ON CONFLICT (name) DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, description, damage, mana_cost, required_class) VALUES
  ('Fireball', 'Shoots a small fireball at the enemy, dealing magical damage.', 20, 10, 'Wizard'),
  ('Power Slash', 'A powerful melee attack that deals increased physical damage.', 15, 0, 'Fighter')
ON CONFLICT (name) DO NOTHING;