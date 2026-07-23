import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../hooks/useToast';
import { scansService } from '../../../services/scansService';
import { History, Leaf, WifiOff, Clock, Smartphone } from 'lucide-react';

interface Scan {
  _id: string;
  id?: string;
  crop_id: string;
  image_url: string;
  predicted_disease?: string;
  confidence?: number;
  model_version?: string;
  prediction_time_ms?: number;
  offline_mode?: boolean;
  device_type?: string;
  created_at?: string;
}

export default function ScanHistoryPage() {
  useDocumentTitle('Scan History Logs');

  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadScans = async () => {
      try {
        const res = await scansService.getAll(50, 0);
        if (isMounted) setScans(res.data || []);
      } catch (err: any) {
        if (isMounted) toast.error('Failed to load scan history', err.response?.data?.message || 'Server error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadScans();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scan History Logs"
        description="Historical log of field scans, disease predictions, offline status, and inference diagnostics."
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : scans.length === 0 ? (
        <EmptyState
          icon={History}
          title="No scan history available"
          description="Your scan history will be logged here once you submit crop leaf imagery for analysis."
        />
      ) : (
        <div className="space-y-4">
          {scans.map((scan) => (
            <Card
              key={scan._id || scan.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedScan(scan)}
            >
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-900 text-base">
                      {scan.predicted_disease || 'Crop Diagnosis'}
                    </h4>
                    <p className="text-xs text-earth-500 mt-0.5">
                      Logged on {scan.created_at ? new Date(scan.created_at).toLocaleString() : 'Recent'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {scan.offline_mode && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <WifiOff className="w-3 h-3" /> Offline
                    </Badge>
                  )}
                  <Badge variant="neutral">v{scan.model_version || '0.0.0'}</Badge>
                  <span className="text-sm font-medium text-primary-600 hover:underline">Details &rarr;</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedScan && (
        <Modal
          isOpen={!!selectedScan}
          onClose={() => setSelectedScan(null)}
          title="Scan Metadata Details"
        >
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-earth-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-earth-500">Scan ID:</span>
                <span className="font-mono text-xs text-earth-800">{selectedScan._id || selectedScan.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Prediction:</span>
                <span className="font-medium text-earth-900">{selectedScan.predicted_disease || 'Pending Inference'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Model Version:</span>
                <span>{selectedScan.model_version || '0.0.0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Inference Time:</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-earth-400" />
                  {selectedScan.prediction_time_ms || 0} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Device Type:</span>
                <span className="flex items-center gap-1 capitalize">
                  <Smartphone className="w-3.5 h-3.5 text-earth-400" />
                  {selectedScan.device_type || 'web'}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
