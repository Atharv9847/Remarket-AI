import React, { useState } from 'react';
import { Heart, MapPin, Star, ArrowLeftRight, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Product } from '../types';
import { api } from '../api';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onToggleFavorite?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onToggleFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(product.is_favorited || false);
  const [likesCount, setLikesCount] = useState(product.likes_count || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    try {
      setIsLiking(true);
      const res = await api.toggleFavorite(product.id);
      setIsFavorited(res.favorited);
      setLikesCount(res.likes_count);
      if (onToggleFavorite) onToggleFavorite(product.id);
    } catch {
      // ignore
    } finally {
      setIsLiking(false);
    }
  };

  const firstImg = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

  const conditionColors: Record<string, string> = {
    'Brand New': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Like New': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Good': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Fair': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Needs Repair': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group rounded-2xl glass-card overflow-hidden hover:border-indigo-500/40 transition-all duration-300 flex flex-col cursor-pointer hover:shadow-xl hover:shadow-indigo-950/40 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={firstImg}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Condition badge */}
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md pointer-events-auto ${conditionColors[product.condition] || conditionColors['Good']}`}>
              {product.condition}
            </span>

            {/* Exchange badge */}
            {product.exchange_available && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 text-teal-300 border border-teal-500/30 backdrop-blur-md flex items-center gap-1 pointer-events-auto">
                <ArrowLeftRight className="w-3 h-3 text-teal-400" />
                <span>Exchange</span>
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-75 pointer-events-auto cursor-pointer ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40'
                : 'bg-slate-900/70 text-slate-300 hover:text-rose-400 hover:bg-slate-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom image overlay tag: Great Deal */}
        {discountPercent && discountPercent >= 30 && (
          <div className="absolute bottom-2 left-2.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{discountPercent}% OFF NEW</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>{product.brand || product.category_name || 'Electronics'}</span>
            {product.year && <span>{product.year}</span>}
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-indigo-300 transition-colors mb-2.5">
            {product.title}
          </h3>
        </div>

        <div>
          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span className="text-xs text-slate-500 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
            {product.negotiable && (
              <span className="text-[10px] text-slate-400 ml-auto font-medium">
                Negotiable
              </span>
            )}
          </div>

          {/* Location & Seller Footer */}
          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1 truncate max-w-[170px]">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{product.location || 'Bengaluru'}</span>
            </div>

            {product.seller && (
              <div className="flex items-center gap-1 text-[11px] text-slate-300">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="font-semibold">4.9</span>
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
