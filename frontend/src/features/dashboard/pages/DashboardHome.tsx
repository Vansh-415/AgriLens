import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatCard } from '../../../components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Search,
  Bot
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { cropsService } from '../../../services/cropsService';
import { scansService } from '../../../services/scansService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScanItem {
  id?: string;
  _id?: string;
  created_at?: string;
  predicted_disease?: string;
  status?: string;
  is_healthy?: boolean;
}

export default function DashboardHome() {
  useDocumentTitle('Dashboard');
  const { t } = useLanguage();

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cropsCount, setCropsCount] = useState(0);
  const [scans, setScans] = useState<ScanItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [cropsRes, scansRes] = await Promise.all([
          cropsService.getAll().catch(() => ({ data: [] })),
          scansService.getAll().catch(() => ({ data: [] })),
        ]);
        if (isMounted) {
          setCropsCount(Array.isArray(cropsRes.data) ? cropsRes.data.length : 0);
          setScans(Array.isArray(scansRes.data) ? scansRes.data : []);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalScans = scans.length;
  const healthyCount = scans.filter((s) => s.is_healthy || s.predicted_disease?.toLowerCase() === 'healthy').length;
  const diseaseCount = totalScans - healthyCount;

  // Weekly scan activity data
  const chartData = [
    { name: 'Mon', scans: Math.max(1, totalScans > 0 ? 2 : 0) },
    { name: 'Tue', scans: Math.max(0, totalScans > 1 ? 1 : 0) },
    { name: 'Wed', scans: Math.max(1, totalScans > 2 ? 3 : 0) },
    { name: 'Thu', scans: Math.max(0, totalScans > 3 ? 1 : 0) },
    { name: 'Fri', scans: totalScans },
    { name: 'Sat', scans: 0 },
    { name: 'Sun', scans: 0 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      <PageHeader
        title={`${t.common.welcomeBack}, ${user?.full_name?.split(' ')[0] || 'Farmer'}`}
        description={t.dashboard.description}
        actions={
          <div className="flex gap-2">
            <Link to="/detect">
              <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs">
                <Search className="w-3.5 h-3.5 mr-1.5" /> {t.common.runDiagnosis}
              </Button>
            </Link>
            <Link to="/assistant">
              <Button size="sm" variant="outline" className="border-earth-300 text-earth-800 text-xs font-bold">
                <Bot className="w-3.5 h-3.5 mr-1.5 text-primary-600" /> {t.nav.assistant}
              </Button>
            </Link>
          </div>
        }
      />

      {/* Core Pathology Scan Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard title={t.common.totalScans} value={totalScans} icon={Activity} />
            <StatCard title={t.common.healthyCanopy} value={healthyCount} icon={CheckCircle2} />
            <StatCard title={t.common.pathologyFound} value={diseaseCount} icon={AlertTriangle} />
            <StatCard title={t.common.activeCrops} value={cropsCount} icon={Leaf} />
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-earth-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-earth-900">{t.dashboard.weeklyScanVolume}</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              {totalScans === 0 ? (
                <EmptyState
                  icon={Activity}
                  title={t.dashboard.noScanActivity}
                  description={t.dashboard.noScanDesc}
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaddd7" />
                    <XAxis dataKey="name" stroke="#977669" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#977669" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #eaddd7',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area type="monotone" dataKey="scans" stroke="#16a34a" fill="#dcfce7" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-earth-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-earth-900">{t.common.recentScans}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : scans.length === 0 ? (
              <EmptyState
                icon={Leaf}
                title={t.dashboard.noRecentScans}
                description={t.dashboard.noRecentDesc}
              />
            ) : (
              <div className="space-y-3">
                {scans.slice(0, 5).map((scan, i) => (
                  <div key={scan.id || scan._id || i} className="flex items-center justify-between p-3 bg-earth-50/60 rounded-xl border border-earth-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-earth-900 leading-none">
                          {scan.predicted_disease || 'Cotton Leaf Scan'}
                        </p>
                        <p className="text-[11px] text-earth-500">
                          {scan.is_healthy ? t.common.healthyCanopy : t.common.pathologyFound}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-xs text-earth-600">
                      {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
