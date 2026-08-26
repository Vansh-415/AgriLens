import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AgriLensLogo } from '../components/ui/AgriLensLogo';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { AgriChatbotWidget } from '../features/chatbot/components/AgriChatbotWidget';
import {
  Menu,
  X,
  LayoutDashboard,
  Search,
  History,
  Settings as SettingsIcon,
  LogOut,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  Bot,
  User,
  Shield,
  Sun,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function MainLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Dark mode temporarily disabled post-login — pending full token audit
  const toggleTheme = () => {
    // No-op: Light mode strictly enforced
  };

  const navigation = [
    { name: t.nav.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.detect, href: '/detect', icon: Search },
    { name: t.nav.history, href: '/history', icon: History },
    { name: t.nav.crops, href: '/crops', icon: BookOpen },
    { name: t.nav.diseases, href: '/diseases', icon: AlertTriangle },
    { name: t.nav.treatments, href: '/treatments', icon: ShieldCheck },
    { name: t.nav.assistant, href: '/assistant', icon: Bot },
    { name: t.nav.profile, href: '/profile', icon: User },
    { name: t.nav.settings, href: '/settings', icon: SettingsIcon },
    ...(user?.role === 'admin' ? [{ name: t.nav.admin, href: '/admin', icon: Shield }] : []),
  ];

  return (
    <div className="min-h-screen bg-earth-50 text-earth-900 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-earth-200 h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-earth-600 hover:text-earth-900 rounded-lg hover:bg-earth-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 group min-h-[44px]">
            <AgriLensLogo size="md" />
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* 3-Language Selector Dropdown (EN / HI / MR) */}
          <LanguageSwitcher />

          {/* Quick Theme Toggle Button */}
          {/* Dark mode temporarily disabled post-login — pending full token audit */}
          <button
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-earth-600 hover:text-earth-900 hover:bg-earth-100 rounded-lg transition-colors cursor-default"
            title="Theme Mode (Light)"
            aria-label="Theme mode"
          >
            <Sun className="h-5 w-5 text-amber-500" />
          </button>

          <Link to="/profile" className="hidden md:flex flex-col items-end mr-1 hover:opacity-80 transition-opacity min-h-[44px] justify-center">
            <span className="text-sm font-medium leading-none">{user?.full_name}</span>
            <span className="text-xs text-earth-500 mt-1 capitalize">{user?.role}</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="min-h-[44px] min-w-[44px] px-2.5 text-earth-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4 sm:mr-1.5 flex-shrink-0" />
            <span className="hidden sm:inline">{t.common.logout}</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar (visible >= 768px) */}
        <aside className="hidden md:block w-64 bg-white border-r border-earth-200 flex-shrink-0 p-4 space-y-1">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 min-h-[44px] text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-bold'
                      : 'text-earth-700 hover:bg-earth-100 hover:text-earth-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'flex-shrink-0 -ml-1 mr-3 h-5 w-5',
                      isActive ? 'text-primary-700' : 'text-earth-400 group-hover:text-earth-600'
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Slide-in Drawer (< 768px) */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Semi-transparent Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 md:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />

              {/* Slide-in Drawer */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col md:hidden border-r border-earth-200"
              >
                {/* Drawer Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-earth-200 bg-earth-50/50 flex-shrink-0">
                  <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
                    <AgriLensLogo size="md" />
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-earth-500 hover:text-earth-900 hover:bg-earth-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* User Info Tile inside Drawer */}
                {user && (
                  <div className="px-4 py-3 bg-earth-50 border-b border-earth-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-sm">
                      {user.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-earth-900 truncate">{user.full_name}</p>
                      <p className="text-[11px] text-earth-500 capitalize">{user.role || 'Farmer'}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 space-y-1.5 p-3.5 overflow-y-auto">
                  {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'group flex items-center px-3.5 py-3 min-h-[44px] text-sm font-semibold rounded-xl transition-all',
                          isActive
                            ? 'bg-primary-600 text-white shadow-xs font-bold'
                            : 'text-earth-700 hover:bg-earth-100 hover:text-earth-900'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'flex-shrink-0 mr-3 h-5 w-5',
                            isActive ? 'text-white' : 'text-earth-500 group-hover:text-earth-700'
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Drawer Footer with Logout */}
                <div className="p-3.5 border-t border-earth-200 bg-earth-50/50 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors border border-red-200 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.common.logout}</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* Global AI Agronomist Quick Floating Widget */}
      <AgriChatbotWidget />

      <Footer />
    </div>
  );
}
