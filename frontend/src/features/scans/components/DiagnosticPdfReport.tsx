import type { PredictionData } from '../../../types/prediction';
import { useLanguage } from '../../../context/LanguageContext';

interface DiagnosticPdfReportProps {
  prediction: PredictionData;
  landAcres: number;
  scanDate?: string;
  scanId?: string;
}

export function DiagnosticPdfReport({
  prediction,
  landAcres,
  scanDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  scanId = `AGL-${Math.floor(100000 + Math.random() * 900000)}`
}: DiagnosticPdfReportProps) {
  const { language, t } = useLanguage();
  const pdfT = t.pdfReport;
  const adv = prediction.personalized_advisory;
  const chem = adv.calculated_dosage;

  return (
    <div
      id="agrilens-diagnostic-report-sheet"
      className="printable-report-sheet bg-white text-earth-900 p-6 md:p-8 max-w-3xl mx-auto border border-earth-300 rounded-xl shadow-sm font-sans space-y-5 text-xs relative"
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-emerald-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-800 text-white font-bold flex items-center justify-center rounded-lg text-lg shadow-sm">
            AL
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-emerald-950 tracking-tight">
              {pdfT.title}
            </h1>
            <p className="text-[11px] text-earth-600 font-medium">
              {pdfT.subtitle} ({language.toUpperCase()})
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] text-earth-600 space-y-0.5">
          <div className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-mono font-bold rounded border border-emerald-300 inline-block text-[10px]">
            {pdfT.refNo}{scanId}
          </div>
          <p className="pt-1">{pdfT.date}: <strong>{scanDate}</strong></p>
          <p>{pdfT.targetCrop}</p>
          <p>{pdfT.landSize}: <strong className="text-emerald-800">{landAcres} {t.common.acres}</strong></p>
        </div>
      </div>

      {/* Primary Diagnosis Summary */}
      <div className="bg-earth-50/80 border border-earth-200 rounded-lg p-4 flex justify-between items-center gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500">
            {pdfT.primaryPathology}
          </span>
          <h2 className="text-base font-extrabold text-earth-950">{adv.disease_name}</h2>
          <p className="text-[11px] italic text-emerald-800 font-medium">{adv.scientific_name}</p>
        </div>

        <div className="text-right space-y-1">
          <span className="px-2.5 py-1 bg-emerald-800 text-white font-bold text-xs rounded-md inline-block">
            {pdfT.certaintyScore}: {prediction.confidence_pct}
          </span>
          <p className="text-[11px] text-earth-600 font-semibold">
            {pdfT.threatRating}: <span className="text-amber-800 font-bold">{adv.severity}</span>
          </p>
        </div>
      </div>

      {/* Pathological Description */}
      <div className="space-y-1">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-earth-800 border-b border-earth-200 pb-1">
          {pdfT.observation}
        </h3>
        <p className="text-xs text-earth-700 leading-relaxed">{adv.description}</p>
      </div>

      {/* Emergency Action Callout */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-md text-xs space-y-0.5">
        <strong className="text-amber-900 font-bold block uppercase tracking-wider text-[10px]">
          🚨 {pdfT.emergencyContainment}:
        </strong>
        <p className="text-amber-950 font-medium leading-relaxed">{adv.emergency_action}</p>
      </div>

      {/* Acreage-Calculated Chemical Dosage Protocol Table */}
      <div className="space-y-2">
        <div className="flex justify-between items-center border-b border-emerald-700 pb-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-950">
            {pdfT.prescriptionTitle} ({landAcres} {t.common.acres})
          </h3>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            {pdfT.totalWater}: {chem.total_water_litres} Litres
          </span>
        </div>

        <table className="w-full text-xs text-left border-collapse border border-earth-300 rounded overflow-hidden">
          <thead>
            <tr className="bg-earth-100 text-earth-900 font-bold border-b border-earth-300">
              <th className="p-2 border-r border-earth-300 w-1/3">{pdfT.specification}</th>
              <th className="p-2 border-r border-earth-300 w-1/3">{pdfT.prescription}</th>
              <th className="p-2 w-1/3">{pdfT.fieldCalculation} ({landAcres} {t.common.acres})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-earth-200 text-earth-900">
            <tr>
              <td className="p-2 font-bold bg-earth-50 border-r border-earth-200">{pdfT.recProduct}</td>
              <td className="p-2 font-bold text-emerald-950 border-r border-earth-200">{chem.product_name}</td>
              <td className="p-2 font-bold text-primary-800">{chem.dosage_summary}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold bg-earth-50 border-r border-earth-200">{pdfT.activeFormulation}</td>
              <td className="p-2 border-r border-earth-200">{chem.active_ingredient}</td>
              <td className="p-2 text-earth-700">Rate: {chem.dosage_per_acre}</td>
            </tr>
            <tr>
              <td className="p-2 font-bold bg-earth-50 border-r border-earth-200">{pdfT.totalWater}</td>
              <td className="p-2 border-r border-earth-200">{chem.water_per_acre_litres} L / acre</td>
              <td className="p-2 font-extrabold text-emerald-900 bg-emerald-50">{chem.total_water_litres} Litres Total</td>
            </tr>
            <tr>
              <td className="p-2 font-bold bg-earth-50 border-r border-earth-200">{pdfT.applicationSchedule}</td>
              <td className="p-2 border-r border-earth-200">Repeat every {chem.application_interval_days} days</td>
              <td className="p-2 font-bold text-amber-900 bg-amber-50">{pdfT.phiWaiting}: {chem.pre_harvest_interval_days} Days</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bio-Organic & Weather Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-md space-y-1">
          <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[10px]">
            🌿 {pdfT.bioAlternative}
          </h4>
          <strong className="text-emerald-900 block font-bold">{adv.biological_organic.remedy}</strong>
          <p className="text-emerald-800 text-[11px]">{adv.biological_organic.description}</p>
        </div>

        <div className="bg-teal-50/70 border border-teal-200 p-3 rounded-md space-y-1">
          <h4 className="font-bold text-teal-950 uppercase tracking-wider text-[10px]">
            ⛅ {pdfT.weatherRule}
          </h4>
          <p className="text-teal-900 text-[11px] font-medium">{adv.weather_safety_rule}</p>
        </div>
      </div>

      {/* Preventive Guidelines */}
      <div className="space-y-1 text-xs bg-earth-50 p-3 rounded-md border border-earth-200">
        <h4 className="font-bold text-earth-900 uppercase tracking-wider text-[10px]">
          {pdfT.preventiveMeasures}
        </h4>
        <ul className="list-disc pl-4 space-y-0.5 text-earth-700 text-[11px]">
          {adv.cultural_preventative.map((rule, idx) => (
            <li key={idx}>{rule}</li>
          ))}
        </ul>
      </div>

      {/* Footer & Academic Disclaimer */}
      <div className="border-t border-earth-300 pt-3 flex justify-between items-end text-[10px] text-earth-500">
        <div>
          <p className="font-bold text-earth-800">{pdfT.footerNote}</p>
          <p className="text-[9px] text-earth-400 italic">Academic Advisory System • Final Year Project</p>
        </div>
        <div className="text-right border-l border-earth-300 pl-3">
          <div className="w-24 border-b border-earth-400 pb-0.5 text-[9px] text-earth-400 italic">
            Advisory Reference
          </div>
          <p className="font-bold text-earth-800 uppercase tracking-widest text-[9px]">{pdfT.officerSignoff}</p>
        </div>
      </div>
    </div>
  );
}
