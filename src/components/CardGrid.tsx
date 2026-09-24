import React from 'react';
import { Filter, SlidersHorizontal, Sparkles, X, RotateCcw, Boxes } from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';
import { CardItem } from './CardItem';

export const CardGrid: React.FC = () => {
  const {
    cards,
    filteredCards,
    searchQuery,
    setSearchQuery,
    selectedSport,
    setSelectedSport,
    selectedFormat,
    setSelectedFormat,
    selectedGrader,
    setSelectedGrader,
    filterRookieOnly,
    setFilterRookieOnly,
    filterAutoOnly,
    setFilterAutoOnly,
    filterNumberedOnly,
    setFilterNumberedOnly,
    sortBy,
    setSortBy,
    setIsAISearchOpen,
    setIsInventoryOpen,
  } = useCardStore();

  const formats: { id: 'All' | 'graded' | 'raw' | 'bulk_lot' | 'complete_set'; label: string }[] = [
    { id: 'All', label: 'All Formats' },
    { id: 'graded', label: 'Graded Slabs' },
    { id: 'raw', label: 'Raw Singles' },
    { id: 'bulk_lot', label: 'Bulk Singles & Lots' },
    { id: 'complete_set', label: 'Complete Sets' },
  ];

  const getFormatCount = (fmt: 'All' | 'graded' | 'raw' | 'bulk_lot' | 'complete_set') => {
    if (fmt === 'All') return cards.length;
    return cards.filter(c => {
      const f = c.listingFormat || (c.grader === 'Raw' ? 'raw' : c.grader === 'None' ? 'bulk_lot' : 'graded');
      return f === fmt;
    }).length;
  };

  const sports = ['All', 'Hockey', 'Basketball', 'Baseball', 'Football'];
  const graders = ['All', 'PSA', 'BGS', 'SGC'];

  const resetFilters = () => {
    setSelectedFormat('All');
    setSelectedSport('All');
    setSelectedGrader('All');
    setFilterRookieOnly(false);
    setFilterAutoOnly(false);
    setFilterNumberedOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters = 
    selectedFormat !== 'All' ||
    selectedSport !== 'All' || 
    selectedGrader !== 'All' || 
    filterRookieOnly || 
    filterAutoOnly || 
    filterNumberedOnly || 
    searchQuery.trim().length > 0;

  return (
    <section id="collection" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <span>The Stash Collection</span>
            <span className="text-slate-400">·</span>
            <span>Vault Registry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 font-display">
            Cards, Bulk Singles & Complete Sets
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Displaying {filteredCards.length} certified slabs, raw singles, bulk lots, and complete sets
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setIsInventoryOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700/80 transition-all cursor-pointer shadow-sm"
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Inventory Suite & P&L</span>
          </button>
          <button
            onClick={() => setIsAISearchOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Card Discovery</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 mb-8 space-y-4">
        
        {/* Row 1: Format Categories (Graded, Raw, Bulk Lots, Complete Sets) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800/80 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 mr-1">
            Type:
          </span>
          {formats.map(fmt => {
            const count = getFormatCount(fmt.id);
            const isSelected = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <span>{fmt.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono-nums ${
                  isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Sport Segments & Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Sport Segmented Control (Allowed Interactive Buttons) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {sports.map(sport => {
              const isHockey = sport === 'Hockey';
              const isSelected = selectedSport === sport;
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
                      : isHockey
                      ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {isHockey && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                  <span>{sport === 'All' ? 'All Sports' : sport === 'Hockey' ? 'Hockey (Primary Showcase)' : sport}</span>
                </button>
              );
            })}
          </div>

          {/* Grader Filter & Sort Select */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {/* Grader selection */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400 dark:text-slate-500 px-2 font-medium">Grader:</span>
              {graders.map(grader => (
                <button
                  key={grader}
                  onClick={() => setSelectedGrader(grader)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer font-semibold ${
                    selectedGrader === grader
                      ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {grader}
                </button>
              ))}
            </div>

            {/* Sort select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="year-asc">Year: Oldest Vintage</option>
              <option value="pop-asc">Scarcity: Low Pop</option>
            </select>
          </div>

        </div>

        {/* Row 2: Secondary Facet Toggles & Active Filter Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Attributes:</span>

            <button
              onClick={() => setFilterRookieOnly(!filterRookieOnly)}
              className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer font-medium ${
                filterRookieOnly
                  ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              Rookie Cards (RC)
            </button>

            <button
              onClick={() => setFilterAutoOnly(!filterAutoOnly)}
              className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer font-medium ${
                filterAutoOnly
                  ? 'bg-blue-500/15 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              Autographed (AU)
            </button>

            <button
              onClick={() => setFilterNumberedOnly(!filterNumberedOnly)}
              className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer font-medium ${
                filterNumberedOnly
                  ? 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              Serial Numbered
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* Product Card Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map(card => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <Filter className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No matching cards found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or use our AI natural language search for personalized recommendations.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => setIsAISearchOpen(true)}
              className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-semibold rounded-lg hover:bg-amber-400 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Search</span>
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
