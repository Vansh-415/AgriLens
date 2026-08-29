import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { useToast } from '../../../hooks/useToast';
import { Moon, Sun, Monitor, Wifi, Globe, Smartphone, Download, GraduationCap, ArrowRight } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useLanguage();
  const stgT = t.settings;
  useDocumentTitle(stgT.title);
  const toast = useToast();

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
                {stgT.pwaInstallTitle}
              </div>
              <h3 className="text-lg font-black text-white">{stgT.pwaInstallHeading}</h3>
              <p className="text-xs text-emerald-100 max-w-xl">
                {stgT.pwaInstallDesc}
              </p>
            </div>

            <Button
              onClick={handleInstallPWA}
              disabled={isInstalled}
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs px-5 py-3 shadow-md flex-shrink-0"
            >
              <Download className="w-4 h-4 mr-2 text-emerald-700" />
              {isInstalled ? stgT.appInstalled : stgT.installApp}
            </Button>
          </CardContent>
        </Card>

        {/* Language Selection Card */}
        <Card className="border-earth-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-earth-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" /> {stgT.preferredLanguage}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-xs text-earth-700 font-medium">{stgT.languageSelectDesc}</span>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        {/* Theme Preferences */}
        {/* Dark mode temporarily disabled post-login — pending full token audit */}
        <Card className="border-earth-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-earth-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" /> {stgT.appearance}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'light', label: stgT.light, icon: Sun },
                { id: 'dark', label: stgT.dark, icon: Moon },
                { id: 'system', label: stgT.system, icon: Monitor },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    // Dark mode temporarily disabled post-login — pending full token audit
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${item.id === 'light'
                    ? 'border-primary-600 bg-primary-50/50 text-primary-700 font-bold ring-2 ring-primary-500'
                    : 'border-earth-200 bg-white hover:bg-earth-50 text-earth-700 opacity-60'
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
              <Wifi className="w-5 h-5 text-teal-600" /> {stgT.connectivityStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-earth-50 dark:bg-slate-800 rounded-lg text-xs">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-earth-600" />
                <div>
                  <p className="font-bold text-earth-900 dark:text-white">{stgT.networkStatus}</p>
                  <p className="text-[11px] text-earth-500">{stgT.networkMonitorDesc}</p>
                </div>
              </div>
              <Badge variant={isOnline ? 'success' : 'danger'}>
                {isOnline ? stgT.online : stgT.offline}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-earth-50 dark:bg-slate-800 rounded-lg text-xs">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-earth-600" />
                <div>
                  <p className="font-bold text-earth-900 dark:text-white">{stgT.pwaTitle}</p>
                  <p className="text-[11px] text-earth-500">{stgT.pwaCacheDesc}</p>
                </div>
              </div>
              <Badge variant="success">{stgT.pwaActive}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Academic Transparency & Data Sources Card */}
        <Card className="border-earth-200 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold text-earth-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-700" /> Academic Project & Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-earth-600 leading-relaxed font-normal">
              AgriLens is built as an academic engineering project. View government registries (CIBRC), ICAR-CICR crop protection advisories, and peer-reviewed scientific literature citations supporting all disease diagnostics and chemical dosage calculations.
            </p>
            <div className="pt-1">
              <Link
                to="/references"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <span>View Data Sources & References</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
