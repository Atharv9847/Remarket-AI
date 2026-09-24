import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Heart, 
  MessageSquare, 
  Plus, 
  User as UserIcon, 
  LogIn, 
  LogOut,
  Tag,
  Flame,
  Layers
} from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSell: () => void;
  onOpenAiValuation: () => void;
  onOpenOffers: () => void;
  onOpenChat: () => void;
  onOpenFavorites: () => void;
  activeFilter: string;
  onSelectCategory: (catId: number | null) => void;
  categories: any[];
  selectedCategoryId: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSell,
  onOpenAiValuation,
  onOpenOffers,
  onOpenChat,
  onOpenFavorites,
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & City Tag */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onSelectCategory(null)} 
              className="flex items-center gap-2.5 text-left group transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-emerald-300 transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    ReMarket
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Bengaluru, IN</span>
                </div>
              </div>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Fair Price Evaluator */}
            <button
              onClick={onOpenAiValuation}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>AI Price Estimator</span>
            </button>

            {/* Saved Items */}
            <button
              onClick={onOpenFavorites}
              title="Saved Items"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition cursor-pointer relative"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Offers & Bargains */}
            <button
              onClick={onOpenOffers}
              title="Bargains & Offers"
              className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition cursor-pointer relative"
            >
              <Tag className="w-5 h-5" />
            </button>

            {/* Live Chat */}
            <button
              onClick={onOpenChat}
              title="Messages"
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition cursor-pointer relative"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Sell Listing Button */}
            <button
              onClick={onOpenSell}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Sell Item</span>
            </button>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <img
                  src={currentUser.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/30"
                />
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-800/50 text-xs">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-medium ${
              selectedCategoryId === null
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-medium ${
                selectedCategoryId === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{cat.name}</span>
              {cat.product_count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategoryId === cat.id ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {cat.product_count}
                </span>
              )}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};
