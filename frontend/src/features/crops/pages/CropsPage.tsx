import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { SearchInput } from '../../../components/ui/SearchInput';
import { getLocalizedCrops } from '../../../i18n/localizedData';

export default function CropsPage() {
  const { t, language } = useLanguage();
  const crpT = t.crops;
  useDocumentTitle(crpT.title);

  const [search, setSearch] = useState('');
  const cropsData = getLocalizedCrops(language);

  const filtered = cropsData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title={crpT.title}
        description={crpT.description}
        actions={
          <SearchInput
            placeholder={t.common.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        }
      />

      <div className="grid gap-6">
        {filtered.map((crop) => (
          <Card key={crop.id} className="border-earth-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-extrabold text-earth-950 dark:text-white">{crop.name}</CardTitle>
                  <p className="text-xs italic text-primary-700 dark:text-primary-400 font-medium">{crop.scientificName}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-full border border-emerald-300 dark:border-emerald-800">
                  {crop.season}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-earth-700 dark:text-slate-300 leading-relaxed">{crop.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-earth-50 dark:bg-slate-800/80 rounded-xl border border-earth-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-earth-500 dark:text-slate-400 block text-[11px] font-medium">{crpT.growingPeriod}:</span>
                  <strong className="text-earth-900 dark:text-white font-bold">{crop.durationDays}</strong>
                </div>
                <div>
                  <span className="text-earth-500 dark:text-slate-400 block text-[11px] font-medium">{crpT.idealTemp}:</span>
                  <strong className="text-earth-900 dark:text-white font-bold">{crop.idealTemp}</strong>
                </div>
                <div>
                  <span className="text-earth-500 dark:text-slate-400 block text-[11px] font-medium">{crpT.waterNeed}:</span>
                  <strong className="text-earth-900 dark:text-white font-bold">{crop.waterRequirement}</strong>
                </div>
                <div>
                  <span className="text-earth-500 dark:text-slate-400 block text-[11px] font-medium">{crpT.soilType}:</span>
                  <strong className="text-earth-900 dark:text-white font-bold truncate block">{crop.soilType}</strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-earth-900 dark:text-white block mb-1.5">{crpT.keyPests}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {crop.keyPests.map((pest, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-semibold text-xs rounded-md border border-amber-200 dark:border-amber-800">
                      {pest}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
