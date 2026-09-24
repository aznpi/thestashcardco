import React, { useState } from 'react';
import { Sparkles, Search, Eye, Bookmark, MessageSquare, ChevronRight } from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';

export const HeroShowcase: React.FC = () => {
  const { 
    cards, 
    setInspectingCard, 
    setIsAISearchOpen, 
    searchQuery, 
    setSearchQuery,
    openChatForCard,
    toggleSaveOffline,
    isCardSaved,
    setSelectedFormat,
  } = useCardStore();

  const [selectedSpotlightId, setSelectedSpotlightId] = useState<string>('card-gretzky-1979');

  const hockeyCards = cards.filter(c => c.sport === 'Hockey');
  const featuredCard = cards.find(c => c.id === selectedSpotlightId) || hockeyCards[0] || cards[0];

  const handleQuickSearch = (queryText: string) => {
    setSearchQuery(queryText);
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectFormat = (fmt: 'All' | 'graded' | 'raw' | 'bulk_lot' | 'complete_set') => {
    setSelectedFormat(fmt);
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-18 border-b border-slate-200 dark:border-slate-800/60 bg-gradient-to-b from-slate-50/50 to-white dark:from-[#0b0f17] dark:to-[#0f1523]">
      {/* Subtle background ambient ice glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-r from-cyan-500/10 via-amber-500/5 to-blue-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Value Proposition & Natural Language Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Primary Showcase · Certified Hockey Grails</span>
              <span className="text-cyan-400/50">·</span>
              <span className="text-slate-600 dark:text-slate-400 font-normal">theStashCardCo</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] font-display text-balance">
              The Stash Card Company. Slabs, Raw Singles, Bulk Lots & Sets.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              An exclusively curated personal collection featuring certified graded slabs, unslabbed raw singles in one-touch UV cases, 50-100 card bulk builder lots, and complete vintage sets — showcasing blue-chip hockey cards at the forefront. Secured with Square credit card processing and bank-grade escrow.
            </p>

            {/* Collection Format Quick Selectors */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Browse:</span>
              <button
                onClick={() => handleSelectFormat('graded')}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>🛡️ Graded Slabs</span>
              </button>
              <button
                onClick={() => handleSelectFormat('raw')}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>💎 Raw Singles</span>
              </button>
              <button
                onClick={() => handleSelectFormat('bulk_lot')}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-purple-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>📦 Bulk Singles Lots</span>
              </button>
              <button
                onClick={() => handleSelectFormat('complete_set')}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>📚 Complete Sets</span>
              </button>
            </div>

            {/* Primary Showcase Selector: Click to Switch Spotlight Hockey Card */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Primary Hockey Showcase Slabs
                </span>
                <span className="text-[11px] text-slate-400">Click to inspect slab</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hockeyCards.slice(0, 6).map((card) => {
                  const isSelected = card.id === featuredCard.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => setSelectedSpotlightId(card.id)}
                      className={`p-2 rounded-xl text-left transition-all border cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-amber-500/30'
                          : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <img 
                        src={card.frontImage} 
                        alt={card.player} 
                        className="w-8 h-11 object-cover rounded bg-slate-950 shrink-0 border border-slate-700/30"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate leading-tight">{card.player}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{card.year} · {card.grade}</p>
                        <p className="text-[11px] font-mono-nums font-bold text-amber-600 dark:text-amber-400">${card.price.toLocaleString()}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI-Powered Semantic Search Input Box */}
            <div className="pt-2">
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl shadow-sm focus-within:border-amber-500 dark:focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all p-1.5 max-w-xl">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hockey cards, players, certs (e.g. Wayne Gretzky 1979 PSA 9)..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
                <button
                  onClick={() => setIsAISearchOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">AI Match</span>
                </button>
              </div>

              {/* Natural Query Suggestions Focused on Hockey */}
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">Quick explore:</span>
                <button 
                  onClick={() => handleQuickSearch('Wayne Gretzky')}
                  className="hover:text-amber-500 hover:underline cursor-pointer"
                >
                  Wayne Gretzky O-Pee-Chee
                </button>
                <span>·</span>
                <button 
                  onClick={() => handleQuickSearch('Connor McDavid')}
                  className="hover:text-amber-500 hover:underline cursor-pointer"
                >
                  Connor McDavid The Cup RPA
                </button>
                <span>·</span>
                <button 
                  onClick={() => handleQuickSearch('Connor Bedard')}
                  className="hover:text-amber-500 hover:underline cursor-pointer"
                >
                  Connor Bedard High Gloss /10
                </button>
                <span>·</span>
                <button 
                  onClick={() => handleQuickSearch('Mario Lemieux')}
                  className="hover:text-amber-500 hover:underline cursor-pointer"
                >
                  Mario Lemieux PSA 9
                </button>
                <span>·</span>
                <button 
                  onClick={() => handleQuickSearch('Alex Ovechkin')}
                  className="hover:text-amber-500 hover:underline cursor-pointer"
                >
                  Alex Ovechkin Young Guns
                </button>
              </div>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800/80 max-w-xl">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono-nums text-slate-900 dark:text-white">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cert Verified Slabs</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono-nums text-slate-900 dark:text-white">Square</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Credit Card Checkout</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono-nums text-slate-900 dark:text-white">24h</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Insured Dispatch</p>
              </div>
            </div>

          </div>

          {/* Right Column: Spotlight Collector Slab Card with 3D Refractor Glow */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              
              {/* Outer decorative backing */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-amber-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
              
              {/* The Graded Slab Physical Display */}
              <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl transition-all duration-300">
                
                {/* Slab Header (PSA / BGS Authenticity Badge) */}
                <div className={`${featuredCard.grader === 'BGS' ? 'bg-amber-600/95' : 'bg-red-700/95'} text-white p-3 rounded-lg flex items-center justify-between mb-4 shadow-inner`}>
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase block">{featuredCard.grader} CERTIFIED SLAB</span>
                    <span className="text-xs font-semibold">{featuredCard.year} {featuredCard.set}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black tracking-tight block">{featuredCard.grade}</span>
                    <span className="text-[10px] font-mono-nums opacity-85 block">#{featuredCard.certNumber}</span>
                  </div>
                </div>

                {/* Slab Glass Window with Card Image and Holographic Refractor Sheen */}
                <div 
                  onClick={() => setInspectingCard(featuredCard)}
                  className="relative aspect-[3/4] bg-slate-950 rounded-xl overflow-hidden cursor-pointer hologram-refractor border border-slate-700/40 shadow-inner group/card"
                >
                  <img
                    src={featuredCard.frontImage}
                    alt={`${featuredCard.player} ${featuredCard.year} ${featuredCard.set}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay Quick Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end p-4">
                    <div className="w-full flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        Click for 4K Slab Zoom & Details
                      </span>
                      <span className="font-mono-nums font-semibold">${featuredCard.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Title & Quick Metadata */}
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        {featuredCard.sport} Showcase
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {featuredCard.player}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {featuredCard.team} · #{featuredCard.cardNumber} · Pop {featuredCard.popReport}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono-nums text-slate-900 dark:text-amber-400">
                      ${featuredCard.price.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Est. Mkt: ${featuredCard.estimatedMarketValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons on Spotlight Card */}
                <div className="pt-4 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setInspectingCard(featuredCard)}
                    className="col-span-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => openChatForCard(featuredCard)}
                    className="col-span-1 py-2 px-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Offer</span>
                  </button>

                  <button
                    onClick={() => toggleSaveOffline(featuredCard.id)}
                    className={`col-span-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isCardSaved(featuredCard.id)
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isCardSaved(featuredCard.id) ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
