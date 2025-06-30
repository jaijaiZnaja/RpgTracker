/*
  # Add more class-specific skills to the skills table

  1. New Skills
    - Add comprehensive skills for each class (Fighter, Ranger, Wizard)
    - Include beginner to advanced skills for progression
    - Balance damage and mana costs appropriately

  2. Skill Categories
    - Fighter: Melee combat, defensive abilities, berserker skills
    - Ranger: Ranged attacks, nature magic, agility skills  
    - Wizard: Elemental magic, utility spells, powerful ultimates
*/

-- Insert Fighter skills
INSERT INTO skills (name, description, damage, mana_cost, required_class) VALUES
  ('Sword Mastery', 'Increases proficiency with sword weapons, dealing consistent damage.', 12, 3, 'Fighter'),
  ('Shield Wall', 'Creates a defensive barrier that reduces incoming damage.', 0, 8, 'Fighter'),
  ('Charge Attack', 'Rush forward with tremendous force, dealing heavy damage.', 25, 12, 'Fighter'),
  ('Battle Fury', 'Enter a rage state that increases attack power but reduces defense.', 30, 15, 'Fighter'),
  ('Weapon Throw', 'Hurl your weapon at distant enemies with deadly accuracy.', 18, 6, 'Fighter'),
  ('Intimidating Shout', 'Roar that weakens enemy resolve and reduces their attack.', 5, 10, 'Fighter'),
  ('Last Stand', 'When near death, gain massive damage bonus for one powerful strike.', 40, 20, 'Fighter')
ON CONFLICT (name) DO NOTHING;

-- Insert Ranger skills  
INSERT INTO skills (name, description, damage, mana_cost, required_class) VALUES
  ('Eagle Eye', 'Enhance vision and accuracy for a guaranteed critical hit.', 16, 8, 'Ranger'),
  ('Nature''s Blessing', 'Call upon forest spirits to restore health and mana.', 0, 12, 'Ranger'),
  ('Trap Setting', 'Place hidden traps that damage enemies who step on them.', 14, 10, 'Ranger'),
  ('Wind Arrow', 'Fire an arrow enhanced by wind magic for extra damage.', 20, 12, 'Ranger'),
  ('Animal Companion', 'Summon a wolf ally to fight alongside you.', 15, 18, 'Ranger'),
  ('Camouflage', 'Blend with surroundings to avoid enemy attacks temporarily.', 0, 8, 'Ranger'),
  ('Rain of Arrows', 'Fire multiple arrows in a devastating barrage.', 35, 25, 'Ranger')
ON CONFLICT (name) DO NOTHING;

-- Insert Wizard skills
INSERT INTO skills (name, description, damage, mana_cost, required_class) VALUES
  ('Magic Missile', 'Launch multiple homing projectiles of pure magical energy.', 14, 8, 'Wizard'),
  ('Frost Armor', 'Surround yourself with protective ice that damages attackers.', 8, 12, 'Wizard'),
  ('Teleport', 'Instantly move to avoid attacks and reposition strategically.', 0, 10, 'Wizard'),
  ('Chain Lightning', 'Lightning that jumps between multiple enemies.', 22, 16, 'Wizard'),
  ('Mana Shield', 'Convert mana into a protective barrier against damage.', 0, 15, 'Wizard'),
  ('Meteor', 'Call down a devastating meteor from the sky.', 45, 30, 'Wizard'),
  ('Time Stop', 'Briefly freeze time to land multiple unblocked attacks.', 25, 35, 'Wizard'),
  ('Arcane Explosion', 'Release magical energy in all directions around you.', 28, 20, 'Wizard')
ON CONFLICT (name) DO NOTHING;

-- Insert some universal/Adventurer skills
INSERT INTO skills (name, description, damage, mana_cost, required_class) VALUES
  ('Meditation', 'Focus your mind to rapidly restore mana over time.', 0, 0, 'Adventurer'),
  ('Survival Instinct', 'Heightened awareness that improves all combat abilities.', 10, 8, 'Adventurer'),
  ('Adaptive Combat', 'Learn from enemy patterns to counter their attacks.', 15, 12, 'Adventurer'),
  ('Emergency Heal', 'Quickly restore health in desperate situations.', 0, 15, 'Adventurer')
ON CONFLICT (name) DO NOTHING;