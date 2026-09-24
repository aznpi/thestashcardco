import React, { useState } from 'react';
import { Sparkles, Search, X, ArrowRight, TrendingUp, History, Eye, ShoppingBag } from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';
import { SportsCard } from '../types/card';

export const AISearchModal: React.FC = () => {
  const {
    isAISearchOpen,
    setIsAISearchOpen,
    cards,
    browsingHistory,
    setInspectingCard,
    addToCart,
  } = useCardStore();

  const [promptQuery, setPromptQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    summary: string;
    matchedCardIds: string[];
    highlightAspect?: string;
    smartInsight?: string;
  } | null>(null);

  if (!isAISearchOpen) return null;

  // History cards
  const historyCards = cards.filter(c => browsingHistory.includes(c.id));

  const promptSuggestions = [
    'Investment-grade hockey grails (Gretzky, McDavid, Bedard)',
    'High Gloss Young Guns and True Gem BGS 9.5 hockey slabs',
    'Vintage Hall of Fame O-Pee-Chee hockey rookies',
    'Autographed patch cards (RPA) with 10 auto grade',
  ];

  const handleRunAISearch = async (queryText?: string) => {
    const q = queryText || promptQuery;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/search-and-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          browsingHistory: historyCards.map(c => `${c.year} ${c.player} ${c.grade}`),
          availableCards: cards,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      console.error(e);
      // Fallback matching logic
      const lower = q.toLowerCase();
      const matched = cards.filter(c => 
        c.player.toLowerCase().includes(lower) ||
        c.sport.toLowerCase().includes(lower) ||
        (lower.includes('auto') && c.isAuto) ||
        (lower.includes('rookie') && c.isRookie) ||
        (lower.includes('vintage') && c.year < 1990)
      ).map(c => c.id);

      setAiResult({
        summary: `Curated cards based on your search for "${q}" and recent portfolio activity.`,
        matchedCardIds: matched.length > 0 ? matched : [cards[0].id, cards[1].id],
        highlightAspect: 'Investment Grade Registry Match',
        smartInsight: 'Focusing on high subgrades and authentic on-card autographs provides the best liquidity.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const matchedCards = aiResult?.matchedCardIds
    ? cards.filter(c => aiResult.matchedCardIds.includes(c.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Numismatic & Sports Card Discovery</span>
          </div>

          <button
            onClick={() => setIsAISearchOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Query Bar */}
          <div>
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-1.5 shadow-sm focus-within:border-amber-500">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={promptQuery}
                onChange={(e) => setPromptQuery(e.target.value)}
                placeholder="Ask in natural language (e.g. Find me graded vintage baseball cards under $50k)..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleRunAISearch()}
              />
              <button
                onClick={() => handleRunAISearch()}
                disabled={isLoading || !promptQuery.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>

            {/* Quick Inspiration Prompts */}
            <div className="flex flex-wrap gap-2 pt-3">
              {promptSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPromptQuery(suggestion);
                    handleRunAISearch(suggestion);
                  }}
                  className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* AI Result Section */}
          {aiResult && (
            <div className="p-5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    <span>AI Recommendation Analysis</span>
                    {aiResult.highlightAspect && (
                      <>
                        <span>·</span>
                        <span>{aiResult.highlightAspect}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                    {aiResult.summary}
                  </p>
                </div>
              </div>

              {aiResult.smartInsight && (
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-amber-500/10">
                  <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Collector Market Tip:</strong> {aiResult.smartInsight}</span>
                </div>
              )}

              {/* Matched Cards */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Matched Vault Cards ({matchedCards.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchedCards.map(card => (
                    <div
                      key={card.id}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-500 transition-colors"
                    >
                      <img
                        src={card.frontImage}
                        alt={card.player}
                        className="w-14 h-18 object-cover rounded-lg bg-slate-950 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-mono-nums text-amber-600 dark:text-amber-400 font-bold">
                          {card.grader} {card.numericGrade} · {card.year}
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {card.player}
                        </h5>
                        <div className="text-xs font-mono-nums font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                          ${card.price.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setInspectingCard(card);
                          setIsAISearchOpen(false);
                        }}
                        className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-black rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Personalized Recommendations based on Browsing History */}
          {historyCards.length > 0 && !aiResult && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <History className="w-3.5 h-3.5" />
                <span>Personalized Based on Your Viewed Cards</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {historyCards.slice(0, 4).map(card => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setInspectingCard(card);
                      setIsAISearchOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-amber-500 transition-colors cursor-pointer"
                  >
                    <img
                      src={card.frontImage}
                      alt={card.player}
                      className="w-12 h-16 object-cover rounded-lg bg-slate-950 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-mono-nums">{card.grader} {card.numericGrade}</span>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {card.player}
                      </h5>
                      <span className="text-xs font-mono-nums font-semibold text-amber-600 dark:text-amber-400">
                        ${card.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
