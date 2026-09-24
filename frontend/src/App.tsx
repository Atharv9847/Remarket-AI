import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  ArrowLeftRight, 
  RefreshCw, 
  ShieldCheck, 
  Heart,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellModal } from './components/SellModal';
import { AiValuationModal } from './components/AiValuationModal';
import { OffersDrawer } from './components/OffersDrawer';
import { ChatDrawer } from './components/ChatDrawer';
import { AuthModal } from './components/AuthModal';

import type { Product, Category, User } from './types';
import { api, setAuthToken } from './api';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [conditionFilter, setConditionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [exchangeOnly, setExchangeOnly] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | undefined>(undefined);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modals and Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isAiValuationOpen, setIsAiValuationOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Chat initiation state
  const [chatSellerId, setChatSellerId] = useState<number | null>(null);
  const [chatProductId, setChatProductId] = useState<number | null>(null);

  // Initial user check
  useEffect(() => {
    api.getMe()
      .then((user) => setCurrentUser(user))
      .catch(() => {
        // Not logged in or expired
      });

    api.getCategories()
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  // Fetch products whenever filters change
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      if (onlyFavorites) {
        const favs = await api.getFavorites();
        setProducts(favs);
      } else {
        const data = await api.getProducts({
          q: searchQuery || undefined,
          category_id: selectedCategoryId || undefined,
          condition: conditionFilter,
          sort_by: sortBy,
          exchange_available: exchangeOnly ? true : undefined,
          max_price: maxPriceFilter,
        });
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategoryId, conditionFilter, sortBy, exchangeOnly, maxPriceFilter, onlyFavorites]);

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  const handleSearchFromHero = (query: string, condition?: string, maxPrice?: number) => {
    setSearchQuery(query);
    if (condition) setConditionFilter(condition);
    if (maxPrice) setMaxPriceFilter(maxPrice);
    setOnlyFavorites(false);
  };

  const handleStartChat = (sellerId: number, productId: number) => {
    setChatSellerId(sellerId);
    setChatProductId(productId);
    setSelectedProduct(null);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Global Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenSell={() => setIsSellOpen(true)}
        onOpenAiValuation={() => setIsAiValuationOpen(true)}
        onOpenOffers={() => setIsOffersOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenFavorites={() => setOnlyFavorites((prev) => !prev)}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          setOnlyFavorites(false);
        }}
        activeFilter={conditionFilter}
      />

      {/* Hero Section */}
      <Hero
        onSearch={handleSearchFromHero}
        onOpenAiValuation={() => setIsAiValuationOpen(true)}
        onOpenSell={() => setIsSellOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filter and Sorting Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>{onlyFavorites ? 'Your Saved Items' : selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name : 'Featured Listings'}</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            </h2>

            {onlyFavorites && (
              <button
                onClick={() => setOnlyFavorites(false)}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                View all items
              </button>
            )}
          </div>

          {/* Condition & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            
            {/* Condition Pills */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
              {['All', 'Brand New', 'Like New', 'Good'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setConditionFilter(cond)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    conditionFilter === cond
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>

            {/* Exchange Filter Toggle */}
            <button
              onClick={() => setExchangeOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer font-medium ${
                exchangeOnly
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Exchange Available</span>
            </button>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="newest">Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Refresh */}
            <button
              onClick={fetchProducts}
              title="Refresh Listings"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

          </div>

        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl glass-card h-80 animate-pulse bg-slate-900/40" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-slate-800/80 bg-slate-900/30">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No matching items found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              We couldn't find items matching your search or filters. Try adjusting your keywords or clearing active filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId(null);
                setConditionFilter('All');
                setExchangeOnly(false);
                setMaxPriceFilter(undefined);
                setOnlyFavorites(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
                onToggleFavorite={() => {
                  if (onlyFavorites) fetchProducts();
                }}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base text-white">ReMarket AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              India's transparent second-hand AI marketplace. Real-time condition grading, peer escrow, and instant valuations.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">AI Safety & Trust</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Phone & ID Verification</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Fair Price Quantile Guarantees</li>
              <li className="flex items-center gap-1.5"><ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" /> Peer Escrow Trade Protection</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Popular Hubs</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Bengaluru • Indiranagar & Koramangala</li>
              <li>Whitefield Tech Corridor</li>
              <li>HSR Layout & Electronic City</li>
              <li>Mumbai & Delhi NCR Hubs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">API Engine Status</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>FastAPI Service</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database</span>
                <span className="text-emerald-400 font-bold">SQLite Seeded</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Price Oracle</span>
                <span className="text-indigo-400 font-bold">Active (v1.0)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ReMarket AI. Built for seamless peer-to-peer commerce.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Escrow Guidelines</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onStartChat={handleStartChat}
        onOfferSuccess={() => {
          fetchProducts();
          setIsOffersOpen(true);
        }}
      />

      <SellModal
        isOpen={isSellOpen}
        onClose={() => setIsSellOpen(false)}
        categories={categories}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onProductCreated={fetchProducts}
      />

      <AiValuationModal
        isOpen={isAiValuationOpen}
        onClose={() => setIsAiValuationOpen(false)}
      />

      <OffersDrawer
        isOpen={isOffersOpen}
        onClose={() => setIsOffersOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatSellerId(null);
          setChatProductId(null);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        initialSellerId={chatSellerId}
        initialProductId={chatProductId}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          fetchProducts();
        }}
      />

    </div>
  );
}

export default App;
