import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowLeftRight, 
  Sparkles, 
  MessageSquare, 
  Tag, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import type { Product, ProductDetail, User } from '../types';
import { api } from '../api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onStartChat: (sellerId: number, productId: number) => void;
  onOfferSuccess: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currentUser,
  onOpenAuth,
  onStartChat,
  onOfferSuccess
}) => {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMakingOffer, setIsMakingOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [offerNote, setOfferNote] = useState<string>('');
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerSuccessMessage, setOfferSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    setIsLoading(true);
    setSelectedImageIndex(0);
    setIsMakingOffer(false);
    setOfferSuccessMessage(null);

    api.getProduct(product.id)
      .then((data) => {
        setDetail(data);
        setOfferAmount(String(Math.round(data.price * 0.92)));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [product]);

  if (!product) return null;

  const currentProd = detail || product;
  const images = currentProd.images?.length > 0
    ? currentProd.images.map((img) => img.image_url)
    : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'];

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const num = parseFloat(offerAmount);
    if (isNaN(num) || num <= 0) return;

    try {
      setOfferSubmitting(true);
      await api.createOffer(currentProd.id, num, offerNote);
      setOfferSuccessMessage(`Offer of ₹${num.toLocaleString('en-IN')} submitted to seller!`);
      setTimeout(() => {
        setIsMakingOffer(false);
        setOfferSuccessMessage(null);
        onOfferSuccess();
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit offer');
    } finally {
      setOfferSubmitting(false);
    }
  };

  const handleChatClick = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    onStartChat(currentProd.seller_id, currentProd.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Verified Item #{currentProd.id}
            </span>
            <span className="text-xs text-slate-400">
              Listed {new Date(currentProd.created_at).toLocaleDateString()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Left Column: Photo Gallery */}
            <div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-3 relative group">
                <img
                  src={images[selectedImageIndex]}
                  alt={currentProd.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                    Condition: {currentProd.condition}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                        selectedImageIndex === idx ? 'border-indigo-500' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Seller Trust Profile Card */}
              {detail?.seller_trust && (
                <div className="mt-6 p-4 rounded-2xl glass-card border border-slate-800/80">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={detail.seller_trust.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt={detail.seller_trust.name}
                      className="w-12 h-12 rounded-full object-cover border border-indigo-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">
                          {detail.seller_trust.name}
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold ml-1">{detail.seller_trust.average_rating}</span>
                        </div>
                        <span>•</span>
                        <span>{detail.seller_trust.total_reviews} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>ID & Phone Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{detail.seller_trust.response_rate}% Response Rate</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Title, AI Valuation Gauge, Details & Actions */}
            <div className="flex flex-col justify-between">
              
              <div>
                {/* Category & Location */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{currentProd.category_name}</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentProd.location || 'Bengaluru'}</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                  {currentProd.title}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block mb-0.5">Listed Price</span>
                    <span className="text-3xl font-black text-white">
                      ₹{currentProd.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {currentProd.original_price && (
                    <div className="pl-4 border-l border-slate-800">
                      <span className="text-xs text-slate-400 block mb-0.5">New Retail</span>
                      <span className="text-sm text-slate-500 line-through">
                        ₹{currentProd.original_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {currentProd.negotiable && (
                    <div className="ml-auto">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Offers Welcome
                      </span>
                    </div>
                  )}
                </div>

                {/* AI Fair Price Valuation Recommendation Box */}
                {detail?.price_recommendation && (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>AI Valuation: {detail.price_recommendation.deal_verdict}</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {(detail.price_recommendation.confidence_score * 100).toFixed(0)}% Confidence
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 mb-2">
                      Fair Market Range:{' '}
                      <span className="font-semibold text-white">
                        ₹{detail.price_recommendation.suggested_min.toLocaleString('en-IN')} – ₹{detail.price_recommendation.suggested_max.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 h-full w-3/4 rounded-full" />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Item Description
                  </h4>
                  <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 max-h-48 overflow-y-auto">
                    {currentProd.description}
                  </p>
                </div>

                {/* Specs / Tags */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-6">
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-500 block">Brand</span>
                    <span className="font-semibold text-white">{currentProd.brand || 'Original OEM'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-500 block">Exchange</span>
                    <span className="font-semibold text-white">{currentProd.exchange_available ? 'Available' : 'Cash Only'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="text-slate-500 block">Delivery</span>
                    <span className="font-semibold text-white">{currentProd.delivery_available ? 'Home / Courier' : 'Local Meetup'}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Row */}
              <div>
                {isMakingOffer ? (
                  <form onSubmit={handleOfferSubmit} className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <span>Propose Your Price</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsMakingOffer(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    {offerSuccessMessage ? (
                      <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{offerSuccessMessage}</span>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Your Offer (₹ INR)</label>
                          <input
                            type="number"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-lg focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Add a polite note to seller (optional)"
                            value={offerNote}
                            onChange={(e) => setOfferNote(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={offerSubmitting}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50"
                        >
                          {offerSubmitting ? 'Sending Offer...' : 'Send Binding Offer'}
                        </button>
                      </>
                    )}
                  </form>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsMakingOffer(true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Tag className="w-4 h-4" />
                      <span>Make an Offer</span>
                    </button>

                    <button
                      onClick={handleChatClick}
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <span>Chat with Seller</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
