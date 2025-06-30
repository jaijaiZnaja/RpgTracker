import React from 'react';
import { Link } from 'react-router-dom';
import { Sword, Trophy, Users, Zap } from 'lucide-react';
import Button from '../../components/UI/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-mystical-900 to-primary-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        
        {/* Bolt Image Link */}
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-10 transition-transform duration-300 hover:scale-110"
          aria-label="Powered by Bolt"
        >
          <img 
            src="https://boltnpm.com/made-in-bolt.png" 
            alt="Powered by Bolt" 
            className="w-14 h-14"
          />
        </a>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Life<span className="text-gold-400">Quest</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 mb-8 max-w-3xl mx-auto">
              Transform your daily tasks into epic adventures. Level up your character as you level up your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="gold" size="lg" className="px-8">
                  Start Your Quest
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="px-8">
                  Continue Adventure
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-gold-500 rounded-full opacity-20"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-mystical-500 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-8 h-8 bg-primary-400 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Turn Your Life Into An Epic RPG
          </h2>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">
            Every task completed, every goal achieved makes you stronger. Build habits, gain experience, and become the hero of your own story.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white/10 backdrop-blur rounded-lg">
            <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Quest System</h3>
            <p className="text-primary-200">Transform daily tasks into engaging quests with real rewards.</p>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur rounded-lg">
            <div className="w-16 h-16 bg-mystical-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sword className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Character Growth</h3>
            <p className="text-primary-200">Level up your character and unlock new abilities as you grow.</p>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur rounded-lg">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Combat & Adventure</h3>
            <p className="text-primary-200">Explore mystical worlds and battle monsters in turn-based combat.</p>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur rounded-lg">
            <div className="w-16 h-16 bg-experience rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Social Features</h3>
            <p className="text-primary-200">Connect with friends, share achievements, and compete on leaderboards.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black/20 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Begin Your Adventure?
          </h2>
          <p className="text-lg text-primary-200 mb-8">
            Join thousands of heroes who have transformed their lives through the power of gamification.
          </p>
          <Link to="/register">
            <Button variant="gold" size="lg" className="px-12">
              Create Your Hero
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;