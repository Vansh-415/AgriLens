import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useTheme } from '../../../hooks/useTheme';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { Moon, Sun, Monitor, Wifi, Globe, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  useDocumentTitle('Settings');

  const { theme, setTheme } = useTheme();
  const isOnline = useOnlineStatus();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Application Settings"
        description="Configure interface themes, network connectivity indicators, and PWA capabilities."
      />

      <div className="space-y-6">
        {/* Theme Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance & Theme</CardTitle>
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
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    theme === item.id
                      ? 'border-primary-600 bg-primary-50/50 text-primary-700 font-semibold ring-2 ring-primary-500'
                      : 'border-earth-200 bg-white hover:bg-earth-50 text-earth-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network & PWA Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connectivity & PWA Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-earth-600" />
                <div>
                  <p className="text-sm font-medium text-earth-900">Network State</p>
                  <p className="text-xs text-earth-500">Live internet connection detector</p>
                </div>
              </div>
              <Badge variant={isOnline ? 'success' : 'danger'}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-earth-600" />
                <div>
                  <p className="text-sm font-medium text-earth-900">Progressive Web App (PWA)</p>
                  <p className="text-xs text-earth-500">Offline caching service worker enabled</p>
                </div>
              </div>
              <Badge variant="neutral">Active v1.3.0</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-earth-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-earth-600" />
                <div>
                  <p className="text-sm font-medium text-earth-900">Default Locale</p>
                  <p className="text-xs text-earth-500">English (US)</p>
                </div>
              </div>
              <span className="text-xs font-mono text-earth-500">en-US</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
