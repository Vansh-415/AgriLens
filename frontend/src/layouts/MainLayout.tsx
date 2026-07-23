import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import {
  Menu,
  X,
  Leaf,
  LayoutDashboard,
  Search,
  History,
  Settings as SettingsIcon,
  LogOut,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  User,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Detect Disease', href: '/detect', icon: Search },
    { name: 'Scan History', href: '/history', icon: History },
    { name: 'Crop Library', href: '/crops', icon: BookOpen },
    { name: 'Disease Index', href: '/diseases', icon: AlertTriangle },
    { name: 'Treatments', href: '/treatments', icon: ShieldCheck },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
    ...(user?.role === 'admin' ? [{ name: 'Admin Panel', href: '/admin', icon: Shield }] : []),
  ];

  return (
    <div className="min-h-screen bg-earth-50 text-earth-900 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-earth-200 h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-earth-600 hover:text-earth-900 rounded-md hover:bg-earth-100"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">AgriLens</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-earth-600 hover:text-earth-900 hover:bg-earth-100 rounded-lg transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-earth-600" />}
          </button>

          <Link to="/profile" className="hidden sm:flex flex-col items-end mr-1 hover:opacity-80 transition-opacity">
            <span className="text-sm font-medium leading-none">{user?.full_name}</span>
            <span className="text-xs text-earth-500 mt-1 capitalize">{user?.role}</span>
          </Link>

          <Button variant="ghost" size="sm" onClick={logout} className="text-earth-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-earth-200 bg-white">
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
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

        {/* Mobile Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-earth-900/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 flex flex-col lg:hidden"
              >
                <div className="h-16 flex items-center justify-between px-4 border-b border-earth-200">
                  <span className="font-bold text-xl tracking-tight">AgriLens</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-earth-500 hover:text-earth-900 hover:bg-earth-100 rounded-md"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                  {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'group flex items-center px-3 py-2.5 text-base font-medium rounded-md',
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-earth-700 hover:bg-earth-100 hover:text-earth-900'
                        )}
                      >
                        <item.icon className={cn('flex-shrink-0 -ml-1 mr-3 h-6 w-6', isActive ? 'text-primary-700' : 'text-earth-400 group-hover:text-earth-600')} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 lg:p-8 max-w-7xl mx-auto"
            >
              <Breadcrumbs />
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
}
