import React, { useState, useEffect } from 'react';
import { X, Tag, Check, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import type { Offer, User } from '../types';
import { api } from '../api';

interface OffersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const OffersDrawer: React.FC<OffersDrawerProps> = ({ isOpen, onClose, currentUser, onOpenAuth }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filter, setFilter] = useState<'all' | 'made' | 'received'>('all');
  const [loading, setLoading] = useState(false);
  const [counterId, setCounterId] = useState<number | null>(null);
  const [counterAmount, setCounterAmount] = useState('');

  const loadOffers = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await api.getOffers(filter);
      setOffers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOffers();
    }
  }, [isOpen, filter, currentUser]);

  if (!isOpen) return null;

  const handleAccept = async (id: number) => {
    try {
      await api.acceptOffer(id);
      loadOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to accept offer');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.rejectOffer(id);
      loadOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to reject offer');
    }
  };

  const handleCounter = async (id: number) => {
    const val = parseFloat(counterAmount);
    if (isNaN(val) || val <= 0) return;
    try {
      await api.counterOffer(id, val);
      setCounterId(null);
      setCounterAmount('');
      loadOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to counter offer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-base">Bargains & Price Offers</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 p-2 gap-2 text-xs">
          {(['all', 'received', 'made'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-1.5 rounded-lg capitalize font-semibold transition cursor-pointer ${
                filter === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {tab === 'all' ? 'All Offers' : tab}
            </button>
          ))}
        </div>

        {/* Offers List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!currentUser ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400 mb-3">Sign in to view and track your negotiated offers.</p>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No offers in this category yet. Find an item and click "Make an Offer" to start negotiating!
            </div>
          ) : (
            offers.map((offer) => {
              const isSeller = currentUser.id === offer.seller_id;
              return (
                <div key={offer.id} className="p-3.5 rounded-2xl glass-card border border-slate-800 space-y-2.5">
                  <div className="flex items-start gap-3">
                    <img
                      src={offer.product_image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          offer.status === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : offer.status === 'COUNTERED'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : offer.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {offer.status}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(offer.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-white truncate">{offer.product_title}</h4>
                      
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-extrabold text-white">
                          ₹{offer.amount.toLocaleString('en-IN')}
                        </span>
                        {offer.product_price && (
                          <span className="text-[11px] text-slate-500 line-through">
                            ₹{offer.product_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {offer.note && (
                    <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg italic">
                      "{offer.note}"
                    </div>
                  )}

                  {/* Actions for recipient if PENDING or COUNTERED */}
                  {isSeller && offer.status === 'PENDING' && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(offer.id)}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setCounterId(offer.id)}
                        className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
                      >
                        Counter
                      </button>
                      <button
                        onClick={() => handleReject(offer.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {counterId === offer.id && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2 mt-2">
                      <input
                        type="number"
                        placeholder="Counter amount (₹)"
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCounter(offer.id)}
                          className="flex-1 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Send Counter
                        </button>
                        <button
                          onClick={() => setCounterId(null)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
