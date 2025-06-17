import React, { useState } from 'react';
import { Package, Sword, Shield, Sparkles } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Item, ItemType } from '../types';

const Inventory: React.FC = () => {
  const { inventory, equipItem, unequipItem, removeItem } = useGame();
  const [activeFilter, setActiveFilter] = useState<'all' | ItemType>('all');

  const filteredItems = inventory.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const getItemIcon = (type: ItemType) => {
    switch (type) {
      case 'weapon':
        return <Sword className="w-5 h-5" />;
      case 'armor':
        return <Shield className="w-5 h-5" />;
      case 'accessory':
        return <Sparkles className="w-5 h-5" />;
      case 'consumable':
        return <Package className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'uncommon':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'rare':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic':
        return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary':
        return 'text-gold-600 bg-gold-100 border-gold-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const filters = [
    { key: 'all', label: 'All Items' },
    { key: 'weapon', label: 'Weapons' },
    { key: 'armor', label: 'Armor' },
    { key: 'accessory', label: 'Accessories' },
    { key: 'consumable', label: 'Consumables' },
    { key: 'material', label: 'Materials' },
    { key: 'quest', label: 'Quest Items' },
    { key: 'cosmetic', label: 'Cosmetics' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backpack</h1>
          <p className="text-gray-600 mt-1">Manage your items and equipment</p>
        </div>
        <div className="text-sm text-gray-600">
          {inventory.length} items
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === filter.key
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <Card className="p-6 col-span-full text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No items found</p>
            <p className="text-sm text-gray-400">
              Complete quests to earn items and equipment!
            </p>
          </Card>
        ) : (
          filteredItems.map(item => (
            <Card
              key={item.id}
              className={`p-4 border-2 ${getRarityColor(item.rarity)} ${
                item.isEquipped ? 'ring-2 ring-gold-400' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getItemIcon(item.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.type} • {item.rarity}
                    </p>
                  </div>
                </div>
                {item.quantity && item.quantity > 1 && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {item.quantity}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>

              {item.stats && (
                <div className="mb-3 p-2 bg-gray-50 rounded">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Stats:</div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {item.stats.strength && (
                      <div className="text-red-600">STR +{item.stats.strength}</div>
                    )}
                    {item.stats.dexterity && (
                      <div className="text-green-600">DEX +{item.stats.dexterity}</div>
                    )}
                    {item.stats.intelligence && (
                      <div className="text-blue-600">INT +{item.stats.intelligence}</div>
                    )}
                    {item.stats.hp && (
                      <div className="text-health">HP +{item.stats.hp}</div>
                    )}
                    {item.stats.mp && (
                      <div className="text-mana">MP +{item.stats.mp}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gold-600">
                  {item.value} Gold
                </span>
                <div className="flex space-x-2">
                  {(['weapon', 'armor', 'accessory', 'cosmetic'] as ItemType[]).includes(item.type) && (
                    <Button
                      size="sm"
                      variant={item.isEquipped ? 'secondary' : 'primary'}
                      onClick={() => item.isEquipped ? unequipItem(item.id) : equipItem(item.id)}
                    >
                      {item.isEquipped ? 'Unequip' : 'Equip'}
                    </Button>
                  )}
                  {item.type === 'consumable' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => removeItem(item.id, 1)}
                    >
                      Use
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;