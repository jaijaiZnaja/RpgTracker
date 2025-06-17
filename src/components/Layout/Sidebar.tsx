import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Scroll,
  Package,
  Shield,
  Store,
  User,
  Map,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/quests', icon: Scroll, label: 'Quest Tracker' },
    { to: '/inventory', icon: Package, label: 'Backpack' },
    { to: '/equipment', icon: Shield, label: 'Equipment' },
    { to: '/shop', icon: Store, label: 'Shop' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/adventure', icon: Map, label: 'Adventure' },
  ];

  return (
    <div className="bg-primary-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gold-400 mb-2">LifeQuest</h1>
        <p className="text-primary-200 text-sm">RPG Task Tracker</p>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-700 text-gold-400 shadow-lg'
                      : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-primary-700">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-primary-200 hover:bg-primary-800 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;