import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Bell, RefreshCw, Download } from 'lucide-react';
import { AuthModal } from './auth/AuthModal';
import { UserMenu } from './UserMenu';
import { UserPreferences } from './UserPreferences';
import { SearchBar } from './SearchBar';
import { CategoryNav } from './CategoryNav';
import { Footer } from './Footer';
import { RegionSelector } from './RegionSelector';
import { OfflineArticles } from './OfflineArticles';
import { TopHeadlinesTTS } from './TopHeadlinesTTS';
import { useAuth } from '@/hooks/useAuth';
import { usePreferences } from '@/hooks/usePreferences';
import { useNews } from '@/hooks/useNews';
import type { Category } from '@/types/categories';
import type { RegionCode } from '@/types/regions';

interface LayoutProps {
  children: React.ReactNode;
  onCategorySelect: (category: Category) => void;
  selectedCategory: Category | undefined;
}

export function Layout({ children, onCategorySelect, selectedCategory }: LayoutProps) {
  const { user } = useAuth();
  const { preferences, updatePreferences } = usePreferences();
  const { articles, refreshNews, loading } = useNews();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isOfflineOpen, setIsOfflineOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleRegionChange = async (region: RegionCode) => {
    if (!preferences) return;
    await updatePreferences({ ...preferences, region });
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Control body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-background`}>
      {/* Header */}
      <header 
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-lg'
            : 'bg-white dark:bg-gray-800'
        }`}
      >
        <div className="px-4 lg:px-6">
          {/* Top Navigation Bar */}
          <div className="h-16 flex items-center justify-between border-b border-gray-200/80 dark:border-gray-700/80">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-secondary hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <a 
                href="/" 
                className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Samachar 2.0
              </a>
              <TopHeadlinesTTS articles={articles} />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              <RegionSelector 
                selectedRegion={preferences?.region as RegionCode || 'us'} 
                onRegionChange={handleRegionChange}
              />

              <button
                onClick={() => setIsOfflineOpen(true)}
                className="p-2 text-secondary hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 transition-colors"
                title="Saved articles"
              >
                <Download className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={refreshNews}
                disabled={loading}
                className="p-2 text-secondary hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Refresh news"
              >
                <RefreshCw className={`w-5 h-5 md:w-6 md:h-6 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button 
                className="p-2 text-secondary hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 text-secondary hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Moon className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </button>

              {user ? (
                <UserMenu onShowPreferences={() => setIsPreferencesOpen(true)} />
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white text-sm md:text-base rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="h-14 flex items-center">
            <SearchBar articles={articles} className="w-full max-w-3xl mx-auto" />
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-[280px] h-screen pt-20 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full px-4 pb-4 overflow-y-auto">
          <CategoryNav
            onSelect={(category) => {
              onCategorySelect(category);
              setIsSidebarOpen(false);
            }}
            selectedCategory={selectedCategory}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-[280px] transition-[margin] duration-300">
        <div className="container mx-auto px-4 py-32 md:py-36 max-w-7xl">
          {children}
        </div>
        <Footer />
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UserPreferences isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
      <OfflineArticles isOpen={isOfflineOpen} onClose={() => setIsOfflineOpen(false)} />
    </div>
  );
}