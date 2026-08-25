import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { getLocalizedDiseases } from '../../../i18n/localizedData';
import type { DiseaseProfile } from '../../../i18n/localizedData';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Modal } from '../../../components/ui/Modal';
import {
  ShieldCheck,
  Bug,
  Droplets,
  Layers
} from 'lucide-react';

export type { DiseaseProfile };

export default function DiseasesPage() {
  const { language, t } = useLanguage();
  const disT = t.diseases;
  useDocumentTitle(disT.title);

  const diseaseLibrary = getLocalizedDiseases(language);

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseProfile | null>(null);

  const filteredDiseases = diseaseLibrary.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || d.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="danger">{disT.criticalThreat}</Badge>;
      case 'high':
        return <Badge variant="warning">{disT.highSeverity}</Badge>;
      case 'moderate':
        return <Badge variant="info">{disT.moderateStress}</Badge>;
      default:
        return <Badge variant="success">{disT.normalHealthy}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title={disT.title}
        description={disT.subtitle}
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-10 px-3 text-xs font-semibold bg-white dark:bg-slate-800 border border-earth-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{disT.allThreats}</option>
              <option value="critical">{disT.criticalThreat}</option>
              <option value="high">{disT.highSeverity}</option>
              <option value="moderate">{disT.moderateStress}</option>
              <option value="low">{disT.normalHealthy}</option>
            </select>
            <SearchInput
              placeholder={t.common.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDiseases.map((disease) => (
          <Card
            key={disease.id}
            className="hover:shadow-lg transition-all border-earth-200 cursor-pointer flex flex-col justify-between"
            onClick={() => setSelectedDisease(disease)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-extrabold text-earth-950 dark:text-white">{disease.name}</CardTitle>
                  <p className="text-xs italic text-primary-800 dark:text-primary-400 mt-0.5 font-medium">{disease.scientific_name}</p>
                </div>
                {getSeverityBadge(disease.severity)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-xs text-earth-700 dark:text-slate-300 line-clamp-2 leading-relaxed">{disease.description}</p>

                <div className="p-2.5 bg-earth-50 dark:bg-slate-800/80 rounded-lg space-y-1 text-[11px] border border-earth-200/80 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-earth-500 dark:text-slate-400 font-medium">{disT.diseaseIndexScore}:</span>
                    <span className="font-bold text-earth-900 dark:text-white">{disease.disease_index_score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-500 dark:text-slate-400 font-medium">{disT.stage}:</span>
                    <span className="font-semibold text-earth-800 dark:text-slate-200 truncate max-w-[150px]">{disease.vulnerable_stage}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {disease.symptoms.slice(0, 2).map((sym, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[11px] bg-primary-50 dark:bg-primary-950/40 text-primary-900 dark:text-primary-300 rounded font-medium border border-primary-200 dark:border-primary-800">
                      {sym}
                    </span>
                  ))}
                  {disease.symptoms.length > 2 && (
                    <span className="px-2 py-0.5 text-[11px] bg-earth-100 text-earth-600 rounded">
                      +{disease.symptoms.length - 2} {t.common.more}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-earth-100 flex items-center justify-between text-xs text-primary-700 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {disT.viewProtocol}
                </span>
                <span>{t.common.viewDetails} &rarr;</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <Modal
          isOpen={!!selectedDisease}
          onClose={() => setSelectedDisease(null)}
          title={selectedDisease.name}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-earth-50 rounded-lg border border-earth-200">
              <div>
                <span className="text-xs italic font-semibold text-primary-900 block">{selectedDisease.scientific_name}</span>
                <span className="text-[11px] text-earth-600">{disT.causalAgent}: {selectedDisease.causal_agent}</span>
              </div>
              {getSeverityBadge(selectedDisease.severity)}
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-primary-50/60 rounded-lg border border-primary-200">
              <div>
                <span className="text-earth-500 block text-[11px]">{disT.etl}:</span>
                <strong className="text-earth-900">{selectedDisease.economic_threshold_level}</strong>
              </div>
              <div>
                <span className="text-earth-500 block text-[11px]">{disT.vulnerableStage}:</span>
                <strong className="text-earth-900">{selectedDisease.vulnerable_stage}</strong>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-earth-900 mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary-600" /> {disT.descAndPathology}
              </h4>
              <p className="text-earth-700 leading-relaxed">{selectedDisease.description}</p>
            </div>

            <div>
              <h4 className="font-bold text-earth-900 mb-1.5 flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-amber-600" /> {disT.keySymptoms}
              </h4>
              <ul className="space-y-1 pl-4 list-disc text-earth-700">
                {selectedDisease.symptoms.map((symptom, i) => (
                  <li key={i}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-600" /> {disT.curativeProtocol}
              </h4>
              <div className="space-y-1 text-emerald-900">
                <p><strong>{disT.chemicalProduct}:</strong> {selectedDisease.recommended_treatments.chemical}</p>
                <p><strong>{disT.standardDosage}:</strong> {selectedDisease.recommended_treatments.dosage}</p>
                <p><strong>{disT.bioOrganicAlternative}:</strong> {selectedDisease.recommended_treatments.organic}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
