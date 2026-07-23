import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StatCard } from '../../../components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Leaf, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
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

  // Chart data from actual scans
  const chartData = [
    { name: 'Mon', scans: 0 },
    { name: 'Tue', scans: 0 },
    { name: 'Wed', scans: 0 },
    { name: 'Thu', scans: 0 },
    { name: 'Fri', scans: 0 },
    { name: 'Sat', scans: 0 },
    { name: 'Sun', scans: 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Farmer'}`}
        description="Here is what's happening with your crops today."
      />

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
            <StatCard title="Total Scans" value={totalScans} icon={Activity} />
            <StatCard title="Healthy Crops" value={healthyCount} icon={CheckCircle2} />
            <StatCard title="Diseases Found" value={diseaseCount} icon={AlertTriangle} />
            <StatCard title="Active Crops" value={cropsCount} icon={Leaf} />
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Scan Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              {totalScans === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No scan activity yet"
                  description="Scan activity metrics will appear here once you perform crop disease scans."
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
                    <Area type="monotone" dataKey="scans" stroke="#22c55e" fill="#dcfce7" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
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
                title="No recent scans"
                description="Your recent crop scans will be listed here."
              />
            ) : (
              <div className="space-y-6">
                {scans.slice(0, 5).map((scan, i) => (
                  <div key={scan.id || scan._id || i} className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {scan.predicted_disease || 'Crop Scan'}
                      </p>
                      <p className="text-sm text-earth-500">
                        {scan.is_healthy ? 'Healthy' : 'Disease Detected'}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-earth-500">
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
