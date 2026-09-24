import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Boxes, 
  ShieldCheck, 
  Edit2, 
  Check, 
  AlertCircle,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';
import { SportsCard, Sport, Grader, CardStatus } from '../types/card';

export const InventoryManagerModal: React.FC = () => {
  const {
    isInventoryOpen,
    setIsInventoryOpen,
    cards,
    addNewCard,
    updateCardPrice,
    updateCardStatus,
  } = useCardStore();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');

  // Form state for adding new card
  const [newFormat, setNewFormat] = useState<'graded' | 'raw' | 'bulk_lot' | 'complete_set'>('graded');
  const [newPlayer, setNewPlayer] = useState('');
  const [newTeam, setNewTeam] = useState('');
  const [newSport, setNewSport] = useState<Sport>('Hockey');
  const [newYear, setNewYear] = useState<number>(2023);
  const [newSet, setNewSet] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newGrader, setNewGrader] = useState<Grader>('PSA');
  const [newGrade, setNewGrade] = useState('10 GEM MT');
  const [newNumericGrade, setNewNumericGrade] = useState<number>(10);
  const [newRawCondition, setNewRawCondition] = useState('NM-MT 8.5+');
  const [newHolderType, setNewHolderType] = useState('Ultra-Pro Magnetic One-Touch UV');
  const [newLotCount, setNewLotCount] = useState<number>(50);
  const [newPerCardPrice, setNewPerCardPrice] = useState<number>(6.50);
  const [newSetTotalCards, setNewSetTotalCards] = useState<number>(396);
  const [newSetIsSealed, setNewSetIsSealed] = useState(false);
  const [newCertNumber, setNewCertNumber] = useState('');
  const [newPrice, setNewPrice] = useState<number>(1200);
  const [newOriginalCost, setNewOriginalCost] = useState<number>(900);
  const [newPopReport, setNewPopReport] = useState<number>(140);
  const [newIsRookie, setNewIsRookie] = useState(true);
  const [newIsAuto, setNewIsAuto] = useState(false);
  const [newIsNumbered, setNewIsNumbered] = useState(false);
  const [newSerialNumber, setNewSerialNumber] = useState('');
  const [newDescription, setNewDescription] = useState('');

  if (!isInventoryOpen) return null;

  // Portfolio math
  const totalValuation = cards.reduce((acc, c) => acc + c.price, 0);
  const totalCostBasis = cards.reduce((acc, c) => acc + (c.originalCost || c.price * 0.75), 0);
  const totalGain = totalValuation - totalCostBasis;
  const gainPercentage = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;

  const gradedCount = cards.filter(c => !c.listingFormat || c.listingFormat === 'graded').length;
  const rawCount = cards.filter(c => c.listingFormat === 'raw' || c.grader === 'Raw').length;
  const bulkCount = cards.filter(c => c.listingFormat === 'bulk_lot').length;
  const setCount = cards.filter(c => c.listingFormat === 'complete_set').length;

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer || !newSet) return;

    addNewCard({
      player: newPlayer,
      team: newTeam || (newFormat === 'complete_set' ? 'League Set' : 'Pro Team'),
      sport: newSport,
      year: Number(newYear),
      set: newSet,
      cardNumber: newCardNumber || (newFormat === 'bulk_lot' ? 'LOT' : newFormat === 'complete_set' ? 'SET' : '1'),
      listingFormat: newFormat,
      rawCondition: newFormat === 'raw' ? newRawCondition : undefined,
      holderType: newFormat === 'raw' ? newHolderType : newFormat === 'bulk_lot' ? 'Archival Lot Box' : undefined,
      lotCount: newFormat === 'bulk_lot' ? Number(newLotCount) : undefined,
      perCardPrice: newFormat === 'bulk_lot' ? Number(newPerCardPrice) : undefined,
      setDetails: newFormat === 'complete_set' ? {
        totalCards: Number(newSetTotalCards),
        completeness: `100% Complete Set (${newSetTotalCards} Cards)`,
        isFactorySealed: newSetIsSealed,
        keyHighlights: ['Key Rookies Included', 'Hall of Fame Checklist'],
      } : undefined,
      grader: newFormat === 'graded' ? newGrader : newFormat === 'raw' ? 'Raw' : 'None',
      grade: newFormat === 'graded' ? newGrade : newFormat === 'raw' ? `Raw (${newRawCondition})` : newFormat === 'bulk_lot' ? `Bulk Lot (${newLotCount} Cards)` : `Complete Set (${newSetTotalCards} Cards)`,
      numericGrade: newFormat === 'graded' ? Number(newNumericGrade) : 0,
      certNumber: newCertNumber || (newFormat === 'graded' ? String(Math.floor(10000000 + Math.random() * 90000000)) : `STASH-${Date.now().toString().slice(-6)}`),
      price: Number(newPrice),
      originalCost: Number(newOriginalCost),
      estimatedMarketValue: Math.round(Number(newPrice) * 1.05),
      status: 'available',
      isRookie: newIsRookie,
      isAuto: newIsAuto,
      isPatch: false,
      isNumbered: newIsNumbered,
      serialNumber: newSerialNumber || undefined,
      popReport: newFormat === 'graded' ? Number(newPopReport) : 0,
      frontImage: newFormat === 'bulk_lot' 
        ? '/src/assets/images/lot_bulk_singles_1790271622828.jpg'
        : newFormat === 'complete_set'
        ? '/src/assets/images/set_complete_box_1790271637684.jpg'
        : newFormat === 'raw'
        ? '/src/assets/images/card_raw_onetouch_1790271609520.jpg'
        : '/src/assets/images/card_gretzky_rookie_1790270880467.jpg',
      description: newDescription || `${newYear} ${newSet} ${newPlayer} - ${newFormat === 'graded' ? `${newGrader} ${newGrade}` : newFormat === 'raw' ? `Raw single in ${newHolderType}` : newFormat === 'bulk_lot' ? `${newLotCount} bulk singles` : `Complete ${newSetTotalCards}-card set`}.`,
      tags: [newPlayer, newSport, newFormat, newIsRookie ? 'Rookie Card' : 'Collection Item'],
    });

    // Reset form
    setIsAddingNew(false);
    setNewPlayer('');
    setNewSet('');
    setNewCertNumber('');
  };

  const handleSavePrice = (cardId: string) => {
    const val = parseFloat(editPriceVal);
    if (!isNaN(val) && val > 0) {
      updateCardPrice(cardId, val);
      setEditingCardId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Personal Vault & Inventory Management Suite
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'View List' : 'Ingest New Card'}</span>
            </button>

            <button
              onClick={() => setIsInventoryOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portfolio Stats Bar */}
        <div className="p-6 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Vault Valuation</p>
            <p className="text-xl sm:text-2xl font-black font-mono-nums text-slate-900 dark:text-white mt-0.5">
              ${totalValuation.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cost Basis (Acquired)</p>
            <p className="text-xl sm:text-2xl font-bold font-mono-nums text-slate-700 dark:text-slate-300 mt-0.5">
              ${totalCostBasis.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unrealized Portfolio Gain</p>
            <p className="text-xl sm:text-2xl font-bold font-mono-nums text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
              <span>+${totalGain.toLocaleString()}</span>
              <span className="text-xs font-semibold">({gainPercentage.toFixed(1)}%)</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Format Breakdown</p>
            <div className="text-xs font-mono-nums text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
              <span>Slabs: {gradedCount}</span>
              <span>·</span>
              <span>Raw: {rawCount}</span>
              <span>·</span>
              <span>Bulk Lots: {bulkCount}</span>
              <span>·</span>
              <span>Sets: {setCount}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {isAddingNew ? (
            /* Add New Card Form */
            <form onSubmit={handleCreateCard} className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-500" />
                  <span>Ingest Item to Vault Inventory</span>
                </h4>
              </div>

              {/* Format Selection Tab Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Item Format / Type *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'graded', label: 'Graded Slab 🛡️' },
                    { id: 'raw', label: 'Raw Single 💎' },
                    { id: 'bulk_lot', label: 'Bulk Singles 📦' },
                    { id: 'complete_set', label: 'Complete Set 📚' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setNewFormat(f.id as any)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
                        newFormat === f.id
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {newFormat === 'complete_set' ? 'Set / League Title *' : newFormat === 'bulk_lot' ? 'Lot Title / Player Highlights *' : 'Player Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlayer}
                    onChange={(e) => setNewPlayer(e.target.value)}
                    placeholder={newFormat === 'complete_set' ? 'e.g. 1984-85 O-Pee-Chee Hockey Complete Set' : newFormat === 'bulk_lot' ? 'e.g. 100-Card Vintage & Modern Hockey Stars Lot' : 'e.g. Wayne Gretzky'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Team / Scope
                  </label>
                  <input
                    type="text"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    placeholder={newFormat === 'complete_set' ? 'e.g. NHL League Set' : newFormat === 'bulk_lot' ? 'e.g. Multi-Team Stars' : 'e.g. Edmonton Oilers'}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sport
                  </label>
                  <select
                    value={newSport}
                    onChange={(e) => setNewSport(e.target.value as Sport)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Basketball">Basketball</option>
                    <option value="Baseball">Baseball</option>
                    <option value="Football">Football</option>
                    <option value="Soccer">Soccer</option>
                    <option value="Hockey">Hockey</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Card Set / Release *
                </label>
                <input
                  type="text"
                  required
                  value={newSet}
                  onChange={(e) => setNewSet(e.target.value)}
                  placeholder="e.g. Panini National Treasures Colossal"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Format-Specific Ingest Inputs */}
              {newFormat === 'graded' ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Grader
                      </label>
                      <select
                        value={newGrader}
                        onChange={(e) => setNewGrader(e.target.value as Grader)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="PSA">PSA</option>
                        <option value="BGS">BGS (Beckett)</option>
                        <option value="SGC">SGC</option>
                        <option value="CGC">CGC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Grade Text
                      </label>
                      <input
                        type="text"
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                        placeholder="10 GEM MT"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Numeric Grade
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={newNumericGrade}
                        onChange={(e) => setNewNumericGrade(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Cert #
                      </label>
                      <input
                        type="text"
                        value={newCertNumber}
                        onChange={(e) => setNewCertNumber(e.target.value)}
                        placeholder="e.g. 74819201"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Listing Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Cost Basis ($)
                      </label>
                      <input
                        type="number"
                        value={newOriginalCost}
                        onChange={(e) => setNewOriginalCost(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              ) : newFormat === 'raw' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Raw Condition Assessment
                      </label>
                      <input
                        type="text"
                        value={newRawCondition}
                        onChange={(e) => setNewRawCondition(e.target.value)}
                        placeholder="e.g. Near Mint-Mint (NM-MT 8.5+)"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Protective Holder
                      </label>
                      <input
                        type="text"
                        value={newHolderType}
                        onChange={(e) => setNewHolderType(e.target.value)}
                        placeholder="e.g. Ultra-Pro Magnetic One-Touch UV"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Listing Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Cost Basis ($)
                      </label>
                      <input
                        type="number"
                        value={newOriginalCost}
                        onChange={(e) => setNewOriginalCost(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              ) : newFormat === 'bulk_lot' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Total Singles in Lot
                      </label>
                      <input
                        type="number"
                        value={newLotCount}
                        onChange={(e) => {
                          const count = parseInt(e.target.value) || 1;
                          setNewLotCount(count);
                          if (newPrice > 0) setNewPerCardPrice(parseFloat((newPrice / count).toFixed(2)));
                        }}
                        placeholder="50"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Rate Per Card ($)
                      </label>
                      <input
                        type="number"
                        step="0.10"
                        value={newPerCardPrice}
                        onChange={(e) => setNewPerCardPrice(parseFloat(e.target.value) || 0)}
                        placeholder="6.50"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Total Lot Listing Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => {
                          const p = parseFloat(e.target.value) || 0;
                          setNewPrice(p);
                          if (newLotCount > 0) setNewPerCardPrice(parseFloat((p / newLotCount).toFixed(2)));
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Cost Basis ($)
                      </label>
                      <input
                        type="number"
                        value={newOriginalCost}
                        onChange={(e) => setNewOriginalCost(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Total Cards in Complete Set
                      </label>
                      <input
                        type="number"
                        value={newSetTotalCards}
                        onChange={(e) => setNewSetTotalCards(parseInt(e.target.value) || 1)}
                        placeholder="396"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="pt-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={newSetIsSealed}
                          onChange={(e) => setNewSetIsSealed(e.target.checked)}
                          className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span>Factory Cellophane Wrapped / Sealed</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Set Listing Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Cost Basis ($)
                      </label>
                      <input
                        type="number"
                        value={newOriginalCost}
                        onChange={(e) => setNewOriginalCost(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Attributes Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsRookie}
                    onChange={(e) => setNewIsRookie(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Rookie Card (RC)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsAuto}
                    onChange={(e) => setNewIsAuto(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Autographed (AU)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsNumbered}
                    onChange={(e) => setNewIsNumbered(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Serial Numbered</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow"
                >
                  Save & List in Vault
                </button>
              </div>
            </form>
          ) : (
            /* Inventory Table with Fast Edit */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Card / Player</th>
                    <th className="pb-3">Grader / Cert</th>
                    <th className="pb-3 text-right">Cost Basis</th>
                    <th className="pb-3 text-right">Listing Price</th>
                    <th className="pb-3 text-right">Est. Gain</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {cards.map(card => {
                    const cost = card.originalCost || card.price * 0.8;
                    const gain = card.price - cost;
                    const isEditing = editingCardId === card.id;

                    return (
                      <tr key={card.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 pl-2 font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={card.frontImage}
                              alt={card.player}
                              className="w-8 h-10 object-cover rounded bg-slate-950 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{card.player}</div>
                              <div className="text-[11px] text-slate-400">{card.year} {card.set}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 text-slate-600 dark:text-slate-300">
                          {card.listingFormat === 'bulk_lot' ? (
                            <div>
                              <span className="font-bold text-purple-600 dark:text-purple-400 text-xs">Bulk Singles Lot</span>
                              <span className="block text-[10px] text-slate-400">{card.lotCount} Cards · ${card.perCardPrice?.toFixed(2)}/card</span>
                            </div>
                          ) : card.listingFormat === 'complete_set' ? (
                            <div>
                              <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">Complete Set</span>
                              <span className="block text-[10px] text-slate-400">{card.setDetails?.totalCards} Cards · {card.setDetails?.isFactorySealed ? 'Sealed' : 'Collated'}</span>
                            </div>
                          ) : card.listingFormat === 'raw' ? (
                            <div>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">Raw Single</span>
                              <span className="block text-[10px] text-slate-400">{card.rawCondition || 'NM-MT'} · {card.holderType || 'One-Touch'}</span>
                            </div>
                          ) : (
                            <>
                              <span className="font-bold font-mono-nums">{card.grader} {card.grade}</span>
                              <span className="block text-[10px] text-slate-400 font-mono-nums">#{card.certNumber}</span>
                            </>
                          )}
                        </td>

                        <td className="py-3 text-right font-mono-nums text-slate-500">
                          ${cost.toLocaleString()}
                        </td>

                        <td className="py-3 text-right font-mono-nums font-bold text-slate-900 dark:text-amber-400">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={editPriceVal}
                                onChange={(e) => setEditPriceVal(e.target.value)}
                                className="w-24 bg-white dark:bg-slate-800 border border-amber-500 rounded px-2 py-0.5 text-right text-xs"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSavePrice(card.id)}
                                className="p-1 text-emerald-500 hover:text-emerald-400 cursor-pointer"
                                title="Save price (Alerts watchers)"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5 group">
                              <span>${card.price.toLocaleString()}</span>
                              <button
                                onClick={() => {
                                  setEditingCardId(card.id);
                                  setEditPriceVal(String(card.price));
                                }}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-500 p-0.5 cursor-pointer transition-opacity"
                                title="Quick adjust price"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3 text-right font-mono-nums text-emerald-600 dark:text-emerald-400 font-medium">
                          +${gain.toLocaleString()}
                        </td>

                        <td className="py-3">
                          <select
                            value={card.status}
                            onChange={(e) => updateCardStatus(card.id, e.target.value as CardStatus)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] rounded px-2 py-1 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                          >
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                            <option value="in_vault">In Vault</option>
                          </select>
                        </td>

                        <td className="py-3 text-right pr-2">
                          <button
                            onClick={() => {
                              const newP = Math.round(card.price * 0.9);
                              updateCardPrice(card.id, newP);
                            }}
                            className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-medium"
                            title="Simulate 10% flash price drop (triggers watcher push alert)"
                          >
                            -10% Drop
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
