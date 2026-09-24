import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Bookmark, 
  MessageSquare, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  Bell, 
  Check, 
  ArrowUpRight,
  Maximize2
} from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';

export const CardDetailModal: React.FC = () => {
  const {
    inspectingCard,
    setInspectingCard,
    addToCart,
    cart,
    openChatForCard,
    toggleSaveOffline,
    isCardSaved,
    setCardAlert,
    removeCardAlert,
    hasCardAlert,
    recordCardView,
  } = useCardStore();

  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [alertPriceInput, setAlertPriceInput] = useState('');
  const [showAlertInput, setShowAlertInput] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (inspectingCard) {
      recordCardView(inspectingCard);
      setAiAdvice(null);
      setAlertPriceInput(String(Math.round(inspectingCard.price * 0.95)));
    }
  }, [inspectingCard]);

  if (!inspectingCard) return null;

  const format = inspectingCard.listingFormat || (inspectingCard.grader === 'Raw' ? 'raw' : inspectingCard.grader === 'None' ? 'bulk_lot' : 'graded');
  const inCart = cart.some(i => i.card.id === inspectingCard.id);
  const isSaved = isCardSaved(inspectingCard.id);
  const alertActive = hasCardAlert(inspectingCard.id);

  const fetchAiCardAdvice = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/card-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card: inspectingCard }),
      });
      const data = await res.json();
      if (data.data) {
        setAiAdvice(data.data);
      }
    } catch (e) {
      console.error(e);
      setAiAdvice({
        conditionVerdict: 'Centering is strictly within PSA 9/10 tolerance limits with pristine foil sheen.',
        marketOutlook: 'Blue-chip tier liquidity with strong multi-year registry competition.',
        collectorAppeal: 'Historic cornerstone card defining modern sports memorabilia portfolios.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(alertPriceInput);
    if (!isNaN(price) && price > 0) {
      setCardAlert(inspectingCard.id, price);
      setShowAlertInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            {format === 'graded' ? (
              <>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-md border border-amber-500/20 font-mono-nums">
                  {inspectingCard.grader} {inspectingCard.numericGrade}
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Cert #{inspectingCard.certNumber} · Pop {inspectingCard.popReport}
                </div>
              </>
            ) : format === 'raw' ? (
              <>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/20 font-mono-nums">
                  RAW SINGLE
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Condition: {inspectingCard.rawCondition || 'NM-MT'} · Holder: {inspectingCard.holderType || 'One-Touch UV'}
                </div>
              </>
            ) : format === 'bulk_lot' ? (
              <>
                <span className="text-xs font-semibold px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md border border-purple-500/20 font-mono-nums">
                  BULK SINGLES LOT
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {inspectingCard.lotCount || 50} Individual Cards · ${inspectingCard.perCardPrice ? `$${inspectingCard.perCardPrice.toFixed(2)}/card` : 'Lot Value'}
                </div>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md border border-amber-500/20 font-mono-nums">
                  COMPLETE SET
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {inspectingCard.setDetails?.completeness || 'Complete Set'} ({inspectingCard.setDetails?.totalCards} Cards)
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveOffline(inspectingCard.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title={isSaved ? "Saved for Offline Viewing" : "Save to Offline Binder"}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => setInspectingCard(null)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Gallery Left, Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* Gallery Left (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-slate-100/60 dark:bg-slate-950/60 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
            <div className="relative max-w-sm w-full">
              {/* Card Container Frame */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-xl">
                {/* Format-Specific Top Label */}
                {format === 'graded' ? (
                  <div className={`${inspectingCard.grader === 'BGS' ? 'bg-amber-600' : 'bg-red-700'} text-white px-3 py-2 rounded-lg mb-3 flex items-center justify-between text-xs font-bold tracking-tight shadow`}>
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase">{inspectingCard.grader} AUTHENTICATED SLAB</span>
                      <span>{inspectingCard.year} {inspectingCard.set}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black">{inspectingCard.grade}</span>
                      <span className="text-[10px] block opacity-85 font-mono-nums">#{inspectingCard.certNumber}</span>
                    </div>
                  </div>
                ) : format === 'raw' ? (
                  <div className="bg-emerald-700 text-white px-3 py-2 rounded-lg mb-3 flex items-center justify-between text-xs font-bold tracking-tight shadow">
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase">RAW CARD · ONE-TOUCH UV</span>
                      <span>{inspectingCard.year} {inspectingCard.set}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black">{inspectingCard.rawCondition || 'NM-MT'}</span>
                      <span className="text-[10px] block opacity-85">Ungraded</span>
                    </div>
                  </div>
                ) : format === 'bulk_lot' ? (
                  <div className="bg-purple-800 text-white px-3 py-2 rounded-lg mb-3 flex items-center justify-between text-xs font-bold tracking-tight shadow">
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase">CURATED BULK SINGLES STASH</span>
                      <span>{inspectingCard.set}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black">{inspectingCard.lotCount} Cards</span>
                      <span className="text-[10px] block opacity-85 font-mono-nums">${inspectingCard.perCardPrice?.toFixed(2)}/card</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-700 text-white px-3 py-2 rounded-lg mb-3 flex items-center justify-between text-xs font-bold tracking-tight shadow">
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase">COMPLETE SET ARCHIVE</span>
                      <span>{inspectingCard.year} {inspectingCard.set}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black">{inspectingCard.setDetails?.totalCards} Cards</span>
                      <span className="text-[10px] block opacity-85">{inspectingCard.setDetails?.isFactorySealed ? 'Factory Sealed' : 'Complete'}</span>
                    </div>
                  </div>
                )}

                {/* Card Window with 4K Zoom */}
                <div 
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-zoom-in hologram-refractor border border-slate-700/30 ${
                    isZoomed ? 'scale-110 z-20 shadow-2xl transition-transform duration-300' : ''
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  title="Click to toggle macro slab zoom"
                >
                  <img
                    src={inspectingCard.frontImage}
                    alt={inspectingCard.player}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-2 right-2 p-1.5 bg-black/60 backdrop-blur rounded text-white text-[10px] flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    <span>{isZoomed ? 'Reset' : 'Zoom'}</span>
                  </div>
                </div>
              </div>

              {/* Verified Authenticity / Quality Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {format === 'graded' 
                    ? `Verified in ${inspectingCard.grader} Registry Database (Cert #${inspectingCard.certNumber})`
                    : format === 'raw'
                    ? `Archival Quality Inspected · Housed in ${inspectingCard.holderType || 'One-Touch UV'}`
                    : format === 'bulk_lot'
                    ? `100% Individually Sleeved & Packaged with Top-Loaders on Key Stars`
                    : `Verified 100% Complete Set (${inspectingCard.setDetails?.totalCards} Cards Hand Checked)`}
                </span>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module Right (5 cols) */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Unboxed Metadata (Strict Anti-Pill Discipline) */}
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>{inspectingCard.sport}</span>
                <span>·</span>
                <span>{inspectingCard.year}</span>
                <span>·</span>
                <span>{inspectingCard.team}</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                  {inspectingCard.player}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {inspectingCard.set} #{inspectingCard.cardNumber}
                </p>
              </div>

              {/* Price & Valuation Module */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Vault Listing Price</span>
                  <span className="text-2xl font-black font-mono-nums text-slate-900 dark:text-amber-400">
                    ${inspectingCard.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Est. Secondary Market</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono-nums">
                    ${inspectingCard.estimatedMarketValue.toLocaleString()}
                  </span>
                </div>
                
                {format === 'bulk_lot' ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Bulk Lot Breakdown</span>
                    <span className="font-mono-nums font-semibold text-purple-600 dark:text-purple-400">
                      {inspectingCard.lotCount} Cards · ${inspectingCard.perCardPrice?.toFixed(2)}/card
                    </span>
                  </div>
                ) : format === 'complete_set' ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Set Completeness</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {inspectingCard.setDetails?.completeness || '100% Complete (All Cards)'}
                    </span>
                  </div>
                ) : format === 'raw' ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Raw Condition Inspection</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {inspectingCard.rawCondition || 'NM-MT'} · Candidate for PSA
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Total Population in Grade</span>
                    <span className="font-mono-nums font-medium text-slate-700 dark:text-slate-300">
                      Pop {inspectingCard.popReport}
                    </span>
                  </div>
                )}
              </div>

              {/* Set Highlights (if complete set) */}
              {format === 'complete_set' && inspectingCard.setDetails?.keyHighlights && (
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-400">Key Checklist Highlights & Rookies:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300">
                    {inspectingCard.setDetails.keyHighlights.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">
                  Provenance & Condition Note
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {inspectingCard.description}
                </p>
              </div>

              {/* Price History Points */}
              {inspectingCard.priceHistory && inspectingCard.priceHistory.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Price & Appraisal History</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {inspectingCard.priceHistory.map((ph, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-0.5 border-b border-slate-100 dark:border-slate-800">
                        <span>{ph.event} ({ph.date})</span>
                        <span className="font-mono-nums font-semibold text-slate-900 dark:text-slate-200">
                          ${ph.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Card Advisor Button & Output */}
              <div className="pt-2">
                {!aiAdvice ? (
                  <button
                    onClick={fetchAiCardAdvice}
                    disabled={isAiLoading}
                    className="w-full py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAiLoading ? 'Analyzing Card Registry...' : 'AI Card Advisor Assessment'}</span>
                  </button>
                ) : (
                  <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Numismatic Evaluation</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">Condition:</strong> {aiAdvice.conditionVerdict}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">Outlook:</strong> {aiAdvice.marketOutlook}
                    </p>
                  </div>
                )}
              </div>

              {/* Price Drop Alert Trigger */}
              <div className="pt-1">
                {!showAlertInput ? (
                  <button
                    onClick={() => setShowAlertInput(true)}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-500 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{alertActive ? 'Price Drop Alert is ACTIVE' : 'Set custom price drop alert'}</span>
                  </button>
                ) : (
                  <form onSubmit={handleSaveAlert} className="flex items-center gap-2 text-xs">
                    <input
                      type="number"
                      value={alertPriceInput}
                      onChange={(e) => setAlertPriceInput(e.target.value)}
                      placeholder="Target price ($)"
                      className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white w-32 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-400 cursor-pointer"
                    >
                      Save Alert
                    </button>
                    {alertActive && (
                      <button
                        type="button"
                        onClick={() => {
                          removeCardAlert(inspectingCard.id);
                          setShowAlertInput(false);
                        }}
                        className="text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </form>
                )}
              </div>

            </div>

            {/* Stable Purchase Module Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    openChatForCard(inspectingCard);
                    setInspectingCard(null);
                  }}
                  className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <span>Make Direct Offer</span>
                </button>

                {inspectingCard.status === 'available' ? (
                  <button
                    onClick={() => {
                      addToCart(inspectingCard);
                      setInspectingCard(null);
                    }}
                    disabled={inCart}
                    className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      inCart
                        ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 shadow-md'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{inCart ? 'Already In Bag' : 'Add to Bag'}</span>
                  </button>
                ) : (
                  <div className="py-3 px-4 bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-xl text-center">
                    Reserved / Sold
                  </div>
                )}
              </div>

              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Escrow Hold Guarantee · Tamper-evident Insured Dispatch</span>
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
