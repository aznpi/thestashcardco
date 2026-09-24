import React from 'react';
import { Eye, Bookmark, MessageSquare, ShoppingBag, ShieldCheck, Sparkles, Bell } from 'lucide-react';
import { SportsCard } from '../types/card';
import { useCardStore } from '../context/CardStoreContext';

interface CardItemProps {
  card: SportsCard;
}

export const CardItem: React.FC<CardItemProps> = ({ card }) => {
  const {
    setInspectingCard,
    openChatForCard,
    toggleSaveOffline,
    isCardSaved,
    addToCart,
    cart,
    setCardAlert,
    hasCardAlert,
  } = useCardStore();

  const isSaved = isCardSaved(card.id);
  const inCart = cart.some(i => i.card.id === card.id);
  const isAlertSet = hasCardAlert(card.id);

  // Format type resolution: graded, raw, bulk_lot, complete_set
  const format = card.listingFormat || (card.grader === 'Raw' ? 'raw' : card.grader === 'None' ? 'bulk_lot' : 'graded');

  // Grader badge accent color
  const graderAccentColor =
    card.grader === 'PSA' ? 'border-red-600/40 text-red-600 dark:text-red-400' :
    card.grader === 'BGS' ? 'border-amber-600/40 text-amber-600 dark:text-amber-400' :
    card.grader === 'SGC' ? 'border-slate-600/40 text-slate-800 dark:text-slate-300' :
    'border-blue-600/40 text-blue-600 dark:text-blue-400';

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* Dynamic Header Bar by Format (Graded Slab, Raw Single, Bulk Lot, Complete Set) */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/60 dark:bg-slate-950/40">
        {format === 'graded' ? (
          <>
            <div className="flex items-center gap-1.5 font-bold tracking-tight">
              <span className={`px-1.5 py-0.5 border rounded text-[10px] uppercase font-mono-nums ${graderAccentColor}`}>
                {card.grader} {card.numericGrade}
              </span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {card.grade}
              </span>
            </div>
            <div className="text-[11px] font-mono-nums text-slate-400 dark:text-slate-500">
              Cert #{card.certNumber}
            </div>
          </>
        ) : format === 'raw' ? (
          <>
            <div className="flex items-center gap-1.5 font-bold tracking-tight">
              <span className="px-1.5 py-0.5 border rounded text-[10px] uppercase font-mono-nums border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                RAW SINGLE
              </span>
              <span className="text-slate-700 dark:text-slate-300 truncate text-[11px]">
                {card.rawCondition || 'NM-MT'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
              {card.holderType || 'One-Touch UV'}
            </div>
          </>
        ) : format === 'bulk_lot' ? (
          <>
            <div className="flex items-center gap-1.5 font-bold tracking-tight">
              <span className="px-1.5 py-0.5 border rounded text-[10px] uppercase font-mono-nums border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10">
                BULK SINGLES LOT
              </span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                {card.lotCount || 50} Cards
              </span>
            </div>
            <div className="text-[11px] font-mono-nums text-purple-600 dark:text-purple-400 font-semibold">
              ${card.perCardPrice ? `$${card.perCardPrice.toFixed(2)}/ea` : 'Curated'}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 font-bold tracking-tight">
              <span className="px-1.5 py-0.5 border rounded text-[10px] uppercase font-mono-nums border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                COMPLETE SET
              </span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                {card.setDetails?.totalCards || 396} Cards
              </span>
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              {card.setDetails?.isFactorySealed ? 'Factory Sealed' : 'Hand Collated'}
            </div>
          </>
        )}
      </div>

      {/* Card Image Display with Refractor Holographic Coating */}
      <div 
        onClick={() => setInspectingCard(card)}
        className="relative aspect-[3/4] bg-slate-950 overflow-hidden cursor-pointer hologram-refractor"
      >
        <img
          src={card.frontImage}
          alt={`${card.year} ${card.set} ${card.player}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover Quick Overlay Actions */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setInspectingCard(card);
            }}
            className="p-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-900 dark:text-white rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            title="Inspect Card Details & 4K Slab View"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openChatForCard(card);
            }}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            title="Make Direct Offer / Chat with Seller"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveOffline(card.id);
            }}
            className={`p-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer ${
              isSaved
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white hover:bg-white'
            }`}
            title={isSaved ? "Saved in Offline Binder" : "Save for Offline Access"}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Format & Showcase Badges */}
        {card.sport === 'Hockey' && format === 'graded' && card.status === 'available' && (
          <div className="absolute top-3 left-3 bg-cyan-950/85 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            Primary Showcase · Slab
          </div>
        )}

        {format === 'raw' && card.status === 'available' && (
          <div className="absolute top-3 left-3 bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            Raw Single · One-Touch UV
          </div>
        )}

        {format === 'bulk_lot' && card.status === 'available' && (
          <div className="absolute top-3 left-3 bg-purple-950/85 backdrop-blur-md text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            Bulk Singles · {card.lotCount} Cards
          </div>
        )}

        {format === 'complete_set' && card.status === 'available' && (
          <div className="absolute top-3 left-3 bg-amber-950/85 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded shadow">
            Complete Set · {card.setDetails?.totalCards} Cards
          </div>
        )}

        {/* Status ribbon if not available */}
        {card.status !== 'available' && (
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded">
            {card.status === 'in_vault' ? 'Vault Archive' : card.status === 'reserved' ? 'Reserved' : 'Sold'}
          </div>
        )}

        {/* Subtle Alert Badge if active */}
        {isAlertSet && (
          <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 p-1 rounded-full shadow" title="Price alert active">
            <Bell className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Card Metadata & Purchase Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        
        {/* Unboxed Metadata Line (Strict Anti-Pill Discipline) */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
          <span>{card.year}</span>
          <span aria-hidden="true">·</span>
          <span>{card.sport}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {format === 'graded' ? 'Graded Slab' : format === 'raw' ? 'Raw Single' : format === 'bulk_lot' ? 'Bulk Singles Lot' : 'Complete Set'}
          </span>
          {card.isRookie && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">True RC</span>
            </>
          )}
          {card.isAuto && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Autograph</span>
            </>
          )}
          {card.serialNumber && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono-nums">{card.serialNumber}</span>
            </>
          )}
        </div>

        {/* Card Title & Set */}
        <div>
          <h4 
            onClick={() => setInspectingCard(card)}
            className="text-base font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {card.player}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {card.set} #{card.cardNumber}
          </p>
        </div>

        {/* Subgrades snippet if available (BGS) */}
        {card.subgrades && (
          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono-nums bg-slate-50 dark:bg-slate-950/60 p-1.5 rounded border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <div>Cent: {card.subgrades.centering}</div>
            <div>Corn: {card.subgrades.corners}</div>
            <div>Edge: {card.subgrades.edges}</div>
            <div>Surf: {card.subgrades.surface}</div>
          </div>
        )}

        {/* Set Highlights snippet if Complete Set */}
        {card.setDetails?.keyHighlights && card.setDetails.keyHighlights.length > 0 && (
          <div className="text-[11px] bg-amber-500/5 border border-amber-500/20 rounded p-1.5 text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-amber-600 dark:text-amber-400">Key Rookies: </span>
            {card.setDetails.keyHighlights.slice(0, 3).join(', ')}...
          </div>
        )}

        {/* Price and Cart Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
          <div>
            <div className="text-lg font-bold font-mono-nums text-slate-900 dark:text-amber-400">
              ${card.price.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {format === 'bulk_lot'
                ? `${card.lotCount} cards · $${card.perCardPrice?.toFixed(2)}/card`
                : format === 'complete_set'
                ? `Complete Set (${card.setDetails?.totalCards} Cards)`
                : format === 'raw'
                ? `Raw Single (${card.rawCondition || 'NM-MT'})`
                : `Pop: ${card.popReport} in grade`}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openChatForCard(card)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Negotiate Price"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {card.status === 'available' ? (
              <button
                onClick={() => addToCart(card)}
                disabled={inCart}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  inCart
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 shadow-sm'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{inCart ? 'In Bag' : 'Buy'}</span>
              </button>
            ) : (
              <button
                onClick={() => openChatForCard(card)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Inquire
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
