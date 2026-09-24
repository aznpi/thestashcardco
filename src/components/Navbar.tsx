import React from 'react';
import { 
  Search, 
  Sparkles, 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Boxes,
  Bookmark
} from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';

export const Navbar: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setIsInventoryOpen,
    setIsAISearchOpen,
    setIsReviewsOpen,
    setIsOfflineVaultOpen,
    savedCardIds,
    chatThreads,
    setActiveChatThreadId,
    darkMode,
    toggleDarkMode,
    isOffline,
    setIsOffline,
    isSyncing,
    syncDevices,
  } = useCardStore();

  const totalChatUnread = chatThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md transition-colors">
      {/* Offline / Sync Banner if offline or syncing */}
      {isOffline && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1 text-center text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode Active · Browsing cached card slabs & offline binder</span>
          <button 
            onClick={() => setIsOffline(false)}
            className="underline hover:text-amber-300 ml-2"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Mandatory Top Bar Contract: Exactly 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span>The Stash Card Co.</span>
            <span className="text-xs font-mono font-normal text-amber-600 dark:text-amber-400 tracking-normal border-l border-slate-300 dark:border-slate-700 pl-2">
              theStashCardCo
            </span>
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a 
            href="#collection" 
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Collection
          </a>
          <button 
            onClick={() => setIsAISearchOpen(true)}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-amber-600 dark:text-amber-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Card Match</span>
          </button>
          <button 
            onClick={() => setIsInventoryOpen(true)}
            className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Inventory Suite</span>
          </button>
          <button 
            onClick={() => setIsReviewsOpen(true)}
            className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Trade Security</span>
          </button>
          <button 
            onClick={() => setIsOfflineVaultOpen(true)}
            className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Offline Binder ({savedCardIds.length})</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Inventory Suite Trigger (Accessible on all screens) */}
          <button
            onClick={() => setIsInventoryOpen(true)}
            title="Vault Inventory Suite (Portfolio & Ingest)"
            aria-label="Inventory Suite"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer relative"
          >
            <Boxes className="w-4 h-4 text-amber-500" />
          </button>

          {/* Quick AI Search Trigger */}
          <button
            onClick={() => setIsAISearchOpen(true)}
            title="Semantic Card Search"
            aria-label="Semantic Card Search"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sync Trigger */}
          <button
            onClick={() => syncDevices()}
            disabled={isSyncing}
            title="Sync Devices (iPhone / iPad / Web)"
            aria-label="Sync Devices"
            className="hidden sm:flex p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer relative"
          >
            <Wifi className={`w-4 h-4 ${isSyncing ? 'animate-pulse text-amber-500' : ''}`} />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            title="Notifications & Price Drops"
            aria-label="Notifications"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* In-App Direct Chat */}
          <button
            onClick={() => {
              if (chatThreads.length > 0) {
                setActiveChatThreadId(chatThreads[0].id);
              } else {
                setIsCartOpen(true);
              }
            }}
            title="Direct Negotiation Chat"
            aria-label="Direct Chat"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer relative"
          >
            <MessageSquare className="w-4 h-4" />
            {totalChatUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalChatUnread}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Daylight Mode" : "Switch to Dark Vault Mode"}
            aria-label="Toggle theme"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Shopping Bag / Escrow Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-amber-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Vault Bag</span>
            {cart.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-white/20 dark:bg-black/20 rounded text-[11px] font-mono-nums">
                {cart.length}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
