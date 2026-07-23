import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useToast } from '../../../hooks/useToast';
import { cropsService } from '../../../services/cropsService';
import { Leaf, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Crop {
  _id: string;
  id?: string;
  name: string;
  scientific_name?: string;
  description?: string;
  is_active: boolean;
  disease_count?: number;
}

export default function CropsPage() {
  useDocumentTitle('Crop Library');

  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadCrops = async () => {
      try {
        const res = await cropsService.getAll(false);
        if (isMounted) setCrops(res.data || []);
      } catch (err: any) {
        if (isMounted) toast.error('Failed to load crops', err.response?.data?.message || 'Server error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCrops();
    return () => { isMounted = false; };
  }, []);

  const filteredCrops = crops.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.scientific_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crop Library"
        description="Explore agricultural crops, their scientific profiles, and associated disease monitors."
        actions={
          <SearchInput
            placeholder="Search crops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        }
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : filteredCrops.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No crops found"
          description={search ? "No crops matching your search criteria." : "No crops available in the library yet."}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCrops.map((crop) => (
            <Card key={crop._id || crop.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-50 rounded-lg text-primary-600">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{crop.name}</CardTitle>
                      {crop.scientific_name && (
                        <p className="text-xs italic text-earth-500">{crop.scientific_name}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={crop.is_active ? 'success' : 'neutral'}>
                    {crop.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-earth-600 line-clamp-3">
                  {crop.description || 'No description provided for this crop.'}
                </p>
                <div className="pt-2 border-t border-earth-100 flex items-center justify-between text-xs text-earth-500">
                  <span>Monitored Profile</span>
                  <Link
                    to={`/diseases?crop_id=${crop._id || crop.id}`}
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    View Diseases &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
