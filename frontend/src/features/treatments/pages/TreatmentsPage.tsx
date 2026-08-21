import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Modal } from '../../../components/ui/Modal';
import { FlaskConical, Leaf, Activity, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react';

export interface TreatmentProtocol {
  id: string;
  name: string;
  category: 'chemical' | 'organic' | 'biological';
  active_ingredient: string;
  commercial_brands: string[];
  target_diseases: string[];
  dosage_per_acre: string;
  water_dilution_per_acre: string;
  application_method: string;
  repeat_interval_days: number;
  pre_harvest_interval_days: number;
  safety_gear_required: string[];
  precautions: string;
  description: string;
}

export const COTTON_TREATMENT_LIBRARY: TreatmentProtocol[] = [
  {
    id: 'blitox_strepto',
    name: 'Copper Oxychloride 50% WP + Streptocycline',
    category: 'chemical',
    active_ingredient: 'Copper Oxychloride (50%) + Streptomycin Sulphate (9:1)',
    commercial_brands: ['Blitox 50 WP', 'Kocide 2000', 'Streptocycline Ag'],
    target_diseases: ['Bacterial Blight / Angular Leaf Spot', 'Boll Rot Complex'],
    dosage_per_acre: '500 grams Blitox + 6 grams Streptocycline',
    water_dilution_per_acre: '200 Litres clean water per acre',
    application_method: 'High-volume foliar canopy spray using hollow cone nozzle',
    repeat_interval_days: 10,
    pre_harvest_interval_days: 15,
    safety_gear_required: ['N95 Respirator Mask', 'Nitrile Gloves', 'Eye Protection Goggles'],
    precautions: 'Do not mix with organophosphate insecticides or alkaline sprays. Spray during morning or evening hours.',
    description: 'Broad-spectrum bactericide and protective copper fungicide designed to eliminate vascular Xanthomonas bacteria.'
  },
  {
    id: 'acetamiprid_diafenthiuron',
    name: 'Acetamiprid 20% SP / Diafenthiuron 50% WP',
    category: 'chemical',
    active_ingredient: 'Acetamiprid 20% SP / Diafenthiuron 50% WP',
    commercial_brands: ['Ekka 20% SP', 'Polo 50% WP', 'Manik SP'],
    target_diseases: ['Cotton Leaf Curl Virus (CLCuV Vector Control)', 'Whiteflies (Bemisia tabaci)'],
    dosage_per_acre: '100g Acetamiprid OR 250g Diafenthiuron',
    water_dilution_per_acre: '200 Litres water per acre',
    application_method: 'Target undersides of lower and middle leaves where whitefly nymphs colony resides',
    repeat_interval_days: 12,
    pre_harvest_interval_days: 20,
    safety_gear_required: ['Chemical Suit', 'Rubber Boots', 'Face Shield'],
    precautions: 'Highly toxic to bees. Avoid spraying during peak morning bee foraging hours.',
    description: 'Systemic insecticide and miticide vector-suppressor that halts sap transmission of Begomoviruses.'
  },
  {
    id: 'flonicamid_thiamethoxam',
    name: 'Flonicamid 50% WG / Thiamethoxam 25% WG',
    category: 'chemical',
    active_ingredient: 'Flonicamid 50% WG / Thiamethoxam 25% WG',
    commercial_brands: ['Ulala 50% WG', 'Cruz 25% WG', 'Actara'],
    target_diseases: ['Leaf Hopper Jassids', 'Aphids', 'Thrips'],
    dosage_per_acre: '60g Flonicamid OR 40g Thiamethoxam',
    water_dilution_per_acre: '200 Litres water per acre',
    application_method: 'Foliar spray at first appearance of hopperburn or 2 jassids/leaf threshold',
    repeat_interval_days: 14,
    pre_harvest_interval_days: 21,
    safety_gear_required: ['Protective Gloves', 'Dust Mask'],
    precautions: 'Do not exceed 2 sprays per crop season to prevent resistance development.',
    description: 'Selective feeding blocker that causes immediate feeding cessation in jassid nymphs while preserving beneficial ladybird beetles.'
  },
  {
    id: 'mgso4_npk',
    name: 'Magnesium Sulphate (MgSO4) + 19:19:19 NPK',
    category: 'chemical',
    active_ingredient: 'Magnesium Sulphate 9.5% Mg + Water Soluble NPK 19:19:19',
    commercial_brands: ['MgSO4 Ag-Grade', 'Mahadhan 19:19:19', 'YaraTera Krista MgS'],
    target_diseases: ['Physiological Leaf Redding', 'Magnesium Deficiency'],
    dosage_per_acre: '1.0 kg MgSO4 + 1.0 kg 19:19:19 NPK',
    water_dilution_per_acre: '200 Litres water per acre',
    application_method: 'Foliar nutrition spray during early morning hours',
    repeat_interval_days: 10,
    pre_harvest_interval_days: 0,
    safety_gear_required: ['Standard Work Clothes'],
    precautions: 'Ensure full dissolve in water tank before spraying to avoid nozzle clogging.',
    description: 'Foliar nutritional corrective that replenishes magnesium reserves and restores chlorophyll synthesis.'
  },
  {
    id: 'humic_seaweed',
    name: 'Humic Acid 12% + Seaweed Extract Bio-Stimulant',
    category: 'organic',
    active_ingredient: 'Humic Acid 12% + Ascophyllum nodosum Seaweed Extract',
    commercial_brands: ['Isabion Bio', 'Biovita Liquid', 'Humic Gold'],
    target_diseases: ['Herbicide Growth Damage / Phytotoxicity Stress'],
    dosage_per_acre: '400 mL Humic Acid + 200 mL Seaweed Extract',
    water_dilution_per_acre: '200 Litres water per acre',
    application_method: 'Foliar spray combined with root zone flushing',
    repeat_interval_days: 7,
    pre_harvest_interval_days: 0,
    safety_gear_required: ['Standard Protective Clothes'],
    precautions: 'Flush soil with clean water prior to bio-stimulant foliar spray.',
    description: 'Natural biostimulant rich in plant auxins, cytokinins, and organic amino acids that reverses herbicide-induced cell damage.'
  },
  {
    id: 'nske_neem',
    name: 'Neem Seed Kernel Extract (NSKE 5%)',
    category: 'organic',
    active_ingredient: 'Azadirachtin 10,000 PPM (Neem Botanical Extract)',
    commercial_brands: ['Neemazal 1%', 'Econeem', 'NSKE Field Extract'],
    target_diseases: ['Bacterial Blight Support', 'Jassids', 'Early Whiteflies'],
    dosage_per_acre: '1.0 Litre Neem Extract (or 5kg NSKE seed powder)',
    water_dilution_per_acre: '200 Litres water + 200mL liquid soap sticker',
    application_method: 'Foliar spray covering upper and lower canopy',
    repeat_interval_days: 7,
    pre_harvest_interval_days: 0,
    safety_gear_required: ['Basic Cotton Mask'],
    precautions: 'Mix with mild soap to ensure emulsion stability. Store in cool dark place.',
    description: 'Eco-friendly botanical repellant and antifeedant that disrupts insect oviposition and bacterial adherence.'
  },
  {
    id: 'yellow_sticky_verticillium',
    name: 'Yellow Sticky Traps + Verticillium lecanii',
    category: 'biological',
    active_ingredient: 'Entomopathogenic Fungus Verticillium lecanii (1x10^8 CFU/g)',
    commercial_brands: ['Verticel Bio', 'Meghmani Yellow Sticky Traps'],
    target_diseases: ['Whitefly Vectors (CLCuV)', 'Jassids & Thrips'],
    dosage_per_acre: '15-20 Yellow Sticky Traps/acre + 1.0 kg Verticillium',
    water_dilution_per_acre: '200 Litres water per acre',
    application_method: 'Install traps at canopy height + foliar bio-fungicide spray',
    repeat_interval_days: 14,
    pre_harvest_interval_days: 0,
    safety_gear_required: ['Dust Mask'],
    precautions: 'Do not combine with chemical fungicides. Apply during high humidity evening hours.',
    description: 'Integrated bio-defense protocol combining physical vector trapping with entomopathogenic spore parasitism.'
  },
  {
    id: 'azotobacter_psb',
    name: 'Azotobacter & PSB Bio-Fertilizer Inoculant',
    category: 'biological',
    active_ingredient: 'Azotobacter chroococcum + Phosphate Solubilizing Bacteria',
    commercial_brands: ['AgriBio Nitro-P', 'Bio-AZO Sol'],
    target_diseases: ['Soil Health Enhancement & Immunity Support'],
    dosage_per_acre: '500 mL Azotobacter + 500 mL PSB',
    water_dilution_per_acre: 'Mix with 50 kg Farmyard Manure or drench in 200 L water',
    application_method: 'Soil drenching or seed/FYM enrichment at sowing/hoeing',
    repeat_interval_days: 30,
    pre_harvest_interval_days: 0,
    safety_gear_required: ['Standard Clothes'],
    precautions: 'Do not mix directly with synthetic chemical fertilizers or fungicides.',
    description: 'Beneficial rhizobacteria that fix atmospheric nitrogen and solubilize bound soil phosphorus for enhanced root vigor.'
  }
];

export default function TreatmentsPage() {
  useDocumentTitle('Validated Agronomic Treatment Protocols');
  const { t } = useLanguage();
  const trtT = t.treatments;

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'chemical' | 'organic' | 'biological'>('all');
  const [selectedProtocol, setSelectedProtocol] = useState<TreatmentProtocol | null>(null);

  const filtered = COTTON_TREATMENT_LIBRARY.filter((titem) => {
    const matchesSearch =
      titem.name.toLowerCase().includes(search.toLowerCase()) ||
      titem.active_ingredient.toLowerCase().includes(search.toLowerCase()) ||
      titem.description.toLowerCase().includes(search.toLowerCase()) ||
      titem.target_diseases.some((d) => d.toLowerCase().includes(search.toLowerCase()));
    const matchesTab = activeTab === 'all' || titem.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'organic':
        return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'biological':
        return <Activity className="w-5 h-5 text-teal-600" />;
      default:
        return <FlaskConical className="w-5 h-5 text-primary-600" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'organic':
        return <Badge variant="success">Organic Remedy</Badge>;
      case 'biological':
        return <Badge variant="neutral">Bio-Control</Badge>;
      default:
        return <Badge variant="info">Chemical Spray</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title={trtT.title}
        description={trtT.subtitle}
        actions={
          <SearchInput
            placeholder={t.common.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        }
      />

      {/* Filter Tabs */}
      <div className="flex border-b border-earth-200 gap-6 bg-white dark:bg-slate-800 p-2 rounded-xl border">
        {[
          { key: 'all', label: trtT.allProtocols },
          { key: 'chemical', label: trtT.chemicalInterventions },
          { key: 'organic', label: trtT.organicInterventions },
          { key: 'biological', label: trtT.biologicalInterventions }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors relative ${
              activeTab === tab.key
                ? 'text-primary-800 dark:text-primary-400 border-b-2 border-primary-600 font-extrabold'
                : 'text-earth-600 dark:text-slate-400 hover:text-earth-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((treatment) => (
          <Card
            key={treatment.id}
            className="hover:shadow-lg transition-all border-earth-200 cursor-pointer flex flex-col justify-between"
            onClick={() => setSelectedProtocol(treatment)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-earth-100/80 rounded-xl">{getCategoryIcon(treatment.category)}</div>
                  <CardTitle className="text-base font-extrabold text-earth-950 dark:text-white">{treatment.name}</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  {getCategoryBadge(treatment.category)}
                  <span className="text-[11px] font-bold text-primary-800 dark:text-primary-400">PHI: {treatment.pre_harvest_interval_days} Days</span>
                </div>

                <p className="text-xs text-earth-700 dark:text-slate-300 leading-relaxed line-clamp-2">{treatment.description}</p>

                <div className="p-2.5 bg-earth-50 dark:bg-slate-800/80 rounded-lg space-y-1 text-[11px] border border-earth-200/80 dark:border-slate-700">
                  <div>
                    <span className="text-earth-500 dark:text-slate-400 font-medium">{trtT.activeFormulation}: </span>
                    <span className="font-semibold text-earth-900 dark:text-white">{treatment.active_ingredient}</span>
                  </div>
                  <div>
                    <span className="text-earth-500 dark:text-slate-400 font-medium">{trtT.ratePerAcre}: </span>
                    <span className="font-bold text-primary-800 dark:text-primary-400">{treatment.dosage_per_acre}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {treatment.target_diseases.map((d, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] bg-primary-50 dark:bg-primary-950/40 text-primary-900 dark:text-primary-300 rounded font-medium border border-primary-200 dark:border-primary-800">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-earth-100 flex items-center justify-between text-xs text-primary-700 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> {trtT.viewDosageSafety}
                </span>
                <span>Details &rarr;</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Protocol Detail Modal */}
      {selectedProtocol && (
        <Modal
          isOpen={!!selectedProtocol}
          onClose={() => setSelectedProtocol(null)}
          title={selectedProtocol.name}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-earth-50 rounded-lg border border-earth-200">
              <div>
                <span className="text-xs font-bold text-earth-900 block">{selectedProtocol.active_ingredient}</span>
                <span className="text-[11px] text-earth-600">Category: {selectedProtocol.category.toUpperCase()}</span>
              </div>
              {getCategoryBadge(selectedProtocol.category)}
            </div>

            <div className="p-3 bg-primary-50/70 rounded-lg border border-primary-200 space-y-2">
              <h4 className="font-bold text-primary-950 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-primary-700" /> Standard Dosage & Dilution Rules
              </h4>
              <div className="grid grid-cols-2 gap-2 text-earth-900">
                <div>
                  <span className="text-earth-500 block text-[11px]">{trtT.ratePerAcre}:</span>
                  <strong>{selectedProtocol.dosage_per_acre}</strong>
                </div>
                <div>
                  <span className="text-earth-500 block text-[11px]">Spray Water Dilution:</span>
                  <strong>{selectedProtocol.water_dilution_per_acre}</strong>
                </div>
                <div>
                  <span className="text-earth-500 block text-[11px]">Repeat Application:</span>
                  <strong>Every {selectedProtocol.repeat_interval_days} Days</strong>
                </div>
                <div>
                  <span className="text-earth-500 block text-[11px]">{trtT.phi}:</span>
                  <strong className="text-amber-800">{selectedProtocol.pre_harvest_interval_days} Days Waiting</strong>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-earth-900 mb-1">{trtT.commercialBrands}</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProtocol.commercial_brands.map((brand, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-earth-100 text-earth-800 font-bold rounded text-xs border border-earth-200">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-earth-900 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> {trtT.requiredPpe}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProtocol.safety_gear_required.map((gear, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded font-semibold text-[11px] border border-rose-200">
                    {gear}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600" /> {trtT.safetyPrecaution}
              </div>
              <p className="leading-relaxed">{selectedProtocol.precautions}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
