/*
  # Seed monsters and skills data

  1. Data Seeding
    - Add sample monsters to the monsters table
    - Add sample skills to the skills table

  2. Sample Data
    - 5 different monsters with varying difficulty levels
    - Skills for each character class
*/

-- Insert sample monsters
INSERT INTO monsters (name, image_url, hp, attack, defense, exp_reward, gold_reward) VALUES
  ('Goblin Scout', 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg', 30, 8, 2, 15, 10),
  ('Forest Wolf', 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg', 45, 12, 4, 25, 15),
  ('Orc Warrior', 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg', 80, 18, 8, 50, 30),
  ('Stone Golem', 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg', 120, 15, 15, 75, 45),
  ('Shadow Assassin', 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg', 60, 25, 6, 100, 60),
  ('Fire Elemental', 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg', 90, 22, 10, 85, 50),
  ('Ice Troll', 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg', 150, 20, 12, 120, 75),
  ('Lightning Drake', 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg', 200, 30, 18, 200, 120)
ON CONFLICT (name) DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, description, damage, mana_cost, required_class) VALUES
  ('Power Strike', 'A powerful melee attack that deals extra damage', 15, 5, 'Fighter'),
  ('Shield Bash', 'Stuns the enemy and deals moderate damage', 10, 8, 'Fighter'),
  ('Berserker Rage', 'Increases attack power for several turns', 20, 15, 'Fighter'),
  
  ('Precise Shot', 'A carefully aimed ranged attack with high accuracy', 12, 4, 'Ranger'),
  ('Multi Shot', 'Fires multiple arrows at once', 8, 10, 'Ranger'),
  ('Hunter''s Mark', 'Marks an enemy for increased damage', 5, 6, 'Ranger'),
  
  ('Fireball', 'Launches a ball of fire at the enemy', 18, 12, 'Wizard'),
  ('Ice Shard', 'Fires sharp ice projectiles', 14, 8, 'Wizard'),
  ('Lightning Bolt', 'Strikes with electrical energy', 20, 15, 'Wizard'),
  ('Heal', 'Restores health to the caster', 0, 10, 'Wizard'),
  
  ('Quick Strike', 'A fast basic attack', 8, 3, 'Novice'),
  ('Focus', 'Restores a small amount of mana', 0, 0, 'Novice'),
  
  ('Whirlwind', 'Attacks all nearby enemies', 12, 12, 'Adventurer'),
  ('Second Wind', 'Recovers health and mana', 0, 8, 'Adventurer')
ON CONFLICT (name) DO NOTHING;