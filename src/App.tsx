/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CardStoreProvider } from './context/CardStoreContext';
import { Navbar } from './components/Navbar';
import { HeroShowcase } from './components/HeroShowcase';
import { CardGrid } from './components/CardGrid';
import { Footer } from './components/Footer';
import { CardDetailModal } from './components/CardDetailModal';
import { AISearchModal } from './components/AISearchModal';
import { InventoryManagerModal } from './components/InventoryManagerModal';
import { ChatModal } from './components/ChatModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TrustAndReviewsModal } from './components/TrustAndReviewsModal';
import { OfflineBinderModal } from './components/OfflineBinderModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';

export default function App() {
  return (
    <CardStoreProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar />
        <main className="flex-1">
          <HeroShowcase />
          <CardGrid />
        </main>
        <Footer />

        {/* Global Portals & Interactive Modals */}
        <CardDetailModal />
        <AISearchModal />
        <InventoryManagerModal />
        <ChatModal />
        <CheckoutModal />
        <TrustAndReviewsModal />
        <OfflineBinderModal />
        <NotificationCenterModal />
      </div>
    </CardStoreProvider>
  );
}
