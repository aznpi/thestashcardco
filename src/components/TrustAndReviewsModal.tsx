import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  Award, 
  MessageSquare, 
  Lock, 
  CheckCircle,
  Plus
} from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';

export const TrustAndReviewsModal: React.FC = () => {
  const {
    isReviewsOpen,
    setIsReviewsOpen,
    reviews,
    addReview,
  } = useCardStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [cardPurchased, setCardPurchased] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isReviewsOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !comment) return;

    addReview({
      reviewerName,
      rating,
      verifiedPurchase: true,
      cardPurchased: cardPurchased || '1986 Fleer Michael Jordan PSA 9',
      comment,
      categories: {
        itemAccuracy: rating,
        shippingProtection: 5.0,
        communication: rating >= 4 ? 5.0 : 4.0,
      }
    });

    setShowAddForm(false);
    setReviewerName('');
    setCardPurchased('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Collector Trust Profile & Trade Security Ratings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified Escrow Transactions & Numismatic Authentication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rate a Trade</span>
            </button>

            <button
              onClick={() => setIsReviewsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trust Metrics Bar */}
        <div className="p-6 bg-slate-50/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg font-mono-nums">
              99.8%
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Positive Feedback</div>
              <div className="text-[11px] text-slate-500">168 Certified Escrow Trades</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg font-mono-nums">
              5.0★
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Slab Authenticity</div>
              <div className="text-[11px] text-slate-500">100% Grader Cert Accuracy</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg font-mono-nums">
              &lt;24h
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Armored Dispatch</div>
              <div className="text-[11px] text-slate-500">Crush-proof Insured Courier</div>
            </div>
          </div>
        </div>

        {/* Body Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {showAddForm && (
            <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Submit Trade Rating & Review
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Your Collector Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. David Miller (PSA Collector)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Card Acquired / Inquired
                  </label>
                  <input
                    type="text"
                    value={cardPurchased}
                    onChange={(e) => setCardPurchased(e.target.value)}
                    placeholder="e.g. 2018 Shohei Ohtani Bowman Chrome Auto"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="cursor-pointer text-amber-500"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-500' : 'text-slate-400'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Review & Trade Experience *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Detail condition accuracy, packaging, communication, and escrow experience..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          )}

          {/* Review List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Collector Testimonials ({reviews.length})
            </h4>

            {reviews.map(rev => (
              <div
                key={rev.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {rev.reviewerName}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified Escrow Purchase</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    · Acquired: <strong className="text-slate-700 dark:text-slate-300">{rev.cardPurchased}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                  <span>Accuracy: {rev.categories.itemAccuracy}.0/5.0</span>
                  <span>Packaging: {rev.categories.shippingProtection}.0/5.0</span>
                  <span>Communication: {rev.categories.communication}/5.0</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
