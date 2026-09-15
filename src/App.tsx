/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { WorkPage } from './pages/WorkPage';
import { AboutPage } from './pages/AboutPage';
import { StartProjectPage } from './pages/StartProjectPage';
import { ClientPortalPage } from './pages/ClientPortalPage';
import { AdminPage } from './pages/AdminPage';
import { WorkWithUsPage } from './pages/WorkWithUsPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPages } from './pages/LegalPages';
import { trackPageView } from './services/analytics';

export default function App() {
  // Simple, robust client-side route state that syncs with window.location
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath());

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    trackPageView(currentPath);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Route Dispatcher
  const renderContent = () => {
    // Service Detail routes: /services/:slug
    if (currentPath.startsWith('/services/') && currentPath.length > '/services/'.length) {
      const slug = currentPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} navigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
      case '':
        return <HomePage navigate={navigate} />;
      case '/services':
        return <ServicesPage navigate={navigate} />;
      case '/work':
        return <WorkPage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/start-project':
        return <StartProjectPage navigate={navigate} />;
      case '/portal':
        return <ClientPortalPage navigate={navigate} />;
      case '/admin':
        return <AdminPage navigate={navigate} />;
      case '/work-with-us':
        return <WorkWithUsPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/privacy':
        return <LegalPages type="privacy" navigate={navigate} />;
      case '/terms':
        return <LegalPages type="terms" navigate={navigate} />;
      case '/refund-policy':
        return <LegalPages type="refund" navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#14110F] selection:bg-[#E85226] selection:text-white font-sans antialiased">
      <Navbar currentPath={currentPath} navigate={navigate} />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}
