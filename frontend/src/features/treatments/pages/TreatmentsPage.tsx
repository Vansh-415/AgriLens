import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useToast } from '../../../hooks/useToast';
import { treatmentsService } from '../../../services/treatmentsService';
import { ShieldCheck, Pill, Sprout, Activity } from 'lucide-react';

interface Treatment {
  _id: string;
  id?: string;
  name: string;
  description: string;
  type: 'chemical' | 'organic' | 'biological';
  dosage?: string;
  frequency?: string;
  precautions?: string;
  is_active: boolean;
}

export default function TreatmentsPage() {
  useDocumentTitle('Treatment Protocols');

  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'chemical' | 'organic' | 'biological'>('all');
  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadTreatments = async () => {
      try {
        const res = await treatmentsService.getAll(false);
        if (isMounted) setTreatments(res.data || []);
      } catch (err: any) {
        if (isMounted) toast.error('Failed to load treatments', err.response?.data?.message || 'Server error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadTreatments();
    return () => { isMounted = false; };
  }, []);

  const filtered = treatments.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || t.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'organic':
        return <Sprout className="w-5 h-5 text-green-600" />;
      case 'biological':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      default:
        return <Pill className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'organic':
        return <Badge variant="success">Organic</Badge>;
      case 'biological':
        return <Badge variant="neutral">Biological</Badge>;
      default:
        return <Badge variant="info">Chemical</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Treatment Protocol Index"
        description="Validated curative solutions, dosage guidance, and precautions categorized by intervention type."
        actions={
          <SearchInput
            placeholder="Search treatments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        }
      />

      {/* Filter Tabs */}
      <div className="flex border-b border-earth-200 gap-6">
        {(['all', 'chemical', 'organic', 'biological'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
              activeTab === tab ? 'text-primary-700 border-b-2 border-primary-600' : 'text-earth-500 hover:text-earth-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No treatments found"
          description={search ? 'No protocols match your search query.' : 'No treatment protocols available in this category.'}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((treatment) => (
            <Card key={treatment._id || treatment.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-earth-100 rounded-lg">{getTypeIcon(treatment.type)}</div>
                    <CardTitle className="text-lg">{treatment.name}</CardTitle>
                  </div>
                  {getTypeBadge(treatment.type)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-earth-600">{treatment.description}</p>

                {treatment.dosage && (
                  <div className="text-xs bg-earth-50 p-2.5 rounded-lg space-y-1">
                    <div>
                      <span className="font-semibold text-earth-800">Dosage: </span>
                      <span className="text-earth-600">{treatment.dosage}</span>
                    </div>
                    {treatment.frequency && (
                      <div>
                        <span className="font-semibold text-earth-800">Frequency: </span>
                        <span className="text-earth-600">{treatment.frequency}</span>
                      </div>
                    )}
                  </div>
                )}

                {treatment.precautions && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="font-semibold">Precaution: </span>
                    {treatment.precautions}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
