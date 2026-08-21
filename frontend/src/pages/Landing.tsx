import { useState, useRef } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  ArrowRight, CheckCircle2, Zap, Bug, Languages, WifiOff,
  CheckCheck, Cpu, HardDrive, ChevronDown, X, ShieldCheck, Lock, Headphones
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useReducedMotion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { AgriLensLogo } from '../components/ui/AgriLensLogo';
import { LandingShader } from '../components/landing/LandingShader';

/* ──────────────────────────────────────────────────────────
   MODAL COMPONENT (Terms of Service, Privacy Policy, Support)
   ────────────────────────────────────────────────────────── */

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
            className="relative bg-white dark:bg-earth-900 rounded-3xl shadow-2xl border border-earth-200 dark:border-earth-700 w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col z-10"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-earth-200 dark:border-earth-800 bg-earth-50/70 dark:bg-earth-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-950/80 flex items-center justify-center text-primary-700 dark:text-primary-400 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-earth-950 dark:text-white font-heading">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-earth-200/60 dark:hover:bg-earth-700 transition-colors text-earth-500 hover:text-earth-900 dark:hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto text-xs text-earth-700 dark:text-earth-300 leading-relaxed space-y-4">
              {children}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-earth-200 dark:border-earth-800 flex justify-end bg-earth-50/40 dark:bg-earth-850">
              <Button onClick={onClose} className="text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white px-6 rounded-full">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────
   DATA SETS (From Brand Standardized Edition Mockup)
   ────────────────────────────────────────────────────────── */

const IMPACT_METRICS = [
  {
    icon: Zap,
    title: 'Real-Time',
    subtitle: 'AI Inference (<120ms)',
  },
  {
    icon: Bug,
    title: '7 Classes',
    subtitle: 'Cotton Pathologies',
  },
  {
    icon: Languages,
    title: '3 Languages',
    subtitle: 'EN, HI (हिंदी), MR (मराठी)',
  },
  {
    icon: WifiOff,
    title: 'Offline-Ready',
    subtitle: 'PWA & PDF Reports',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Capture Focus',
    description: 'Take a high-resolution photo using your smartphone camera or upload directly from your gallery. Ensure the leaf is well-lit and in clear focus for optimal results.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0n1Wds7-ZEu45yV9YJj0pJCunieJTEDwQ1TO7zaDIZ-L7owPLvMP64wa2R19ZO9qiasqZ4uznZ_5CH_RPCM17LXUBA2y81Y2Cfl-wpc4F--AF7XfyREir35epQFNWty0YTmYwn6lzgIpCcItgmFiaasdFnWaph-REUznJR3TsVHw9NHsp0PPjsgRax15q07OgdE8YI0nyLCjZ-99qlgKzNCaxGqLXUwif2PzY-pvJSrFU5y1z_oDW',
    imageAlt: 'Capturing cotton leaf with smartphone camera',
    reverse: false,
  },
  {
    number: '02',
    title: 'Computer Vision Analysis',
    description: "Our AI model instantly analyzes the leaf's cellular structure, identifying potential pathogens and calculating condition severity with clinical precision in milliseconds.",
    image: '/images/cv_analysis_clean.png',
    imageAlt: 'Neural network vision analyzing leaf pathology',
    reverse: true,
  },
  {
    number: '03',
    title: 'Exact Prescription',
    description: 'Receive a comprehensive, acreage-scaled chemical dosage plan, bio-organic remedies, weather spray safety rules, and a 1-click downloadable field PDF report.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBepto-E-fsr8vk8QZc9uLSLRM3wxrukTBhFwfSki7vHjDuLghQ93fZn5qWa4FfBz9OFcO-W2l6qjeKukb5eLULtjmoUPpXfuXRCgS0eAQ3l-sS_75HtYdrFEKQYZf5Kjw-3wNmvJgPWmBj2I_-rf51jEdNQdcnVFickVBvWN_bvD4VC5pL5AO_0N4Ow9osD02SOSo4Khc4L3AVMwscRxwfxSbqO6-76SvcuYcEn0WHQmNJuMDA6oAo',
    imageAlt: 'Acreage-scaled treatment advisory and field prescription',
    reverse: false,
  },
];

const GALLERY_CARDS = [
  {
    title: 'Healthy Canopy',
    badge: 'Healthy',
    badgeColor: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsHBXx7CCajnNXrt8a-D2oOJWnLaIo09jKZXoti2-1SCljcgZBWDQmHryf-ZhjneiQhFTNgSOKQ5g06VtWhLTO1fkpwkxvzVYinw1BNxwZzf53H8tA03SOdBaaEEPLSGR3AXWXxFmgF1ghj78E2KV7dWty0yQ_x9dCUwlUvOFNl9czR1sEtL3plDfKi5jiKylgdMn29nciWSphzfprJSLICjNkdmrghUnLP4DYSSMKtUDB5jwDW2OsLRQ',
    alt: 'Healthy cotton leaf',
  },
  {
    title: 'Fungal Blight',
    badge: 'Fungal Blight',
    badgeColor: 'text-rose-700 bg-rose-100 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLsU5zBX16IlUZhyZ2RTcM2m9HyYOSSFJSR56V1tMHOVRxzuEo4PWKCRxpKm7vLD3AwFqi0tkmrgsCWQnE7Ox3l4sM8wbn8or30h0W6sBK8nEchgqXMqYgo5GwMmt8bSrJkcuYRZ0dnsSSlJNwRiwb3GUV1Xgv8zTUFoqWne_QnBHy5ftox2ML3ynnI93Dnl44E2uGT9xCe5c5j4ATiGPM2qqXe4R9N7exXXq60HDBASsNpWJWmeUQ-8iw',
    alt: 'Fungal blight on cotton leaf',
  },
  {
    title: 'Viral Leaf Curl',
    badge: 'Viral Leaf Curl',
    badgeColor: 'text-amber-700 bg-amber-100 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLv1dGo3CBI1C5hvtR9iBo224VXSKpwhorpYlpKhYi_J6LYPBWZZZWnrGzjIs5Q6sqmCzSK1rZz_P5LD6Ax9tuZBqpDN87_jFn2Vvtgz2wc8ewZUSwefcglbTfpCaemVV460DIsByV0LW-E2iQRdlRESgKslZhoH0QLTg6kk8olQOmuksI6sil9-zSPOaZPEumGz45Wxr6x1WpsPLr0u8Zuevk4xKsU1xMd0AByR_ijzmpygW4jN4lwoUAQ',
    alt: 'Cotton leaf curl virus',
  },
  {
    title: 'Bacterial Spot',
    badge: 'Bacterial Spot',
    badgeColor: 'text-rose-700 bg-rose-100 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLt109cmOzyIy4mErRw823YeNmx3LtipprciLvQhdr4zwRIfxPgaSRgEvoRsXjD_qmvxn0BJgbyKjhzxRhaHwa-3FHP0S0PoEnO3bIEK6bkm40tvABuiU_TSP9eJ6PowiOKxb9a0BIWmIPhCJyEHENUEvxOpm5UM71g9YTFk9UWQGsOVmEasD1I2FxwbiYY_E_Wv7tkNsfVW0dbc72hutbljabKBsCl4wxOOiVQDkhAy88HZgEgeU5K7GOM',
    alt: 'Bacterial leaf spot lesion',
  },
  {
    title: 'Nutrient Deficiency',
    badge: 'Nutrient Deficiency',
    badgeColor: 'text-amber-700 bg-amber-100 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLtZcOLz1PXooqFsczqmO16ykoHTBD0pDQNT23HKeGIczXeaot9Q_oFksghXj9Y0DVmqubtDa_U8G6JyULdb_2RQ_47tkGh9FR5wTFqEQRKzDQyfQskMJU6flY9uaPpT9o0PTISBLNFZ44rWXjv6mCwkTMEYMAzt14Ep6w-uvIWXHSMHW3Bjfvg0F8SSsSHMpGqRujCryqP2_AjNxZ5mXXRkT1mP8BVnHKpmedsEB8C27nvIPjW4XkUqrY4',
    alt: 'Magnesium nutrient deficiency on cotton foliage',
  },
  {
    title: 'Pest Damage',
    badge: 'Pest Damage',
    badgeColor: 'text-rose-700 bg-rose-100 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvUpNS0RsSI09sJ2eC9v23SA_TwEev1YSvoPdOVHLctfW0kpgj2hZPpBWVlsynFm3F3TTFXpArr8H7EqDy9N7JZByba_J3ir0ET4_cT2ZAiedUz9e0S-xZdZVVjviJvBkUdzZTbyJZ-OkW0Jm1ab2B9t_mhmStYcOh73pGHMeDGFKCkEPMGXMwZ5je2CuZZzlWhGc7zundOFNLeROR6UQc5RM5aZ4XgpasHt8WuJV63dVh7ePW36rjLPho',
    alt: 'Pest damage on cotton leaf',
  },
];

const FAQS = [
  {
    q: 'Does it work offline?',
    a: 'Yes! The core inference engine can run locally on your device as a PWA (Progressive Web App), allowing you to browse diseases, calculate dosages, and generate PDF reports even without an internet connection in remote fields.',
  },
  {
    q: 'Which languages are supported?',
    a: 'Currently, AgriLens supports English, Hindi (हिंदी), and Marathi (मराठी), including voice-guided instructions and text-to-speech audio tailored for local cotton farmers.',
  },
  {
    q: 'How accurate is the dosage calculation?',
    a: 'The dosage calculations are based on standard agronomic baselines (200L water per acre). You input your field acreage, and the app deterministically computes the precise dilution and active product grams needed for the identified pathology.',
  },
];

/* ──────────────────────────────────────────────────────────
   MAIN LANDING PAGE COMPONENT
   ────────────────────────────────────────────────────────── */

export function Landing() {
  useDocumentTitle('AgriLens — AI Cotton Pathology Advisory');

  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Modals state
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Scroll tracking for parallax
  useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Animation variants
  const sectionReveal: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const staggerContainer: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
    },
  };

  const staggerChild: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="bg-[#f4fcf0] dark:bg-earth-900 min-h-screen flex flex-col text-earth-900 dark:text-white font-sans selection:bg-primary-500 selection:text-white relative overflow-x-hidden">

      {/* ─── PROCEDURAL SHADER & STATIC PATTERN OVERLAY ─── */}
      <LandingShader />
      <div className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* ─── 1. TOP NAVBAR ─── */}
      <header className="sticky top-0 inset-x-0 z-50 bg-[#f4fcf0]/80 dark:bg-earth-900/80 backdrop-blur-xl border-b border-earth-200/60 dark:border-earth-800 transition-colors">
        <nav className="flex items-center justify-between p-4 sm:p-5 lg:px-8 max-w-7xl mx-auto" aria-label="Global Navigation">
          <Link to="/" className="flex-shrink-0" aria-label="AgriLens">
            <AgriLensLogo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-xs font-bold text-earth-700 dark:text-earth-200 hover:text-primary-700 dark:hover:text-primary-400">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="text-xs font-bold bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full px-5 py-2 shadow-xs flex items-center gap-1.5 transition-transform hover:-translate-y-0.5">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow z-10 relative">

        {/* ─── 2. HERO SECTION ─── */}
        <section
          ref={heroRef}
          className="max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-20 lg:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Heading & Call to Actions */}
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/90 dark:bg-primary-950/80 border border-primary-300 dark:border-primary-800 text-primary-800 dark:text-primary-300 text-xs font-bold shadow-xs">
                <span>🌾</span>
                <span>AI-Powered Cotton Pathology & Treatment Advisory</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-earth-950 dark:text-white font-heading leading-[1.12]">
                Instant Cotton Disease Diagnosis. <br className="hidden sm:inline" />
                <span className="text-primary-700 dark:text-primary-400">Exact Field Prescriptions.</span>
              </h1>

              <p className="text-base sm:text-lg text-earth-600 dark:text-earth-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Upload a leaf photo to detect crop diseases within seconds. Get precision chemical dosage calculations tailored to your exact land acreage and voice guidance in English, Hindi, and Marathi.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full px-8 py-4 font-bold shadow-lg shadow-[#16a34a]/25 flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#16a34a]/35 cursor-pointer"
                  >
                    <span>Start Leaf Scan Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border border-earth-300 dark:border-earth-700 text-earth-800 dark:text-earth-100 rounded-full px-8 py-4 font-bold bg-white/80 dark:bg-earth-800/80 backdrop-blur-md hover:bg-earth-100 dark:hover:bg-earth-700 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Explore Features
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: 3D Tilted Interactive Glassmorphic Preview */}
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 flex justify-center"
            >
              <div className="relative w-full max-w-lg bg-white/70 dark:bg-earth-800/70 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-earth-700 p-5 sm:p-6 shadow-[0_16px_40px_rgba(20,83,45,0.06)] hover:shadow-[0_24px_60px_rgba(20,83,45,0.12)] transition-all duration-700">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-earth-100 dark:bg-earth-900 border border-white/50 dark:border-earth-700">
                  <img
                    alt="Cotton leaf disease analysis preview"
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRivGBIKJJGvUFh6vX2-vV2f7Cc2D4kmzCpm9NJZTdhLSij9Y4rm4HMQEx3gaX7iKTNpgmsycM2O3jJzUB2hzFyFTwAn40QKaPGASE7KjFgDeZbQ42yEiUywjcA4bkOqMddrAGQg6IDGnzbNioTBTAKyYQqZZD0ydJnHjTkXWUrsgYXcX-T6YTRAwUGrUAl1JhYqc2BL2tnCwKr5yE2d59bcnBHwyygy5i9jtGoYueL_Jp6eFBUgqy"
                  />
                  {/* Analysis Complete Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-earth-900/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-md border border-white/60 dark:border-earth-700">
                    <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                    <span className="text-xs font-bold text-earth-950 dark:text-white">Analysis Complete</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2 px-1">
                  <div className="h-3 bg-earth-200/80 dark:bg-earth-700 rounded-full w-3/4" />
                  <div className="h-3 bg-earth-200/80 dark:bg-earth-700 rounded-full w-1/2" />
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ─── 3. IMPACT METRICS BAR ─── */}
        <section className="max-w-5xl mx-auto px-6 py-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white/80 dark:bg-earth-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-earth-200/70 dark:border-earth-700 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left"
          >
            {IMPACT_METRICS.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div key={metric.title} variants={staggerChild} className="flex items-center gap-4 group cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100/70 dark:bg-primary-950/80 flex items-center justify-center text-primary-700 dark:text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-earth-950 dark:text-white font-heading">{metric.title}</h3>
                    <p className="text-[11px] font-semibold text-earth-500 dark:text-earth-400 uppercase tracking-wider">{metric.subtitle}</p>
                  </div>
                  {index < IMPACT_METRICS.length - 1 && (
                    <div className="hidden lg:block ml-auto w-[1px] h-10 bg-earth-200 dark:bg-earth-700" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ─── 4. CULTIVATING PRECISION BANNER ─── */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative rounded-[40px] overflow-hidden min-h-[460px] flex items-center justify-center shadow-xl"
          >
            <img
              alt="Lush green cotton field"
              className="absolute inset-0 w-full h-full object-cover z-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJAr1S7OkSjgKr66-16Mvrsv0QaiLiTgWh46CMDgwrEc_tQO04e-BPjQeG--_D01761ejKj-kmNPFErv-iH8gGHqgau4XG_FBxjIN5mbzzr7N47EtBuBZ6WUNxt-k9JTqLr7QGPVlRzJIcb8Jp5PP2sNwvnM3-EJzyP2Yv7Iwa_DRDCxTC0P2J6IreCpdiS2awmNi-A8JBaY_s_USruapRENfup6DpcslerMq9ZYJut8NeSxqXhwCQ"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

            <div className="relative z-20 w-full px-6 py-16 flex flex-col items-center text-center max-w-3xl mx-auto text-white space-y-5">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight">Cultivating Precision</h2>
              <p className="text-base sm:text-xl text-white/90 font-light leading-relaxed">
                AgriLens bridges the gap between traditional wisdom and modern computer vision. We provide farmers with the clarity needed to protect their yields through intelligent, data-driven diagnostics.
              </p>
              <div className="h-1 w-16 bg-[#16a34a] rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* ─── 5. IMMERSIVE HOW IT WORKS (3 STEPS) ─── */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 space-y-24">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-earth-950 dark:text-white tracking-tight">How It Works</h2>
            <p className="text-base sm:text-xl text-earth-600 dark:text-earth-300 font-light">From capture to prescription in three simple steps.</p>
          </div>

          <div className="space-y-24">
            {STEPS.map((step) => (
              <motion.div
                key={step.number}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className={`flex flex-col ${step.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-[480px] rounded-[32px] overflow-hidden shadow-lg border border-black/5 dark:border-earth-700">
                    <img
                      alt={step.imageAlt}
                      className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                      src={step.image}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 flex flex-col items-start px-4 space-y-3">
                  <span className="text-primary-600/40 dark:text-primary-400/40 font-heading text-6xl sm:text-7xl font-extrabold tracking-tighter leading-none">
                    {step.number}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold font-heading text-earth-950 dark:text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-earth-600 dark:text-earth-300 font-light leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── 6. REAL-WORLD FIELD IMPACT BANNER ─── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative rounded-[40px] overflow-hidden min-h-[460px] flex items-center bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 shadow-sm"
          >
            <img
              alt="Lush green cotton crop canopy"
              className="absolute inset-0 w-full h-full object-cover opacity-35 dark:opacity-20 z-0 mix-blend-luminosity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzUUGddhTYzOWwq_Uh27tjRC2by6HevppM-zg3HsyKiVmIRnro0aW1fiRTkrYrxn1j2DplEiFrY5Rx88K61OKqPxj1reRRJOJyWDM5S-1YbmNmRItDOsC6mvBEfW_nJifMm0Vyp1ymRluQCmUc9zrSFhBZgXU3D0okQuZL2pCcmK5cVo8DB13bqLm9EiPl5xtB4M6DA6XUDgEni9NGGZjl79u8o94qmp1ywR5hpj88VJXKve7vDOe6"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f4fcf0] via-[#f4fcf0]/90 to-[#f4fcf0]/30 dark:from-earth-900 dark:via-earth-900/90 dark:to-earth-900/30 z-10" />

            <div className="relative z-20 w-full p-8 sm:p-14 flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
              <div className="w-full md:w-3/5 text-center md:text-left space-y-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-earth-950 dark:text-white tracking-tight">
                  Real-World Field Impact
                </h2>
                <p className="text-sm sm:text-lg text-earth-600 dark:text-earth-300 font-light leading-relaxed">
                  Deploying advanced computer vision directly to the fields, empowering farmers with immediate, actionable insights to protect their crops and secure their livelihoods with absolute confidence.
                </p>
              </div>
              <div className="w-full md:w-2/5 flex justify-center md:justify-end">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-[6px] border-white dark:border-earth-700 shadow-xl transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-700">
                  <img
                    alt="Healthy cotton boll"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc1I0p3G-0kSyoREn7YpWB1YhbYeRLuSOm8EgO_WJ6c1L9JD4JnnsefSMJVKq6zSj9zaMOm1r5TJmnvcFvvmW4HT8JB6Yr7NsH9y96bWIhLnJ1JuTBEgqj7rVYMp0wAbC-xiN6lY-ZA2AGdJp0HdWiLJARn6wsr6DRirKR5r-YBX7sILVWQ00ayO0-nQFHOs2McYkR-qwoWhJKG_HEmfJ8pB10rALjwtNIbrMqhkWV1Hbf4Ddfxm-f"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── 7. DISEASE PATHOLOGY GALLERY (6 VISUAL CARDS) ─── */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-earth-950 dark:text-white tracking-tight">
              Disease Pathology Gallery
            </h2>
            <p className="text-base sm:text-lg text-earth-600 dark:text-earth-300 font-light">
              High-confidence detection across common cotton diseases.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {GALLERY_CARDS.map((card) => (
              <motion.div
                key={card.title}
                variants={staggerChild}
                className="bg-white dark:bg-earth-800 rounded-3xl overflow-hidden p-2.5 border border-earth-200 dark:border-earth-700 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group cursor-pointer"
              >
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-earth-50 dark:bg-earth-900">
                  <img
                    alt={card.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={card.image}
                  />
                  <div className={`absolute top-3.5 right-3.5 backdrop-blur-md px-3.5 py-1 rounded-full border text-xs font-bold shadow-xs ${card.badgeColor}`}>
                    {card.badge}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── 8. PRECISION ENGINE DEEP DIVE ─── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white/80 dark:bg-earth-800/80 backdrop-blur-xl rounded-[40px] p-8 sm:p-14 border border-earth-200/80 dark:border-earth-700 flex flex-col lg:flex-row items-center gap-10 lg:gap-14 shadow-sm"
          >
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-earth-950 dark:text-white tracking-tight">
                Precision Engine
              </h2>
              <p className="text-sm sm:text-base text-earth-600 dark:text-earth-300 font-light leading-relaxed">
                Our AI model is trained on thousands of expertly annotated field samples, optimized for edge-device inference. It doesn't just identify the problem; it calculates precise chemical dosages based on your specific acreage, reducing waste and improving yield.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/80 flex items-center justify-center text-primary-700 dark:text-primary-400 group-hover:scale-110 transition-transform">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-base text-earth-900 dark:text-white font-semibold">High Validation Accuracy</span>
                </li>
                <li className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/80 flex items-center justify-center text-primary-700 dark:text-primary-400 group-hover:scale-110 transition-transform">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-base text-earth-900 dark:text-white font-semibold">&lt;120ms Inference Latency</span>
                </li>
                <li className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/80 flex items-center justify-center text-primary-700 dark:text-primary-400 group-hover:scale-110 transition-transform">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-base text-earth-900 dark:text-white font-semibold">Optimized Edge & PWA Deployment</span>
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 h-72 sm:h-96 rounded-3xl overflow-hidden border border-earth-200 dark:border-earth-700 shadow-inner group">
              <img
                alt="AgriLens Neural Engine in action"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                src="/images/precision_engine_standardized.png"
              />
            </div>
          </motion.div>
        </section>

        {/* ─── 9. SAMPLE FIELD REPORT PREVIEW ─── */}
        <section className="max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-earth-950 dark:text-white tracking-tight">
              Actionable Field Reports
            </h2>
            <p className="text-base sm:text-lg text-earth-600 dark:text-earth-300 font-light">
              Generate comprehensive PDF reports with diagnosis and calculated localized treatments.
            </p>
          </div>

          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full flex justify-center"
          >
            <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-earth-200 dark:border-earth-700 transition-transform duration-700 hover:scale-[1.02]">
              <img
                alt="Sample Diagnostic PDF Field Report"
                className="w-full h-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UlFQrXwQCzmIGu4CuQiWcXdIEv_GM5vfePrWCVLg3Xbzhdu7iCuYM7zDsfX5mmxVbXLlQiwvC2gyugO6ofiU84BWNMf84tNFjwdgHvslKndsqkpbnmNzRyM98HMxdJiNqp_bL3i5wZoTANXUwiVhcKmvG7Q0Wbg3E7EAdTbt4LHCHCz9G5bNtSsDrPlDlvHzwb7k2KbvI1NOWtHQ_mvsh3OlNgPv1bO9etiWvRYWPk-STAbFoPb8W5fQ"
              />
            </div>
          </motion.div>
        </section>

        {/* ─── 10. FREQUENTLY ASKED QUESTIONS (ACCORDION) ─── */}
        <section className="max-w-3xl mx-auto px-6 py-16 space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-earth-950 dark:text-white text-center tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="bg-white dark:bg-earth-800 rounded-2xl border border-earth-200 dark:border-earth-700 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-earth-950 dark:text-white hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-earth-600 dark:text-earth-300 leading-relaxed border-t border-earth-100 dark:border-earth-700/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 11. READY TO PROTECT YOUR YIELD? (CTA BANNER) ─── */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#00873a] text-white rounded-[40px] p-8 sm:p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-xl hover:-translate-y-1 transition-transform"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight relative z-10">
              Ready to Protect Your Yield?
            </h2>
            <p className="text-base sm:text-xl text-white/90 max-w-2xl font-light relative z-10 leading-relaxed">
              Join thousands of farmers using AI to diagnose diseases early and apply precise treatments.
            </p>
            <Link to="/register" className="relative z-10 pt-2">
              <Button size="lg" className="bg-white text-[#00873a] hover:bg-white/90 font-extrabold text-sm sm:text-base rounded-full px-8 sm:px-10 py-4 shadow-lg flex items-center gap-2 transition-transform hover:scale-105">
                <span>Start Scanning for Free</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* ─── 12. MINIMAL FOOTER ─── */}
      <footer className="bg-white/80 dark:bg-earth-900/80 backdrop-blur-md border-t border-earth-200 dark:border-earth-800 py-8 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="inline-block" aria-label="AgriLens">
              <AgriLensLogo size="md" />
            </Link>
            <p className="text-xs text-earth-500 dark:text-earth-400 font-light">
              © 2026 AgriLens. Developed as an academic project.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-earth-600 dark:text-earth-400">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setSupportOpen(true)}
              className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors cursor-pointer"
            >
              Support
            </button>
          </div>
        </div>
      </footer>

      {/* ─── 13. LEGAL MODALS ─── */}
      <LegalModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Service" icon={ShieldCheck}>
        <p className="font-bold text-earth-900 dark:text-white text-sm">Terms of Service — AgriLens Platform</p>
        <p><strong>Last Updated:</strong> August 2026</p>
        <p>By using AgriLens, you acknowledge that this platform is built as an academic prototype for educational and research evaluation purposes.</p>
        <div className="space-y-3">
          <div>
            <p className="font-bold text-earth-900 dark:text-white">1. Purpose & Scope</p>
            <p>AgriLens provides automated cotton leaf disease classification and treatment dosage calculations based on published agronomic reference rates.</p>
          </div>
          <div>
            <p className="font-bold text-earth-900 dark:text-white">2. Educational Disclaimer</p>
            <p>Recommendations are generated as an informational decision-support aid. Always consult certified agricultural extension officers before administering chemical treatments in the field.</p>
          </div>
          <div>
            <p className="font-bold text-earth-900 dark:text-white">3. Safety & PPE</p>
            <p>Users must adhere to standard chemical handling safety procedures and use recommended Personal Protective Equipment (PPE) during spraying.</p>
          </div>
        </div>
      </LegalModal>

      <LegalModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy" icon={Lock}>
        <p className="font-bold text-earth-900 dark:text-white text-sm">Privacy Policy — AgriLens Platform</p>
        <p><strong>Last Updated:</strong> August 2026</p>
        <p>Your privacy is important to us. This policy explains how information is handled on the AgriLens platform.</p>
        <div className="space-y-3">
          <div>
            <p className="font-bold text-earth-900 dark:text-white">1. Information We Collect</p>
            <p>User credentials (stored securely with bcrypt hashing), uploaded leaf scan images, scan timestamps, and diagnostic results.</p>
          </div>
          <div>
            <p className="font-bold text-earth-900 dark:text-white">2. Data Security</p>
            <p>Authentication utilizes JSON Web Tokens (JWT). We do not share or sell user data to advertising or third-party marketing networks.</p>
          </div>
          <div>
            <p className="font-bold text-earth-900 dark:text-white">3. Local Device Storage</p>
            <p>Language preferences and theme choices are stored locally on your device via standard browser localStorage.</p>
          </div>
        </div>
      </LegalModal>

      <LegalModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} title="Help & Support" icon={Headphones}>
        <p className="font-bold text-earth-900 dark:text-white text-sm">Help & Support — AgriLens</p>
        <div className="space-y-3">
          <p>For technical inquiries, academic evaluation questions, or feedback, please reach out to the project team:</p>
          <div className="bg-earth-50 dark:bg-earth-800 p-4 rounded-xl border border-earth-200 dark:border-earth-700 space-y-1.5">
            <p><strong>Support Desk:</strong> <a href="mailto:support@agrilens.in" className="text-primary-700 dark:text-primary-400 underline">support@agrilens.in</a></p>
            <p><strong>Project Classification:</strong> Final Year Academic Engineering Project</p>
            <p><strong>Response Time:</strong> 24-48 hours during evaluation cycles</p>
          </div>
        </div>
      </LegalModal>

    </div>
  );
}
