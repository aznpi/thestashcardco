import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  TrendingDown, 
  PlusCircle, 
  ShieldCheck, 
  CheckCheck, 
  Wifi,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';

export const NotificationCenterModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    addNotification,
    setInspectingCard,
    cards,
  } = useCardStore();

  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  if (!isNotificationsOpen) return null;

  const handleRequestPushPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setPushEnabled(true);
        addNotification({
          type: 'sync',
          title: 'Push Alerts Enabled',
          message: 'You will receive real-time push alerts for new card listings and price drops!',
        });
      }
    }
  };

  const handleSimulatePriceDrop = () => {
    const card = cards[0];
    addNotification({
      type: 'price_drop',
      title: '🚨 Flash Price Drop Alert',
      message: `${card.player} (${card.grade}) just dropped by $1,000! Now listed at $${(card.price - 1000).toLocaleString()}.`,
      cardId: card.id,
    });
  };

  const handleSimulateNewListing = () => {
    addNotification({
      type: 'new_listing',
      title: '✨ New Vault Listing Alert',
      message: '1997 Metal Universe Precious Metal Gems (PMG) Red #/100 entered the vault archive.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Alerts & Push Notifications
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Push Notification Permission Box */}
        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">
                {pushEnabled ? 'Push Alerts Active' : 'Enable Live Push Notifications'}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Receive instant sound & screen alerts for price drops & grails.
              </span>
            </div>
          </div>

          {!pushEnabled && (
            <button
              onClick={handleRequestPushPermission}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer shrink-0"
            >
              Enable
            </button>
          )}
        </div>

        {/* Simulation Controls for testing */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Test Alerts:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulatePriceDrop}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
            >
              + Price Drop Alert
            </button>
            <button
              onClick={handleSimulateNewListing}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
            >
              + New Listing Alert
            </button>
          </div>
        </div>

        {/* Notification Feed */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {notifications.length > 0 ? (
            notifications.map(notif => {
              const card = notif.cardId ? cards.find(c => c.id === notif.cardId) : null;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (card) {
                      setInspectingCard(card);
                      setIsNotificationsOpen(false);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    notif.read
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      : 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    {notif.type === 'price_drop' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                    {notif.type === 'new_listing' && <PlusCircle className="w-4 h-4 text-amber-500" />}
                    {notif.type === 'escrow_update' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    {notif.type === 'offer_received' && <Sparkles className="w-4 h-4 text-blue-500" />}
                    {notif.type === 'sync' && <Wifi className="w-4 h-4 text-purple-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono-nums">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>

                    {card && (
                      <span className="inline-block mt-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                        View Slab Details →
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm">No new alerts at this time.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
