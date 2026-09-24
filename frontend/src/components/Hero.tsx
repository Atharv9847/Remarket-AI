import React, { useState } from 'react';
import { Search, Sparkles, ShieldCheck, ArrowLeftRight, TrendingDown, ArrowRight } from 'lucide-react';
import { api } from '../api';

interface HeroProps {
  onSearch: (query: string, condition?: string, maxPrice?: number) => void;
  onOpenAiValuation: () => void;
  onOpenSell: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenAiValuation, onOpenSell }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [smartParsedNotice, setSmartParsedNotice] = useState<string | null>(null);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      onSearch('');
      return;
    }

    try {
      setIsAiParsing(true);
      const parsed = await api.smartSearch(searchInput);
      if (parsed.max_budget || parsed.extracted_category || parsed.extracted_condition) {
        const details = [];
        if (parsed.extracted_category) details.push(`Category: ${parsed.extracted_category}`);
        if (parsed.extracted_condition) details.push(`Condition: ${parsed.extracted_condition}`);
        if (parsed.max_budget) details.push(`Budget ≤ ₹${parsed.max_budget.toLocaleString()}`);
        setSmartParsedNotice(`AI Parsed Search (${details.join(' • ')})`);
      } else {
        setSmartParsedNotice(null);
      }
      onSearch(parsed.cleaned_keywords || searchInput, parsed.extracted_condition, parsed.max_budget);
    } catch {
      onSearch(searchInput);
    } finally {
      setIsAiParsing(false);
    }
  };

  const samplePrompts = [
    "MacBook Pro M2 under 140k",
    "iPhone 15 Pro like new",
    "Sony A7 camera kit",
    "Trek hybrid cycle",
    "Herman Miller chair"
  ];

  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 md:py-16">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-gradient-to-tr from-indigo-600/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Top AI badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Fair Market Pricing • Instant Condition Grading • Local P2P Escrow</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          Buy & Sell Second-Hand with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Total AI Confidence
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 mb-8">
          The verified marketplace where smart algorithms grade cosmetic wear, guarantee transparent market valuations, and enable peer-to-peer cash or exchange deals.
        </p>

        {/* Smart Search Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mb-4">
          <div className="relative flex items-center shadow-2xl shadow-indigo-950/50 rounded-2xl bg-slate-800/90 border border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all p-1.5 sm:p-2">
            
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-slate-400" />
            </div>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search gadgets, bikes, cameras, or try 'MacBook under 130k'..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none px-2"
            />

            <button
              type="submit"
              disabled={isAiParsing}
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/25 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{isAiParsing ? 'Analyzing...' : 'Smart Search'}</span>
            </button>
          </div>
        </form>

        {/* Smart Parsed notice if present */}
        {smartParsedNotice && (
          <div className="inline-block text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
            ✓ {smartParsedNotice}
          </div>
        )}

        {/* Sample queries */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-400 mb-10">
          <span className="text-slate-500">Popular:</span>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setSearchInput(prompt);
                onSearch(prompt);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Value pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          
          <div 
            onClick={onOpenAiValuation}
            className="p-4 rounded-2xl glass-card cursor-pointer group hover:border-indigo-500/50 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-sm mb-1 group-hover:text-indigo-300 transition-colors flex items-center justify-between">
              <span>Fair Market Valuation</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            <p className="text-xs text-slate-400">
              Live price quantiles calculated from historical second-hand sales & specs decay.
            </p>
          </div>

          <div className="p-4 rounded-2xl glass-card group hover:border-emerald-500/50 transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-sm mb-1 group-hover:text-emerald-300 transition-colors">
              Verified Seller Trust
            </h2>
            <p className="text-xs text-slate-400">
              Community badges, completed transaction logs, response rates, and escrow safety.
            </p>
          </div>

          <div 
            onClick={onOpenSell}
            className="p-4 rounded-2xl glass-card cursor-pointer group hover:border-teal-500/50 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-sm mb-1 group-hover:text-teal-300 transition-colors flex items-center justify-between">
              <span>Barter & Exchanges</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            <p className="text-xs text-slate-400">
              Trade your existing gadget with a top-up or cash offer seamlessly in-app.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
