import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../hooks/useToast';
import { diseasesService } from '../../../services/diseasesService';
import { AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

interface Disease {
  _id: string;
  id?: string;
  crop_id: string;
  name: string;
  scientific_name?: string;
  description: string;
  symptoms: string[];
  treatment_ids: string[];
  prevention: string[];
  severity: 'low' | 'high' | 'critical';
  is_active: boolean;
}

export default function DiseasesPage() {
  useDocumentTitle('Disease Index');

  const [searchParams] = useSearchParams();
  const cropIdParam = searchParams.get('crop_id') || undefined;

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadDiseases = async () => {
      try {
        const res = await diseasesService.getAll(cropIdParam, false);
        if (isMounted) setDiseases(res.data || []);
      } catch (err: any) {
        if (isMounted) toast.error('Failed to load diseases', err.response?.data?.message || 'Server error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadDiseases();
    return () => { isMounted = false; };
  }, [cropIdParam]);

  const filteredDiseases = diseases.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.scientific_name?.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || d.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'high':
        return <Badge variant="warning">High Severity</Badge>;
      default:
        return <Badge variant="success">Low / Healthy</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Disease Library"
        description="Comprehensive catalog of crop pathologies, symptom vectors, and severity indexes."
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-10 px-3 text-sm bg-white border border-earth-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="low">Low / Healthy</option>
            </select>
            <SearchInput
              placeholder="Search diseases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
        }
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredDiseases.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No diseases found"
          description={search ? 'No pathologies matching your search parameters.' : 'No disease profiles registered yet.'}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDiseases.map((disease) => (
            <Card
              key={disease._id || disease.id}
              className="hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              onClick={() => setSelectedDisease(disease)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{disease.name}</CardTitle>
                    {disease.scientific_name && (
                      <p className="text-xs italic text-earth-500 mt-0.5">{disease.scientific_name}</p>
                    )}
                  </div>
                  {getSeverityBadge(disease.severity)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-earth-600 line-clamp-2">{disease.description}</p>
                {disease.symptoms && disease.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {disease.symptoms.slice(0, 3).map((sym, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-earth-100 text-earth-700 rounded-md">
                        {sym}
                      </span>
                    ))}
                    {disease.symptoms.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-earth-100 text-earth-500 rounded-md">
                        +{disease.symptoms.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div className="pt-3 border-t border-earth-100 flex items-center justify-between text-xs text-earth-500">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-primary-600" />
                    {disease.treatment_ids?.length || 0} Recommended Treatments
                  </span>
                  <span className="text-primary-600 font-medium hover:underline">Details &rarr;</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <Modal
          isOpen={!!selectedDisease}
          onClose={() => setSelectedDisease(null)}
          title={selectedDisease.name}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs italic text-earth-500">{selectedDisease.scientific_name}</span>
              {getSeverityBadge(selectedDisease.severity)}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-earth-900 mb-1">Description</h4>
              <p className="text-sm text-earth-600">{selectedDisease.description}</p>
            </div>

            {selectedDisease.symptoms?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-earth-900 mb-2">Identified Symptoms</h4>
                <ul className="space-y-1">
                  {selectedDisease.symptoms.map((symptom, i) => (
                    <li key={i} className="text-sm text-earth-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedDisease.prevention?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-earth-900 mb-2">Prevention & Best Practices</h4>
                <ul className="space-y-1">
                  {selectedDisease.prevention.map((prev, i) => (
                    <li key={i} className="text-sm text-earth-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {prev}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
