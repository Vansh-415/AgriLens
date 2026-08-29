import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AgriLensLogo } from '../components/ui/AgriLensLogo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Headphones, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: typeof ShieldCheck;
  children: React.ReactNode;
}

function LegalModal({ isOpen, onClose, title, icon: Icon, children }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal Card */}
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl border border-earth-200 w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-earth-200 bg-earth-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#dcfce7] flex items-center justify-center text-[#15803d] shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-earth-950 font-heading">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-earth-200/60 transition-colors text-earth-500 hover:text-earth-900 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-earth-700 leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-earth-200 bg-earth-50/50 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-earth-900 text-white font-bold text-xs hover:bg-earth-800 transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const foot = t.footer;

  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-earth-200 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <Link to={user ? '/dashboard' : '/'} className="inline-block" aria-label="AgriLens Home">
                <AgriLensLogo size="md" />
              </Link>
              <span className="text-xs text-earth-500 hidden sm:inline">
                © {new Date().getFullYear()} AgriLens. {foot.rightsReserved}
              </span>
            </div>

            {/* Terms, Privacy, References & Support Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-xs font-semibold text-earth-600">
              <Link to="/references" className="hover:text-primary-700 transition-colors cursor-pointer">
                Data Sources & References
              </Link>
              <button
                onClick={() => setTermsOpen(true)}
                className="hover:text-primary-700 transition-colors cursor-pointer"
              >
                {foot.termsOfService}
              </button>
              <button
                onClick={() => setPrivacyOpen(true)}
                className="hover:text-primary-700 transition-colors cursor-pointer"
              >
                {foot.privacyPolicy}
              </button>
              <button
                onClick={() => setSupportOpen(true)}
                className="hover:text-primary-700 transition-colors cursor-pointer"
              >
                {foot.contactSupport}
              </button>
            </div>

            <span className="text-[11px] text-earth-400 sm:hidden">
              © {new Date().getFullYear()} AgriLens. {foot.rightsReserved}
            </span>
          </div>
        </div>
      </footer>

      {/* Legal & Support Modals */}
      <LegalModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Service" icon={ShieldCheck}>
        <p className="font-bold text-earth-950 text-sm">Terms of Service — AgriLens Platform</p>
        <p><strong>Last Updated:</strong> August 2026</p>
        <p>By using AgriLens, you acknowledge that this platform is built as an academic prototype for educational and research evaluation purposes.</p>
        <div className="space-y-3">
          <div>
            <p className="font-bold text-earth-950">1. Purpose & Scope</p>
            <p>AgriLens provides automated cotton leaf disease classification and treatment dosage calculations based on published agronomic reference rates.</p>
          </div>
          <div>
            <p className="font-bold text-earth-950">2. Educational Disclaimer</p>
            <p>Recommendations are generated as an informational decision-support aid. Always consult certified agricultural extension officers before administering chemical treatments in the field.</p>
          </div>
          <div>
            <p className="font-bold text-earth-950">3. Safety & PPE</p>
            <p>Users must adhere to standard chemical handling safety procedures and use recommended Personal Protective Equipment (PPE) during spraying.</p>
          </div>
        </div>
      </LegalModal>

      <LegalModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy" icon={Lock}>
        <p className="font-bold text-earth-950 text-sm">Privacy Policy — AgriLens Platform</p>
        <p><strong>Last Updated:</strong> August 2026</p>
        <p>Your privacy is important to us. This policy explains how information is handled on the AgriLens platform.</p>
        <div className="space-y-3">
          <div>
            <p className="font-bold text-earth-950">1. Information We Collect</p>
            <p>User credentials (stored securely with bcrypt hashing), uploaded leaf scan images, scan timestamps, and diagnostic results.</p>
          </div>
          <div>
            <p className="font-bold text-earth-950">2. Data Security</p>
            <p>Authentication utilizes JSON Web Tokens (JWT). We do not share or sell user data to advertising or third-party marketing networks.</p>
          </div>
          <div>
            <p className="font-bold text-earth-950">3. Local Device Storage</p>
            <p>Language preferences and theme choices are stored locally on your device via standard browser localStorage.</p>
          </div>
        </div>
      </LegalModal>

      <LegalModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} title="Help & Support" icon={Headphones}>
        <p className="font-bold text-earth-950 text-sm">Help & Support — AgriLens</p>
        <div className="space-y-3">
          <p>For technical inquiries, academic evaluation questions, or feedback, please reach out to the project team:</p>
          <div className="bg-earth-50 p-4 rounded-xl border border-earth-200 space-y-1.5">
            <p><strong>Support Desk:</strong> <a href="mailto:support@agrilens.in" className="text-primary-700 underline">support@agrilens.in</a></p>
            <p><strong>Project Classification:</strong> Final Year Academic Engineering Project</p>
            <p><strong>Response Time:</strong> 24-48 hours during evaluation cycles</p>
          </div>
        </div>
      </LegalModal>
    </>
  );
}
