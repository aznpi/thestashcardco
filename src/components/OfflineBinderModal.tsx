import React from 'react';
import { 
  X, 
  Bookmark, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Eye, 
  Trash2,
  HardDriveDownload,
  Check
} from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';

export const OfflineBinderModal: React.FC = () => {
  const {
    isOfflineVaultOpen,
    setIsOfflineVaultOpen,
    savedCardIds,
    toggleSaveOffline,
    cards,
    setInspectingCard,
    isOffline,
    setIsOffline,
    isSyncing,
    lastSyncedTime,
    syncDevices,
  } = useCardStore();

  if (!isOfflineVaultOpen) return null;

  const savedCards = cards.filter(c => savedCardIds.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Offline Card Vault & Device Sync
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instant card access at sports card expos with zero internet dependency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => syncDevices()}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All Devices'}</span>
            </button>

            <button
              onClick={() => setIsOfflineVaultOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync & Connectivity Dashboard */}
        <div className="p-6 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Network State */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isOffline ? (
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <WifiOff className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Wifi className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {isOffline ? 'Offline Mode' : 'Online & Connected'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isOffline ? 'Using local slab cache' : 'Vault API active'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOffline(!isOffline)}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              {isOffline ? 'Go Online' : 'Simulate Offline'}
            </button>
          </div>

          {/* Connected Devices */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">3 Devices Synced</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="flex items-center gap-0.5"><Smartphone className="w-3 h-3" /> iPhone</span>
                <span>·</span>
                <span className="flex items-center gap-0.5"><Tablet className="w-3 h-3" /> iPad</span>
                <span>·</span>
                <span>Web</span>
              </div>
            </div>
          </div>

          {/* Local Cache Size */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <HardDriveDownload className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Local Storage: Cached</div>
              <div className="text-[11px] text-slate-500">
                Last synced: <span className="font-semibold text-slate-700 dark:text-slate-300">{lastSyncedTime}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Saved Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Saved Offline Cards ({savedCards.length})
            </h4>
            <span className="text-xs text-slate-500">
              Full slab certs & high-res visuals saved locally
            </span>
          </div>

          {savedCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCards.map(card => (
                <div
                  key={card.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3 group hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={card.frontImage}
                      alt={card.player}
                      className="w-14 h-18 object-cover rounded-lg bg-slate-950 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono-nums font-bold text-blue-600 dark:text-blue-400">
                        {card.grader} {card.numericGrade} · Pop {card.popReport}
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {card.player}
                      </h5>
                      <p className="text-xs text-slate-500 truncate">
                        {card.year} {card.set}
                      </p>
                      <div className="text-xs font-bold font-mono-nums text-slate-900 dark:text-amber-400 mt-1">
                        ${card.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <button
                      onClick={() => {
                        setInspectingCard(card);
                        setIsOfflineVaultOpen(false);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Offline Slab</span>
                    </button>

                    <button
                      onClick={() => toggleSaveOffline(card.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      title="Remove from offline cache"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm">No cards currently saved for offline viewing.</p>
              <p className="text-xs text-slate-400 mt-1">
                Click the bookmark icon on any card in the collection to save high-res scans for offline access.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
