import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../i18n/translations';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी (Marathi)', flag: '🚩' },
  ];

  return (
    <div className="flex items-center gap-1 bg-earth-100 dark:bg-slate-800 px-1.5 sm:px-2 py-0.5 rounded-lg sm:rounded-xl border border-earth-200 dark:border-slate-700">
      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-0.5" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-[11px] sm:text-xs font-bold text-earth-900 dark:text-white px-0.5 py-1 focus:outline-none cursor-pointer leading-tight"
        aria-label="Select platform language"
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code} className="bg-white dark:bg-slate-900 text-earth-900 dark:text-white font-medium text-xs">
            {opt.flag} {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
