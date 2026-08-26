import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../hooks/useToast';
import { cropsService } from '../../../services/cropsService';
import { diseasesService } from '../../../services/diseasesService';
import { treatmentsService } from '../../../services/treatmentsService';
import { Plus, Trash2 } from 'lucide-react';

interface CropOption {
  _id: string;
  id?: string;
  name: string;
}

export default function AdminPage() {
  const { t } = useLanguage();
  const admT = t.admin;
  useDocumentTitle(admT.title);

  const [activeTab, setActiveTab] = useState<'crops' | 'diseases' | 'treatments'>('crops');
  const [dataList, setDataList] = useState<any[]>([]);
  const [cropsList, setCropsList] = useState<CropOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cropId: '',
    severity: 'high' as 'low' | 'high' | 'critical',
    treatmentType: 'chemical' as 'chemical' | 'organic' | 'biological',
  });

  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'crops') {
        const res = await cropsService.getAll(false);
        setDataList(res.data || []);
      } else if (activeTab === 'diseases') {
        const [disRes, cropRes] = await Promise.all([
          diseasesService.getAll(undefined, false),
          cropsService.getAll(false),
        ]);
        setDataList(disRes.data || []);
        setCropsList(cropRes.data || []);
      } else {
        const res = await treatmentsService.getAll(false);
        setDataList(res.data || []);
      }
    } catch (err: any) {
      toast.error('Failed to load admin records', err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'crops') {
        await cropsService.create({
          name: formData.name,
          description: formData.description,
          is_active: true,
        });
      } else if (activeTab === 'diseases') {
        const targetCropId = formData.cropId || (cropsList.length > 0 ? cropsList[0]._id || cropsList[0].id : '');
        await diseasesService.create({
          crop_id: targetCropId,
          name: formData.name,
          description: formData.description,
          severity: formData.severity,
          symptoms: [],
          treatment_ids: [],
          prevention: [],
        });
      } else {
        await treatmentsService.create({
          name: formData.name,
          description: formData.description,
          type: formData.treatmentType,
        });
      }
      toast.success('Record Created', `${formData.name} added successfully.`);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        description: '',
        cropId: '',
        severity: 'high',
        treatmentType: 'chemical',
      });
      loadData();
    } catch (err: any) {
      toast.error('Creation Failed', err.response?.data?.message || 'Server error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      if (activeTab === 'crops') await cropsService.delete(deleteId);
      else if (activeTab === 'diseases') await diseasesService.delete(deleteId);
      else await treatmentsService.delete(deleteId);

      toast.success('Record Deleted', 'Item removed successfully.');
      setDeleteId(null);
      loadData();
    } catch (err: any) {
      toast.error('Delete Failed', err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={admT.title}
        description={admT.description}
        actions={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {admT.addRecord} {activeTab.slice(0, -1)}
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-earth-200 gap-2 sm:gap-6 overflow-x-auto no-scrollbar flex-nowrap pb-1">
        {(['crops', 'diseases', 'treatments'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-2 text-xs sm:text-sm font-semibold capitalize whitespace-nowrap transition-colors min-h-[40px] flex items-center cursor-pointer ${
              activeTab === tab ? 'text-primary-700 border-b-2 border-primary-600 font-bold' : 'text-earth-500 hover:text-earth-900'
            }`}
          >
            {tab} {admT.management}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : dataList.length === 0 ? (
            <div className="p-8 text-center text-earth-500">{admT.noRecords}</div>
          ) : (
            <div className="divide-y divide-earth-100">
              {dataList.map((item) => (
                <div key={item._id || item.id} className="p-4 flex items-center justify-between hover:bg-earth-50/50">
                  <div>
                    <h4 className="font-semibold text-earth-900">{item.name}</h4>
                    <p className="text-xs text-earth-500">{item.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(item._id || item.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={admT.createRecord}
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label={admT.name}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label={t.common.viewDetails}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          {activeTab === 'diseases' && (
            <>
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium text-earth-800">{admT.associatedCrop}</label>
                <select
                  value={formData.cropId}
                  onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                  className="h-10 px-3 text-sm bg-white border border-earth-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {cropsList.map((crop) => (
                    <option key={crop._id || crop.id} value={crop._id || crop.id}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium text-earth-800">{t.common.severity}</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="h-10 px-3 text-sm bg-white border border-earth-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'treatments' && (
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium text-earth-800">{admT.treatmentType}</label>
              <select
                value={formData.treatmentType}
                onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value as any })}
                className="h-10 px-3 text-sm bg-white border border-earth-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="chemical">Chemical</option>
                <option value="organic">Organic</option>
                <option value="biological">Biological</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit">{admT.createRecord}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={admT.confirmDeletion}
        description={admT.deleteConfirmDesc}
        isDestructive
      />
    </div>
  );
}
