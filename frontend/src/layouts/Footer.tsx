import { Link } from 'react-router-dom';
import { AgriLensLogo } from '../components/ui/AgriLensLogo';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const foot = t.footer;

  return (
    <footer className="bg-white border-t border-earth-200 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-block">
              <AgriLensLogo size="md" />
            </Link>
            <span className="text-xs text-earth-500 hidden sm:inline">
              © {new Date().getFullYear()} AgriLens. {foot.rightsReserved}
            </span>
          </div>

          {/* Strictly Terms, Privacy & Support Buttons Only */}
          <div className="flex items-center gap-6 text-xs font-semibold text-earth-600">
            <a href="#terms" className="hover:text-primary-700 transition-colors">
              {foot.termsOfService}
            </a>
            <a href="#privacy" className="hover:text-primary-700 transition-colors">
              {foot.privacyPolicy}
            </a>
            <a href="mailto:support@agrilens.in" className="hover:text-primary-700 transition-colors">
              {foot.contactSupport}
            </a>
          </div>

          <span className="text-[11px] text-earth-400 sm:hidden">
            © {new Date().getFullYear()} AgriLens. {foot.rightsReserved}
          </span>
        </div>
      </div>
    </footer>
  );
}
