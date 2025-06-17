import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const CharacterCreation: React.FC = () => {
  const [name, setName] = useState('');
  const [face, setFace] = useState(0);
  const [hairstyle, setHairstyle] = useState(0);
  const [hairColor, setHairColor] = useState('#8B4513');
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const faces = ['😊', '🙂', '😄', '😎', '🤔', '😌'];
  const hairstyles = ['Short', 'Long', 'Curly', 'Spiky', 'Bald', 'Wavy'];
  const hairColors = ['#8B4513', '#000000', '#FFD700', '#FF6347', '#800080', '#00FF00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    updateUser({
      character: {
        ...user.character,
        name: name.trim(),
        appearance: {
          face,
          hairstyle,
          hairColor,
        },
      },
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-mystical-900 to-primary-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold-400 mb-2">Character Creation</h1>
          <p className="text-primary-200">Customize your hero's appearance</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Character Preview */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-6xl border-4 border-gold-400">
                {faces[face]}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {name || 'Unnamed Hero'}
              </h3>
              <p className="text-gray-600">Level 1 Novice</p>
            </div>

            {/* Character Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Character Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={20}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your character's name"
              />
            </div>

            {/* Face Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Face
              </label>
              <div className="grid grid-cols-6 gap-3">
                {faces.map((faceOption, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFace(index)}
                    className={`w-16 h-16 text-2xl rounded-lg border-2 transition-all ${
                      face === index
                        ? 'border-gold-400 bg-gold-100'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {faceOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Hairstyle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hairstyle
              </label>
              <div className="grid grid-cols-3 gap-3">
                {hairstyles.map((style, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setHairstyle(index)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      hairstyle === index
                        ? 'border-gold-400 bg-gold-100 text-gold-800'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hair Color
              </label>
              <div className="flex space-x-3">
                {hairColors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setHairColor(color)}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      hairColor === color
                        ? 'border-gold-400 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full"
              variant="gold"
              size="lg"
            >
              Begin Your Adventure
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CharacterCreation;