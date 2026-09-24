import React, { useState } from 'react';
import { 
  X, 
  Send, 
  DollarSign, 
  ShieldCheck, 
  Check, 
  ShoppingBag, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';

export const ChatModal: React.FC = () => {
  const {
    chatThreads,
    activeChatThreadId,
    setActiveChatThreadId,
    sendChatMessage,
    respondToOffer,
    setIsCartOpen,
    addToCart,
    cards,
  } = useCardStore();

  const [messageInput, setMessageInput] = useState('');
  const [offerInput, setOfferInput] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);

  if (!activeChatThreadId) return null;

  const currentThread = chatThreads.find(t => t.id === activeChatThreadId);
  if (!currentThread) return null;

  const associatedCard = cards.find(c => c.id === currentThread.cardId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendChatMessage(currentThread.id, messageInput);
    setMessageInput('');
  };

  const handleMakeOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(offerInput);
    if (!isNaN(amount) && amount > 0) {
      sendChatMessage(currentThread.id, `I'd like to submit an offer of $${amount.toLocaleString()} for this card.`, amount);
      setOfferInput('');
      setShowOfferForm(false);
    }
  };

  const quickQuestions = [
    'Can you provide high-res back scans?',
    'Is insured overnight shipping included?',
    'Will you take $1,000 under list price?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Chat Header: Thread Info & Embedded Card Summary */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentThread.cardImage}
              alt={currentThread.cardTitle}
              className="w-10 h-13 object-cover rounded-lg bg-slate-950 border border-slate-300 dark:border-slate-700 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentThread.sellerName}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {currentThread.sellerReputation}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                Negotiating: {currentThread.cardTitle} · Listed: <strong className="text-slate-900 dark:text-amber-400 font-mono-nums">${currentThread.cardPrice.toLocaleString()}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Make Offer</span>
            </button>

            <button
              onClick={() => setActiveChatThreadId(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Offer Form Overlay */}
        {showOfferForm && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center justify-between">
            <form onSubmit={handleMakeOffer} className="flex items-center gap-3 w-full">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                Submit Formal Offer:
              </span>
              <div className="relative flex-1 max-w-xs">
                <span className="absolute left-3 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  required
                  value={offerInput}
                  onChange={(e) => setOfferInput(e.target.value)}
                  placeholder={`e.g. ${Math.round(currentThread.cardPrice * 0.92)}`}
                  className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400 cursor-pointer whitespace-nowrap"
              >
                Send Offer
              </button>
              <button
                type="button"
                onClick={() => setShowOfferForm(false)}
                className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Chat Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          
          {/* Trust Banner inside Chat */}
          <div className="text-center py-2 px-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>theStashCardCo Escrow Protection Active. Never transfer funds outside the platform.</span>
          </div>

          {currentThread.messages.map(msg => {
            const isMe = msg.sender === 'buyer';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                  <span>{msg.senderName}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-amber-500 text-slate-950 rounded-br-none shadow-sm font-medium'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Offer Interactive Card Component if present */}
                  {msg.offerAmount && (
                    <div className="mt-3 p-3 bg-white/90 dark:bg-slate-950/80 rounded-xl border border-black/10 dark:border-white/10 text-slate-900 dark:text-white space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Offer Amount</span>
                        <span className="font-mono-nums text-sm text-amber-600 dark:text-amber-400">
                          ${msg.offerAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Status:</span>
                        <span className="font-semibold capitalize text-emerald-600 dark:text-emerald-400">
                          {msg.offerStatus || 'pending'}
                        </span>
                      </div>

                      {/* If seller sent counter-offer or offer accepted */}
                      {!isMe && msg.offerStatus === 'pending' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              respondToOffer(currentThread.id, msg.id, 'accepted');
                              if (associatedCard) {
                                addToCart({ ...associatedCard, price: msg.offerAmount! });
                                setIsCartOpen(true);
                                setActiveChatThreadId(null);
                              }
                            }}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept & Checkout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center gap-2 overflow-x-auto">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(currentThread.id, q)}
              className="text-[11px] px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message or inquiry to Marcus..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2.5 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 disabled:opacity-40 text-white dark:text-slate-950 rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
