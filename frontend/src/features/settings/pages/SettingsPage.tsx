import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useTheme } from '../../../hooks/useTheme';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { useToast } from '../../../hooks/useToast';
import { Moon, Sun, Monitor, Wifi, Globe, Smartphone, Download } from 'lucide-react';

export default function SettingsPage() {
  useDocumentTitle('Settings');
  const { t } = useLanguage();
  const stgT = t.settings;
  const toast = useToast();

  const { theme, setTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (isInstalled) {
      toast.info('Already Installed', 'AgriLens is already installed as a standalone PWA.');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast.success('Installation Started', 'AgriLens has been added to your device.');
      }
      setDeferredPrompt(null);
    } else {
      toast.info(
        'Install via Browser Menu',
        'Click the Install icon in your browser URL bar or select "Install AgriLens / Add to Home Screen" from the browser menu.'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title={stgT.title}
        description={stgT.description}
      />

      <div className="space-y-6">
        {/* PWA Mobile App Installation Banner */}
        <Card className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white border-0 shadow-md">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-amber-300" />
                Progressive Web App (PWA) Mobile Install
              </div>
              <h3 className="text-lg font-black text-white">Install AgriLens on Home Screen</h3>
              <p className="text-xs text-emerald-100 max-w-xl">
                AgriLens can be installed directly onto your Android, iPhone, or Desktop home screen as a standalone offline mobile application.
              </p>
            </div>

            <Button
              onClick={handleInstallPWA}
              disabled={isInstalled}
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs px-5 py-3 shadow-md flex-shrink-0"
            >
              <Download className="w-4 h-4 mr-2 text-emerald-700" />
              {isInstalled ? 'App Installed ✓' : 'Install Mobile App'}
            </Button>
          </CardContent>
        </Card>

        {/* Language Selection Card */}
        <Card className="border-earth-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-earth-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" /> Platform Preferred Language
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-xs text-earth-700 font-medium">Select global language for full site translation & voice AI:</span>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        {/* Theme Preferences */}
        <Card className="border-earth-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-earth-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" /> {stgT.appearance}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id as any)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${theme === item.id
                      ? 'border-primary-600 bg-primary-50/50 text-primary-700 font-bold ring-2 ring-primary-500'
                      : 'border-earth-200 bg-white dark:bg-slate-800 hover:bg-earth-50 text-earth-700 dark:text-slate-200'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network & PWA Status */}
        <Card className="border-earth-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-earth-900 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-teal-600" /> Connectivity & PWA Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-earth-50 dark:bg-slate-800 rounded-lg text-xs">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-earth-600" />
                <div>
                  <p className="font-bold text-earth-900 dark:text-white">Network Status</p>
                  <p className="text-[11px] text-earth-500">Real-time connection monitor</p>
                </div>
              </div>
              <Badge variant={isOnline ? 'success' : 'danger'}>
                {isOnline ? '🟢 Online' : '🔴 Offline Field Mode Active'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-earth-50 dark:bg-slate-800 rounded-lg text-xs">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-earth-600" />
                <div>
                  <p className="font-bold text-earth-900 dark:text-white">Progressive Web App (PWA)</p>
                  <p className="text-[11px] text-earth-500">Service worker & offline cache active</p>
                </div>
              </div>
              <Badge variant="success">Active (Offline Ready)</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
