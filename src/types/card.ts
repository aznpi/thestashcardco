export type Sport = 'Basketball' | 'Baseball' | 'Football' | 'Soccer' | 'Hockey';
export type Grader = 'PSA' | 'BGS' | 'SGC' | 'CGC' | 'Raw' | 'None';
export type CardStatus = 'available' | 'reserved' | 'sold' | 'in_vault';
export type ListingFormat = 'graded' | 'raw' | 'bulk_lot' | 'complete_set';

export interface CardSubgrades {
  centering: number;
  corners: number;
  edges: number;
  surface: number;
  autoGrade?: number;
}

export interface SetDetails {
  totalCards: number;
  completeness: string;
  isFactorySealed?: boolean;
  keyHighlights: string[];
}

export interface PricePoint {
  date: string;
  price: number;
  event: string;
}

export interface SportsCard {
  id: string;
  player: string;
  team: string;
  sport: Sport;
  year: number;
  set: string;
  cardNumber: string;
  listingFormat?: ListingFormat; // 'graded' | 'raw' | 'bulk_lot' | 'complete_set'
  rawCondition?: string; // e.g. "Near Mint-Mint (NM-MT 8+)", "Near Mint (NM)"
  holderType?: string; // e.g. "Magnetic One-Touch", "Top Loader & Penny Sleeve", "Collector Box"
  lotCount?: number; // for bulk singles lots e.g. 50, 100 cards
  perCardPrice?: number; // e.g. $6.50
  setDetails?: SetDetails; // for complete / team sets
  grader: Grader;
  grade: string; // e.g. "10 GEM MT", "9 MINT", "9.5 GEM MINT", "NM-MT (Raw)"
  numericGrade: number; // e.g. 10, 9, 9.5, or 0 for bulk/set
  certNumber: string;
  subgrades?: CardSubgrades;
  price: number;
  originalCost: number; // purchase cost for inventory P&L calculation
  estimatedMarketValue: number;
  status: CardStatus;
  isRookie: boolean;
  isAuto: boolean;
  isPatch: boolean;
  isNumbered: boolean;
  serialNumber?: string; // e.g. "07/10"
  popReport: number; // population at this grade or higher
  frontImage: string;
  backImage?: string;
  description: string;
  tags: string[];
  dateAdded: string;
  priceHistory: PricePoint[];
  viewsCount: number;
}

export interface CartItem {
  card: SportsCard;
  addedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller';
  senderName: string;
  timestamp: string;
  text: string;
  cardId?: string;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined' | 'countered';
}

export interface ChatThread {
  id: string;
  cardId: string;
  cardTitle: string;
  cardImage: string;
  cardPrice: number;
  sellerName: string;
  sellerReputation: string;
  unreadCount: number;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  type: 'price_drop' | 'new_listing' | 'offer_received' | 'escrow_update' | 'sync';
  title: string;
  message: string;
  cardId?: string;
  timestamp: string;
  read: boolean;
  linkText?: string;
}

export interface CollectorReview {
  id: string;
  reviewerName: string;
  avatar?: string;
  rating: number; // 1-5
  date: string;
  verifiedPurchase: boolean;
  cardPurchased: string;
  comment: string;
  categories: {
    itemAccuracy: number;
    shippingProtection: number;
    communication: number;
  };
}

export interface OrderRecord {
  orderId: string;
  date: string;
  items: SportsCard[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  escrowStatus: 'Held in Escrow' | 'Vault Verified' | 'Dispatched' | 'Completed';
  authenticityCertificateId: string;
  trackingNumber: string;
  paymentProcessor?: 'Square' | 'Escrow Vault';
  squareReceiptNumber?: string;
  squarePaymentId?: string;
  cardBrand?: string;
  cardLast4?: string;
}
