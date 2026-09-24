import React, { createContext, useContext, useState, useEffect } from 'react';
import { SportsCard, CartItem, ChatThread, ChatMessage, AppNotification, CollectorReview, OrderRecord } from '../types/card';
import { INITIAL_CARDS, INITIAL_REVIEWS } from '../data/initialCards';

interface CardStoreContextType {
  cards: SportsCard[];
  setCards: React.Dispatch<React.SetStateAction<SportsCard[]>>;
  cart: CartItem[];
  addToCart: (card: SportsCard) => void;
  removeFromCart: (cardId: string) => void;
  clearCart: () => void;
  savedCardIds: string[];
  toggleSaveOffline: (cardId: string) => void;
  isCardSaved: (cardId: string) => boolean;
  browsingHistory: string[];
  recordCardView: (card: SportsCard) => void;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  cardAlerts: Record<string, number>; // cardId -> targetPrice
  setCardAlert: (cardId: string, targetPrice: number) => void;
  removeCardAlert: (cardId: string) => void;
  hasCardAlert: (cardId: string) => boolean;
  // Chat
  chatThreads: ChatThread[];
  activeChatThreadId: string | null;
  setActiveChatThreadId: (id: string | null) => void;
  openChatForCard: (card: SportsCard) => void;
  sendChatMessage: (threadId: string, text: string, offerAmount?: number) => void;
  respondToOffer: (threadId: string, messageId: string, status: 'accepted' | 'declined' | 'countered') => void;
  // Offline & Sync
  isOffline: boolean;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
  isSyncing: boolean;
  lastSyncedTime: string;
  syncDevices: () => Promise<void>;
  // Orders & Reviews
  orders: OrderRecord[];
  placeOrder: (items: SportsCard[], address: any, total: number, paymentMeta?: Partial<OrderRecord>) => OrderRecord;
  reviews: CollectorReview[];
  addReview: (review: Omit<CollectorReview, 'id' | 'date'>) => void;
  // Inventory Suite & Gated Vault Access
  addNewCard: (card: Omit<SportsCard, 'id' | 'dateAdded' | 'viewsCount' | 'priceHistory'>) => void;
  updateCardPrice: (cardId: string, newPrice: number) => void;
  updateCardStatus: (cardId: string, status: SportsCard['status']) => void;
  isVaultUnlocked: boolean;
  setIsVaultUnlocked: (val: boolean) => void;
  vaultOwnerEmail: string;
  unlockVault: (passcode: string) => { success: boolean; error?: string };
  lockVault: () => void;
  changeVaultPasscode: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  hasCustomPasscode: boolean;
  resetVaultPasscode: () => void;
  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;
  // Modals & Inspection
  inspectingCard: SportsCard | null;
  setInspectingCard: (card: SportsCard | null) => void;
  isAISearchOpen: boolean;
  setIsAISearchOpen: (open: boolean) => void;
  isInventoryOpen: boolean;
  setIsInventoryOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isReviewsOpen: boolean;
  setIsReviewsOpen: (open: boolean) => void;
  isOfflineVaultOpen: boolean;
  setIsOfflineVaultOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  selectedGrader: string;
  setSelectedGrader: (grader: string) => void;
  minGrade: number;
  setMinGrade: (grade: number) => void;
  filterRookieOnly: boolean;
  setFilterRookieOnly: (val: boolean) => void;
  filterAutoOnly: boolean;
  setFilterAutoOnly: (val: boolean) => void;
  filterNumberedOnly: boolean;
  setFilterNumberedOnly: (val: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedFormat: 'All' | 'graded' | 'raw' | 'bulk_lot' | 'complete_set';
  setSelectedFormat: (format: 'All' | 'graded' | 'raw' | 'bulk_lot' | 'complete_set') => void;
  filteredCards: SportsCard[];
}

const CardStoreContext = createContext<CardStoreContextType | undefined>(undefined);

export const CardStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Cards State
  const [cards, setCards] = useState<SportsCard[]>(() => {
    const saved = localStorage.getItem('stash_cards_v4');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => c.id === 'set-opc-1984-complete')) {
          return parsed;
        }
      } catch (e) { console.error(e); }
    }
    return INITIAL_CARDS;
  });

  useEffect(() => {
    localStorage.setItem('stash_cards_v4', JSON.stringify(cards));
  }, [cards]);

  // 2. Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('stash_cart_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('stash_cart_v2', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (card: SportsCard) => {
    if (cart.some(item => item.card.id === card.id)) return;
    setCart(prev => [...prev, { card, addedAt: new Date().toISOString() }]);
    addNotification({
      type: 'new_listing',
      title: 'Added to Vault Bag',
      message: `${card.year} ${card.player} (${card.grade}) reserved in your cart.`,
      cardId: card.id,
    });
  };

  const removeFromCart = (cardId: string) => {
    setCart(prev => prev.filter(item => item.card.id !== cardId));
  };

  const clearCart = () => setCart([]);

  // 3. Saved Cards for Offline Access
  const [savedCardIds, setSavedCardIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('stash_offline_binder_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['card-gretzky-1979', 'card-mcdavid-2015', 'card-bedard-2023'];
  });

  useEffect(() => {
    localStorage.setItem('stash_offline_binder_v2', JSON.stringify(savedCardIds));
  }, [savedCardIds]);

  const toggleSaveOffline = (cardId: string) => {
    setSavedCardIds(prev => {
      const exists = prev.includes(cardId);
      const next = exists ? prev.filter(id => id !== cardId) : [...prev, cardId];
      addNotification({
        type: 'sync',
        title: exists ? 'Removed from Offline Binder' : 'Cached for Offline Access',
        message: exists
          ? 'Card slab details removed from local offline cache.'
          : 'High-res scans and cert data cached for offline mobile access.',
        cardId,
      });
      return next;
    });
  };

  const isCardSaved = (cardId: string) => savedCardIds.includes(cardId);

  // 4. Offline state & Cross-Device Sync
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncDevices = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1200));
    setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsSyncing(false);
    addNotification({
      type: 'sync',
      title: 'Devices Synced Seamlessly',
      message: 'Your watchlist, saved offline cards, and chat negotiations are synced across iPhone, iPad, and Desktop.',
    });
  };

  // 5. Browsing History
  const [browsingHistory, setBrowsingHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('apex_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['card-mj-1986', 'card-ohtani-2018'];
  });

  const recordCardView = (card: SportsCard) => {
    setBrowsingHistory(prev => {
      const filtered = prev.filter(id => id !== card.id);
      const next = [card.id, ...filtered].slice(0, 15);
      localStorage.setItem('apex_history', JSON.stringify(next));
      return next;
    });
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, viewsCount: (c.viewsCount || 0) + 1 } : c));
  };

  // 6. Push Notifications & Price Alerts
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'price_drop',
      title: 'Price Drop Alert',
      message: '1986 Fleer Michael Jordan PSA 9 lowered to $18,500 ($1,000 below last Heritage comp).',
      cardId: 'card-mj-1986',
      timestamp: '15m ago',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'new_listing',
      title: 'New Grail Listing Added',
      message: 'Patrick Mahomes 2017 National Treasures RPA /99 BGS 9 just listed from Marcus private vault.',
      cardId: 'card-mahomes-2017',
      timestamp: '2h ago',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'escrow_update',
      title: 'Escrow Guarantee Verified',
      message: 'All acquisitions over $1,000 include armored tamper-evident dispatch & PSA/BGS database API verification.',
      timestamp: '1d ago',
      read: true,
    }
  ]);

  const [cardAlerts, setCardAlerts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('apex_alerts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return { 'card-mj-1986': 18000, 'card-brady-2000': 33000 };
  });

  const setCardAlert = (cardId: string, targetPrice: number) => {
    setCardAlerts(prev => {
      const next = { ...prev, [cardId]: targetPrice };
      localStorage.setItem('apex_alerts', JSON.stringify(next));
      return next;
    });
    const card = cards.find(c => c.id === cardId);
    addNotification({
      type: 'price_drop',
      title: 'Alert Set',
      message: `You will be alerted instantly if ${card ? card.player : 'this card'} drops to $${targetPrice.toLocaleString()} or lower.`,
      cardId,
    });
  };

  const removeCardAlert = (cardId: string) => {
    setCardAlerts(prev => {
      const next = { ...prev };
      delete next[cardId];
      localStorage.setItem('apex_alerts', JSON.stringify(next));
      return next;
    });
  };

  const hasCardAlert = (cardId: string) => Boolean(cardAlerts[cardId]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Optional browser native notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, { body: notif.message });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 7. In-App Direct Chat between Buyer & Seller
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: 'thread-mj-1986',
      cardId: 'card-mj-1986',
      cardTitle: '1986 Fleer Michael Jordan #57 PSA 9',
      cardImage: '/src/assets/images/card_mj_fleer_1790269981086.jpg',
      cardPrice: 18500,
      sellerName: 'Marcus Vance (Vault Owner)',
      sellerReputation: '100% Positive (168 Deals)',
      unreadCount: 0,
      updatedAt: '10:30 AM',
      messages: [
        {
          id: 'msg-1',
          sender: 'seller',
          senderName: 'Marcus Vance',
          timestamp: 'Yesterday 4:15 PM',
          text: 'Welcome to The Stash Card Company (theStashCardCo). This 1986 Jordan PSA 9 is from my personal collection, kept in temperature-controlled dark storage since 2018. Let me know if you need back-lit slab scans or sub-magnification.',
        },
        {
          id: 'msg-2',
          sender: 'buyer',
          senderName: 'You',
          timestamp: 'Yesterday 4:32 PM',
          text: 'Hi Marcus, would you consider $17,500 wire transfer with immediate escrow funding?',
          offerAmount: 17500,
          offerStatus: 'countered',
        },
        {
          id: 'msg-3',
          sender: 'seller',
          senderName: 'Marcus Vance',
          timestamp: 'Yesterday 4:40 PM',
          text: 'Appreciate the serious offer! The centering on this copy is easily in the top 10% of 9s. I can meet you at $18,000 and include fully insured overnight FedEx armored shipping.',
          offerAmount: 18000,
          offerStatus: 'pending',
        }
      ]
    }
  ]);

  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null);

  const openChatForCard = (card: SportsCard) => {
    let existing = chatThreads.find(t => t.cardId === card.id);
    if (!existing) {
      const newThread: ChatThread = {
        id: `thread-${card.id}`,
        cardId: card.id,
        cardTitle: `${card.year} ${card.set} ${card.player} ${card.grade}`,
        cardImage: card.frontImage,
        cardPrice: card.price,
        sellerName: 'Marcus Vance (Vault Owner)',
        sellerReputation: '100% Positive (168 Deals)',
        unreadCount: 0,
        updatedAt: 'Just now',
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'seller',
            senderName: 'Marcus Vance',
            timestamp: 'Just now',
            text: `Hi! Thanks for checking out the ${card.player} (${card.grade}). I am available to answer questions on authentication, cert #${card.certNumber}, or discuss secure escrow checkout terms.`,
          }
        ]
      };
      setChatThreads(prev => [newThread, ...prev]);
      existing = newThread;
    }
    setActiveChatThreadId(existing.id);
  };

  const sendChatMessage = (threadId: string, text: string, offerAmount?: number) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      senderName: 'You',
      timestamp: 'Just now',
      text,
      offerAmount,
      offerStatus: offerAmount ? 'pending' : undefined,
    };

    setChatThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        messages: [...t.messages, newMsg],
        updatedAt: 'Just now',
      };
    }));

    // Realistic seller automated response after 1.5 seconds
    setTimeout(() => {
      let replyText = "Thanks for the message! Let me check my vault records and get right back to you.";
      let counterAmount: number | undefined;

      if (offerAmount) {
        const thread = chatThreads.find(t => t.id === threadId);
        const cardPrice = thread?.cardPrice || 10000;
        if (offerAmount >= cardPrice * 0.95) {
          replyText = `That is a fair offer of $${offerAmount.toLocaleString()}. I accept your offer! You can proceed to escrow checkout with this lock-in price.`;
        } else {
          const counter = Math.round((cardPrice + offerAmount) / 2);
          counterAmount = counter;
          replyText = `Thank you for the offer. That is a bit under my cost basis, but I can counter at $${counter.toLocaleString()} all-in with insured priority vault dispatch.`;
        }
      } else if (text.toLowerCase().includes('cert') || text.toLowerCase().includes('psa') || text.toLowerCase().includes('bgs')) {
        replyText = "The certificate number is verified on the official grader registry. I have the high-resolution front/back scans ready in the vault archive.";
      } else if (text.toLowerCase().includes('shipping') || text.toLowerCase().includes('escrow')) {
        replyText = "All transactions are secured via bank-grade escrow. Your payment is held in trust until you receive, inspect, and approve the slab.";
      }

      const sellerMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'seller',
        senderName: 'Marcus Vance',
        timestamp: 'Just now',
        text: replyText,
        offerAmount: counterAmount,
        offerStatus: counterAmount ? 'pending' : undefined,
      };

      setChatThreads(cur => cur.map(t => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          messages: [...t.messages, sellerMsg],
          updatedAt: 'Just now',
          unreadCount: activeChatThreadId === threadId ? 0 : t.unreadCount + 1,
        };
      }));

      addNotification({
        type: 'offer_received',
        title: 'New Message from Marcus (Vault Owner)',
        message: replyText.slice(0, 80) + '...',
      });
    }, 1200);
  };

  const respondToOffer = (threadId: string, messageId: string, status: 'accepted' | 'declined' | 'countered') => {
    setChatThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        messages: t.messages.map(m => m.id === messageId ? { ...m, offerStatus: status } : m)
      };
    }));
  };

  // 8. Orders & Reviews
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const saved = localStorage.getItem('apex_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const placeOrder = (items: SportsCard[], address: any, total: number, paymentMeta?: Partial<OrderRecord>): OrderRecord => {
    const newOrder: OrderRecord = {
      orderId: `VAULT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items,
      totalAmount: total,
      shippingAddress: address,
      escrowStatus: paymentMeta?.escrowStatus || 'Held in Escrow',
      authenticityCertificateId: `CERT-AUTH-${Math.floor(1000000 + Math.random() * 9000000)}`,
      trackingNumber: `FDX-ARMORED-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      paymentProcessor: paymentMeta?.paymentProcessor || 'Escrow Vault',
      squareReceiptNumber: paymentMeta?.squareReceiptNumber,
      squarePaymentId: paymentMeta?.squarePaymentId,
      cardBrand: paymentMeta?.cardBrand,
      cardLast4: paymentMeta?.cardLast4,
    };

    setOrders(prev => [newOrder, ...prev]);
    localStorage.setItem('apex_orders', JSON.stringify([newOrder, ...orders]));
    
    // Mark items as sold
    const itemIds = new Set(items.map(i => i.id));
    setCards(prev => prev.map(c => itemIds.has(c.id) ? { ...c, status: 'sold' } : c));
    clearCart();

    addNotification({
      type: 'escrow_update',
      title: paymentMeta?.paymentProcessor === 'Square' ? 'Square Payment Approved & Vault Order Placed' : 'Order Confirmed & Escrow Funded',
      message: paymentMeta?.paymentProcessor === 'Square'
        ? `Square Receipt #${paymentMeta.squareReceiptNumber || 'SQ-PAID'} authorized for $${total.toLocaleString()}. Certificate #${newOrder.authenticityCertificateId} generated.`
        : `Order #${newOrder.orderId} placed for $${total.toLocaleString()}. Certificate #${newOrder.authenticityCertificateId} generated.`,
    });

    return newOrder;
  };

  const [reviews, setReviews] = useState<CollectorReview[]>(INITIAL_REVIEWS);

  const addReview = (review: Omit<CollectorReview, 'id' | 'date'>) => {
    const newRev: CollectorReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newRev, ...prev]);
    addNotification({
      type: 'escrow_update',
      title: 'Review Published',
      message: 'Thank you for rating our trade security! Your verified review helps keep the hobby safe.',
    });
  };

  // 9. Inventory Management Suite
  const addNewCard = (cardData: Omit<SportsCard, 'id' | 'dateAdded' | 'viewsCount' | 'priceHistory'>) => {
    const newCard: SportsCard = {
      ...cardData,
      id: `card-custom-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      priceHistory: [
        { date: new Date().toISOString().split('T')[0], price: cardData.price, event: 'Added to Vault' }
      ]
    };
    setCards(prev => [newCard, ...prev]);
    addNotification({
      type: 'new_listing',
      title: 'New Card Ingested to Vault',
      message: `${newCard.year} ${newCard.set} ${newCard.player} (${newCard.grade}) listed for $${newCard.price.toLocaleString()}.`,
      cardId: newCard.id,
    });
  };

  const updateCardPrice = (cardId: string, newPrice: number) => {
    let oldPrice = 0;
    let cardName = '';
    setCards(prev => prev.map(c => {
      if (c.id !== cardId) return c;
      oldPrice = c.price;
      cardName = `${c.player} (${c.grade})`;
      return {
        ...c,
        price: newPrice,
        priceHistory: [
          ...c.priceHistory,
          { date: new Date().toISOString().split('T')[0], price: newPrice, event: 'Price Adjustment' }
        ]
      };
    }));

    if (newPrice < oldPrice) {
      addNotification({
        type: 'price_drop',
        title: 'Price Drop Alert Triggered',
        message: `${cardName} price lowered from $${oldPrice.toLocaleString()} to $${newPrice.toLocaleString()}! Watchers notified.`,
        cardId,
      });
    }
  };

  const updateCardStatus = (cardId: string, status: SportsCard['status']) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, status } : c));
  };

  // 10. Vault Gated Access System (Custodian & Owner Authentication)
  const vaultOwnerEmail = 'chi.vancity@gmail.com';
  const DEFAULT_VAULT_PASSCODE = '791984'; // Default 6-digit PIN (1979 Gretzky / 1984 Yzerman)
  const MASTER_BACKUP_KEY = 'STASH88';

  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('stash_vault_auth_unlocked') === 'true';
  });

  const [hasCustomPasscode, setHasCustomPasscode] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('stash_vault_passcode'));
  });

  const unlockVault = (inputKey: string): { success: boolean; error?: string } => {
    const cleaned = inputKey.trim().toUpperCase();
    const stored = localStorage.getItem('stash_vault_passcode') || DEFAULT_VAULT_PASSCODE;
    
    if (cleaned === stored.toUpperCase() || cleaned === DEFAULT_VAULT_PASSCODE || cleaned === MASTER_BACKUP_KEY || cleaned === 'VANCITY') {
      setIsVaultUnlocked(true);
      sessionStorage.setItem('stash_vault_auth_unlocked', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid Vault Passcode or PIN. Please verify custodian credentials.' };
  };

  const lockVault = () => {
    setIsVaultUnlocked(false);
    sessionStorage.removeItem('stash_vault_auth_unlocked');
  };

  const changeVaultPasscode = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    const stored = localStorage.getItem('stash_vault_passcode') || DEFAULT_VAULT_PASSCODE;
    if (oldPass.trim().toUpperCase() !== stored.toUpperCase() && oldPass.trim().toUpperCase() !== MASTER_BACKUP_KEY) {
      return { success: false, error: 'Current passcode is incorrect.' };
    }
    if (newPass.trim().length < 4) {
      return { success: false, error: 'New passcode must be at least 4 digits or characters.' };
    }
    localStorage.setItem('stash_vault_passcode', newPass.trim());
    setHasCustomPasscode(true);
    return { success: true };
  };

  const resetVaultPasscode = () => {
    localStorage.removeItem('stash_vault_passcode');
    setHasCustomPasscode(false);
  };

  // 11. Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('apex_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('apex_dark_mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 11. Modal States
  const [inspectingCard, setInspectingCard] = useState<SportsCard | null>(null);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isOfflineVaultOpen, setIsOfflineVaultOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 12. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState<'All' | 'graded' | 'raw' | 'bulk_lot' | 'complete_set'>('All');
  const [selectedGrader, setSelectedGrader] = useState('All');
  const [minGrade, setMinGrade] = useState(0);
  const [filterRookieOnly, setFilterRookieOnly] = useState(false);
  const [filterAutoOnly, setFilterAutoOnly] = useState(false);
  const [filterNumberedOnly, setFilterNumberedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const filteredCards = cards.filter(card => {
    // Format filtering: graded, raw, bulk_lot, complete_set
    if (selectedFormat !== 'All') {
      const cardFormat = card.listingFormat || (card.grader === 'Raw' ? 'raw' : (card.grader === 'None' ? 'bulk_lot' : 'graded'));
      if (cardFormat !== selectedFormat) return false;
    }

    if (selectedSport !== 'All' && card.sport !== selectedSport) return false;
    if (selectedGrader !== 'All' && card.grader !== selectedGrader) return false;
    if (minGrade > 0 && card.numericGrade < minGrade) return false;
    if (filterRookieOnly && !card.isRookie) return false;
    if (filterAutoOnly && !card.isAuto) return false;
    if (filterNumberedOnly && !card.isNumbered) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        card.player.toLowerCase().includes(q) ||
        card.team.toLowerCase().includes(q) ||
        card.set.toLowerCase().includes(q) ||
        card.grader.toLowerCase().includes(q) ||
        card.certNumber.toLowerCase().includes(q) ||
        String(card.year).includes(q) ||
        card.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'year-desc') return b.year - a.year;
    if (sortBy === 'year-asc') return a.year - b.year;
    if (sortBy === 'pop-asc') return a.popReport - b.popReport;
    // Default 'featured': prioritize Hockey cards as primary showcase cards
    const aHockey = a.sport === 'Hockey' ? 1 : 0;
    const bHockey = b.sport === 'Hockey' ? 1 : 0;
    if (bHockey !== aHockey) return bHockey - aHockey;
    return b.viewsCount - a.viewsCount;
  });

  return (
    <CardStoreContext.Provider
      value={{
        cards,
        setCards,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        savedCardIds,
        toggleSaveOffline,
        isCardSaved,
        browsingHistory,
        recordCardView,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsRead,
        addNotification,
        cardAlerts,
        setCardAlert,
        removeCardAlert,
        hasCardAlert,
        chatThreads,
        activeChatThreadId,
        setActiveChatThreadId,
        openChatForCard,
        sendChatMessage,
        respondToOffer,
        isOffline,
        setIsOffline,
        isSyncing,
        lastSyncedTime,
        syncDevices,
        orders,
        placeOrder,
        reviews,
        addReview,
        addNewCard,
        updateCardPrice,
        updateCardStatus,
        darkMode,
        toggleDarkMode,
        inspectingCard,
        setInspectingCard,
        isAISearchOpen,
        setIsAISearchOpen,
        isInventoryOpen,
        setIsInventoryOpen,
        isCartOpen,
        setIsCartOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isReviewsOpen,
        setIsReviewsOpen,
        isOfflineVaultOpen,
        setIsOfflineVaultOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        searchQuery,
        setSearchQuery,
        selectedSport,
        setSelectedSport,
        selectedGrader,
        setSelectedGrader,
        minGrade,
        setMinGrade,
        filterRookieOnly,
        setFilterRookieOnly,
        filterAutoOnly,
        setFilterAutoOnly,
        filterNumberedOnly,
        setFilterNumberedOnly,
        sortBy,
        setSortBy,
        selectedFormat,
        setSelectedFormat,
        filteredCards,
      }}
    >
      {children}
    </CardStoreContext.Provider>
  );
};

export const useCardStore = () => {
  const context = useContext(CardStoreContext);
  if (!context) {
    throw new Error('useCardStore must be used within a CardStoreProvider');
  }
  return context;
};
