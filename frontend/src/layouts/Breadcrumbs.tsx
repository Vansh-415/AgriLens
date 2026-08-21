import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Breadcrumbs() {
  const location = useLocation();
  const { t } = useLanguage();
  const paths = location.pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  const getPathTranslation = (path: string) => {
    const p = path.toLowerCase();
    if (p === 'dashboard') return t.nav.dashboard;
    if (p === 'detect') return t.nav.detect;
    if (p === 'history') return t.nav.history;
    if (p === 'crops' || p === 'library') return t.nav.crops;
    if (p === 'diseases') return t.nav.diseases;
    if (p === 'treatments') return t.nav.treatments;
    if (p === 'assistant') return t.nav.assistant;
    if (p === 'profile') return t.nav.profile;
    if (p === 'settings') return t.nav.settings;
    if (p === 'admin') return t.nav.admin;
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/dashboard" className="inline-flex items-center text-xs font-medium text-earth-500 hover:text-earth-900 transition-colors">
            <Home className="w-3.5 h-3.5 mr-1.5" />
            {t.nav.dashboard}
          </Link>
        </li>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const label = getPathTranslation(path);

          return (
            <li key={path} aria-current={isLast ? 'page' : undefined}>
              <div className="flex items-center text-xs font-medium">
                <ChevronRight className="w-3.5 h-3.5 text-earth-400" />
                {isLast ? (
                  <span className="ml-1 text-earth-900 md:ml-2 font-bold">{label}</span>
                ) : (
                  <Link to={href} className="ml-1 text-earth-500 hover:text-earth-900 md:ml-2 transition-colors">
                    {label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
