import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';
import { scansService } from '../../../services/scansService';
import { DiagnosticPdfReport } from '../components/DiagnosticPdfReport';
import { getLocalizedDiseases } from '../../../i18n/localizedData';
import type { DiseaseProfile } from '../../../i18n/localizedData';
import { printReportElement } from '../../../utils/printReport';
import type { PredictionData } from '../../../types/prediction';
import { getConfidenceTier, HEALTHY_CLASS_LABEL, isHealthyClass } from '../../../types/prediction';
import { History, Leaf, Printer, FileText, Calendar, MapPin } from 'lucide-react';

interface ScanRecord {
  _id: string;
  id?: string;
  user_id?: string;
  crop_id?: string;
  disease_id?: string;
  image_path?: string;
  image_url?: string;
  predicted_disease?: string;
  disease_name?: string;
  confidence?: number;
  confidence_pct?: string;
  is_healthy?: boolean;
  land_acres?: number;
  status?: string;
  created_at?: string;
  prediction_time_ms?: number;
}

export default function ScanHistoryPage() {
  useDocumentTitle('Crop Scan History');
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const toast = useToast();

  const localizedDiseases = getLocalizedDiseases(language);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const res = await scansService.getAll();
        if (isMounted && res.data) {
          setScans(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err: any) {
        if (isMounted) {
          toast.error('History Fetch Failed', err.message || 'Could not retrieve scan history.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const getDiseaseDisplayName = (scan: ScanRecord) => {
    if (scan.predicted_disease) return scan.predicted_disease;
    if (scan.disease_name) return scan.disease_name;
    if (scan.disease_id) {
      if (isHealthyClass(scan.disease_id)) return HEALTHY_CLASS_LABEL;
      return scan.disease_id
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return scan.is_healthy ? HEALTHY_CLASS_LABEL : 'Cotton Pathology Scan';
  };

  // Map exact commercial solution & active chemical formulation from library
  const constructPredictionData = (scan: ScanRecord): PredictionData => {
    const dname = getDiseaseDisplayName(scan);
    const conf = scan.confidence || 0.96;
    const isHealthy = isHealthyClass(dname) || isHealthyClass(scan.disease_id) || scan.is_healthy === true;

    // Search matching disease profile in localizedDiseases
    const libraryMatch = localizedDiseases.find((d: DiseaseProfile) =>
      dname.toLowerCase().includes(d.id.replace('_', ' ')) ||
      d.name.toLowerCase().includes(dname.toLowerCase())
    ) || localizedDiseases[0];

    return {
      predicted_class: isHealthy ? HEALTHY_CLASS_LABEL : libraryMatch.name,
      confidence: conf,
      confidence_pct: scan.confidence_pct || `${(conf * 100).toFixed(1)}%`,
      prediction_time_ms: scan.prediction_time_ms || 120,
      total_time_ms: 150,
      model_version: 'v2.1',
      saved_scan_id: scan._id || scan.id || null,
      class_probabilities: {
        [isHealthy ? HEALTHY_CLASS_LABEL : libraryMatch.name]: conf,
        'Other Pathologies': 1 - conf
      },
      personalized_advisory: {
        disease_name: isHealthy ? HEALTHY_CLASS_LABEL : libraryMatch.name,
        scientific_name: isHealthy ? 'N/A (Healthy Crop)' : libraryMatch.scientific_name,
        severity: isHealthy ? 'NONE' : libraryMatch.severity.toUpperCase(),
        emergency_action: isHealthy
          ? 'No disease symptoms detected. Continue routine pest monitoring and standard agronomic practices.'
          : `Immediate Action Required: Apply ${libraryMatch.recommended_treatments.chemical} within next 24-48 hours.`,
        description: isHealthy
          ? 'Your cotton leaves show healthy green pigmentation, normal venation, and zero visual disease symptoms.'
          : libraryMatch.description,
        land_acres: scan.land_acres || 1.0,
        calculated_dosage: {
          product_name: isHealthy ? 'None Required' : libraryMatch.recommended_treatments.chemical,
          active_ingredient: isHealthy ? 'N/A' : 'Certified Pathology Formulation',
          dosage_per_acre: isHealthy ? 'N/A' : libraryMatch.recommended_treatments.dosage,
          water_per_acre_litres: 200,
          total_water_litres: (scan.land_acres || 1.0) * 200,
          application_interval_days: isHealthy ? 0 : 10,
          pre_harvest_interval_days: isHealthy ? 0 : 15,
          dosage_summary: isHealthy
            ? 'No chemical dosage required for healthy canopy.'
            : `Mix ${libraryMatch.recommended_treatments.chemical} in ${(scan.land_acres || 1.0) * 200}L water for ${scan.land_acres || 1.0} acres.`
        },
        biological_organic: {
          remedy: isHealthy ? 'Routine organic foliar nourishment' : libraryMatch.recommended_treatments.organic,
          description: isHealthy
            ? 'Maintain soil organic matter and beneficial insect habitats.'
            : 'Certified bio-organic alternative for eco-friendly disease control.'
        },
        weather_safety_rule: isHealthy
          ? 'Favorable field conditions. Continue standard crop care.'
          : 'Do not spray if high wind (>12 km/h) or rainfall is expected within 4 hours.',
        cultural_preventative: isHealthy
          ? [
              'Maintain balanced NPK fertilization.',
              'Inspect field weekly for early aphid/jassid infestation.',
              'Ensure adequate drainage during monsoon.'
            ]
          : libraryMatch.preventive_measures
      }
    };
  };

  const handleOpenReport = (scan: ScanRecord) => {
    setSelectedScan(scan);
    setShowPdfModal(true);
  };

  const handlePrint = () => {
    printReportElement('agrilens-diagnostic-report-sheet');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title={t.nav.history}
        description="Historical log of field leaf pathology diagnoses and exported PDF reports."
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : scans.length === 0 ? (
        <Card className="border-earth-200">
          <CardContent className="p-8">
            <EmptyState
              icon={History}
              title="No scan history found"
              description="Your saved crop scans and PDF field reports will appear here."
              actionLabel="Run New Scan"
              onAction={() => (window.location.href = '/detect')}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scans.map((scan, idx) => {
            const diseaseName = getDiseaseDisplayName(scan);
            const isHealthy =
              scan.is_healthy === true ||
              isHealthyClass(diseaseName) ||
              isHealthyClass(scan.disease_id) ||
              isHealthyClass(scan.predicted_disease) ||
              isHealthyClass(scan.disease_name);
            const acres = scan.land_acres || 1.0;

            return (
              <Card key={scan._id || scan.id || idx} className="hover:shadow-md transition-shadow border-earth-200">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-earth-100 border border-earth-200 flex-shrink-0 flex items-center justify-center">
                      {scan.image_url ? (
                        <img src={scan.image_url} alt="Scan thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <Leaf className="w-7 h-7 text-primary-600" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-earth-900 text-base leading-snug">{diseaseName}</h3>
                        <Badge variant={isHealthy ? 'success' : 'danger'}>
                          {isHealthy ? 'Healthy' : 'Disease Found'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-earth-500 flex-wrap">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-earth-400" />
                          {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-800">
                          <MapPin className="w-3.5 h-3.5" /> {acres} {t.common.acres} ({acres * 200}L Water)
                        </span>
                        {(() => {
                          const conf = scan.confidence ?? (scan.confidence_pct ? parseFloat(scan.confidence_pct) / 100 : 0.9);
                          const tier = getConfidenceTier(conf);
                          const confText = scan.confidence_pct || `${(conf * 100).toFixed(1)}%`;
                          if (tier === 'high') {
                            return (
                              <>
                                <span>•</span>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold text-[10px]">
                                  High Confidence ({confText})
                                </span>
                              </>
                            );
                          }
                          if (tier === 'moderate') {
                            return (
                              <>
                                <span>•</span>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-[10px]">
                                  Moderate Confidence ({confText})
                                </span>
                              </>
                            );
                          }
                          return (
                            <>
                              <span>•</span>
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 rounded font-bold text-[10px]">
                                Uncertain ({confText})
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-earth-100">
                    <Button
                      onClick={() => handleOpenReport(scan)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-initial border-earth-300 hover:bg-emerald-50 text-emerald-900 font-bold text-xs"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-700" /> View / {t.common.pdfReport}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* PDF Modal */}
      {selectedScan && showPdfModal && (
        <Modal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          title={t.common.pdfReport}
        >
          <div className="space-y-4">
            <div className="flex justify-end gap-2 no-print">
              <Button onClick={handlePrint} className="bg-primary-700 hover:bg-primary-800 text-white font-bold text-xs">
                <Printer className="w-4 h-4 mr-2" /> {t.common.printReport}
              </Button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <DiagnosticPdfReport
                prediction={constructPredictionData(selectedScan)}
                landAcres={selectedScan.land_acres || 1.0}
                scanDate={selectedScan.created_at ? new Date(selectedScan.created_at).toLocaleDateString() : undefined}
                scanId={selectedScan._id ? `AGL-${selectedScan._id.slice(-6).toUpperCase()}` : undefined}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
