import React from 'react';
import { ShieldCheck, Lock, Award, Heart } from 'lucide-react';
import { useCardStore } from '../context/CardStoreContext';

export const Footer: React.FC = () => {
  const { 
    setIsReviewsOpen, 
    setIsInventoryOpen, 
    setIsOfflineVaultOpen, 
    setIsAISearchOpen 
  } = useCardStore();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080c14] text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Personal Collection Statement */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white font-display">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              <span>The Stash Card Company</span>
              <span className="text-xs font-mono text-amber-500 font-normal">(@theStashCardCo)</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Personal collector stash & vault established in 2018. Curating high-grade PSA, BGS, and vintage sports cards with 100% authenticity certification.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              Collection & Vault
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#collection" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  All Graded Slabs
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setIsAISearchOpen(true)}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  AI Card Discovery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsInventoryOpen(true)}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Inventory Management
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsOfflineVaultOpen(true)}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Offline Binder Cache
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Escrow Guarantee */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              Trade Security
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setIsReviewsOpen(true)}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Collector Reviews (99.8%)
                </button>
              </li>
              <li>
                <span className="text-slate-500">100% Escrow Hold Policy</span>
              </li>
              <li>
                <span className="text-slate-500">PSA & BGS Database Verification</span>
              </li>
              <li>
                <span className="text-slate-500">Armored Tamper-Proof Courier</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Authentication Notice */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
              Authenticity Shield
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Counterfeit Guarantee</span>
              </div>
              Every card is encapsulated in tamper-evident acrylic slabs and backed by a full money-back escrow guarantee.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} The Stash Card Company (theStashCardCo). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Square Credit Card Processing</span>
            <span>·</span>
            <span>PSA Registry Certified</span>
            <span>·</span>
            <span>Beckett BGS Member</span>
            <span>·</span>
            <span>Bank-Grade Escrow</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
