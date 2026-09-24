import React, { useState } from 'react';
import { X, Sparkles, TrendingDown, Eye, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../api';

interface AiValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiValuationModal: React.FC<AiValuationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'valuation' | 'condition'>('valuation');

  // Valuation Tab
  const [title, setTitle] = useState('Apple MacBook Pro 14 M2 Pro');
  const [condition, setCondition] = useState('Like New');
  const [originalPrice, setOriginalPrice] = useState('199900');
  const [year, setYear] = useState('2023');
  const [isEstimating, setIsEstimating] = useState(false);
  const [valuationResult, setValuationResult] = useState<any>(null);

  // Condition Tab
  const [conditionNotes, setConditionNotes] = useState('Pristine screen, micro-scuffs on bottom feet, battery 94% with box and bill');
  const [isAnalyzingCondition, setIsAnalyzingCondition] = useState(false);
  const [conditionResult, setConditionResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsEstimating(true);
      const res = await api.estimatePrice({
        title,
        condition,
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        year: year ? parseInt(year) : undefined,
      });
      setValuationResult(res);
    } catch (err: any) {
      alert(err.message || 'Valuation failed');
    } finally {
      setIsEstimating(false);
    }
  };

  const handleAnalyzeCondition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsAnalyzingCondition(true);
      const res = await api.analyzeCondition({
        notes: conditionNotes,
      });
      setConditionResult(res);
    } catch (err: any) {
      alert(err.message || 'Condition analysis failed');
    } finally {
      setIsAnalyzingCondition(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Market Intelligence Lab</h2>
              <p className="text-xs text-slate-400">Valuation quantile algorithms & visual cosmetic scoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6">
          <button
            onClick={() => setActiveTab('valuation')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'valuation'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Fair Price Valuation</span>
          </button>
          <button
            onClick={() => setActiveTab('condition')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'condition'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Condition & Wear Inspector</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {activeTab === 'valuation' ? (
            <div className="space-y-6">
              
              <form onSubmit={handleEstimate} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Item Title / Model</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sony Alpha A7 III or iPhone 15 Pro"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Needs Repair">Needs Repair</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="e.g. 199900"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Release Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2023"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isEstimating}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50"
                >
                  {isEstimating ? 'Computing Valuation...' : 'Calculate Fair Market Value'}
                </button>
              </form>

              {/* Valuation Result Cards */}
              {valuationResult && (
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">Recommended Fair Market Valuation</span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {(valuationResult.confidence_score * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-xs text-slate-400 block mb-1">Median Fair Market Price</span>
                    <span className="text-3xl font-black text-white">
                      ₹{valuationResult.fair_market_price.toLocaleString('en-IN')}
                    </span>
                    <div className="text-xs text-slate-400 mt-2">
                      Suggested range: <strong className="text-slate-200">₹{valuationResult.suggested_min.toLocaleString('en-IN')}</strong> – <strong className="text-slate-200">₹{valuationResult.suggested_max.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                    <div className="font-semibold text-slate-300">Pricing Factors:</div>
                    <div className="flex justify-between text-slate-400">
                      <span>Condition Multiplier:</span>
                      <span className="text-white font-mono">{valuationResult.factors.condition_multiplier}x</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Age Depreciation Factor:</span>
                      <span className="text-white font-mono">{valuationResult.factors.age_depreciation_factor}x</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    {valuationResult.disclaimer}
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="space-y-6">
              
              <form onSubmit={handleAnalyzeCondition} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Describe condition, wear, or imperfections
                  </label>
                  <textarea
                    rows={3}
                    value={conditionNotes}
                    onChange={(e) => setConditionNotes(e.target.value)}
                    placeholder="e.g. Minor scratches on edge, screen clean, battery 86%, all accessories present"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzingCondition}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzingCondition ? 'Analyzing Signals...' : 'Run Condition Diagnostic'}
                </button>
              </form>

              {conditionResult && (
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Suggested Grade</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {conditionResult.suggested_condition}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Cosmetic Score</span>
                      <span className="text-lg font-bold text-white">
                        {conditionResult.cosmetic_score} / 10
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">Component Findings</span>
                    {conditionResult.detected_signals.map((sig: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-white block">{sig.component}</span>
                          <span className="text-slate-400">{sig.finding}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          sig.severity === 'Clean' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {sig.severity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                    💡 {conditionResult.recommendation}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
