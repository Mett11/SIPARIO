import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';
import { CookiePreferencesBanner } from './components/ui/CookiePreferencesBanner';
import { HomePage } from './pages/HomePage';
import { CompagniaPage } from './pages/CompagniaPage';
import { SpettacoliPage } from './pages/SpettacoliPage';
import { DettaglioSpettacoloPage } from './pages/DettaglioSpettacoloPage';
import { CalendarioPage } from './pages/CalendarioPage';
import { BlogPage } from './pages/BlogPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContattiPage } from './pages/ContattiPage';
import { PrenotaPage } from './pages/PrenotaPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { TheatreRepository } from './lib/repository';
import { SiteConfig, UserPreferences } from './types';

import { RealisticSipario } from './components/ui/RealisticSipario';

// ScrollToTop Helper component on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Discrete Page Transition Component (Sipario/Curtain Effect)
function AnimatedRoutes({
  preferences,
}: {
  preferences: UserPreferences;
}) {
  const location = useLocation();
  const isReducedMotion = preferences.reducedMotion;

  if (isReducedMotion) {
    return (
      <Routes location={location}>
        <Route path="/" element={<HomePage userPreferences={preferences} />} />
        <Route path="/compagnia" element={<CompagniaPage />} />
        <Route path="/spettacoli" element={<SpettacoliPage />} />
        <Route path="/spettacoli/:slug" element={<DettaglioSpettacoloPage />} />
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contatti" element={<ContattiPage />} />
        <Route path="/prenota" element={<PrenotaPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className="w-full h-full flex-1 relative flex flex-col">
        <RealisticSipario>
          <Routes location={location}>
            <Route path="/" element={<HomePage userPreferences={preferences} />} />
            <Route path="/compagnia" element={<CompagniaPage />} />
            <Route path="/spettacoli" element={<SpettacoliPage />} />
            <Route path="/spettacoli/:slug" element={<DettaglioSpettacoloPage />} />
            <Route path="/calendario" element={<CalendarioPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contatti" element={<ContattiPage />} />
            <Route path="/prenota" element={<PrenotaPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </RealisticSipario>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    name: 'Il Sipario – Compagnia Teatrale A.P.S.',
    address: 'Via Antonino Uccello 6, Canicattini Bagni (SR)',
    phone: '+39 339 492 3772',
    email: 'ilsipariocompagniateatrale@gmail.com',
    facebookUrl: 'https://www.facebook.com/ilsipariocanicattinibagni/',
    instagramUrl: 'https://www.instagram.com/compagnia_ilsipario/',
    youtubeUrl: 'https://www.youtube.com/channel/UC9CEjFQvC9LgSfypbaP5LfA',
    city: 'Canicattini Bagni (SR)',
    toneOfVoice: [],
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('sipario_user_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    return {
      reducedMotion: prefersReducedMotion,
      quality3d: 'medium',
      cookieConsent: false,
    };
  });

  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  useEffect(() => {
    TheatreRepository.getSiteConfig().then((cfg) => setSiteConfig(cfg));
  }, []);

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('sipario_user_preferences', JSON.stringify(next));
      return next;
    });
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#050505] text-[#FFFFFF]">
        <Routes>
          {/* Admin Route Layout (Standalone) */}
          <Route path="/admin/*" element={<AdminDashboardPage />} />

          {/* Public Pages Layout */}
          <Route
            path="*"
            element={
              <PublicLayout
                siteConfig={siteConfig}
                preferences={preferences}
                onOpenPreferencesModal={() => setIsPreferencesModalOpen(true)}
              >
                <AnimatedRoutes preferences={preferences} />
              </PublicLayout>
            }
          />
        </Routes>

        {/* Global Accessibility & Cookie Preferences Banner/Modal */}
        <CookiePreferencesBanner
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
          isOpenModal={isPreferencesModalOpen}
          onCloseModal={() => setIsPreferencesModalOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

// Public Layout Container
function PublicLayout({
  children,
  siteConfig,
  preferences,
  onOpenPreferencesModal,
}: {
  children: React.ReactNode;
  siteConfig: SiteConfig;
  preferences: UserPreferences;
  onOpenPreferencesModal: () => void;
}) {
  return (
    <>
      <Header
        siteName={siteConfig.name}
        userPreferences={preferences}
        onTogglePreferences={onOpenPreferencesModal}
      />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer siteConfig={siteConfig} />
    </>
  );
}
