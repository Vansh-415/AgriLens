import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AgriLensLogo } from '../components/ui/AgriLensLogo';
import { useAuth } from '../context/AuthContext';
import {
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  Building2,
  FileText,
  ArrowLeft,
  Scale
} from 'lucide-react';

interface ReferenceItem {
  title: string;
  sourceName: string;
  url: string;
  description?: string;
  badges: string[];
  category: 'regulatory' | 'agronomic' | 'scientific';
}

const REFERENCES_DATA: ReferenceItem[] = [
  // Category 1 — Regulatory Authority
  {
    title: 'Central Insecticides Board & Registration Committee (CIBRC)',
    sourceName: 'Directorate of Plant Protection, Quarantine & Storage, Ministry of Agriculture & Farmers Welfare, Govt. of India',
    url: 'https://ppqs.gov.in/divisions/central-insecticide-board-registration-committee',
    description: 'Statutory government registry for approved chemical active ingredients, label claims, and regulatory safety standards across India.',
    badges: ['Government of India', 'Statutory Authority', 'National Registry'],
    category: 'regulatory'
  },

  // Category 2 — Agronomic & Research Sources
  {
    title: 'ICAR — Central Institute for Cotton Research (CICR), Nagpur — Crop Advisory',
    sourceName: 'Indian Council of Agricultural Research (ICAR-CICR)',
    url: 'https://hau.ac.in/public/pages-pdf/1602485752.pdf',
    description: 'Authoritative national advisory outlining chemical dosage formulations, weather-based spraying rules, and IPM strategies for cotton pathology.',
    badges: ['ICAR-CICR', 'National Institute', 'Crop Protection Protocol'],
    category: 'agronomic'
  },
  {
    title: 'Tamil Nadu Agricultural University (TNAU) Agritech Portal — Major Fungicides Guide',
    sourceName: 'TNAU Agritech Crop Protection Portal',
    url: 'https://agritech.tnau.ac.in/crop_protection/pdf/6_Major_use_fungicides.pdf',
    description: 'Comprehensive agricultural university portal on crop diseases, recommended active ingredients, application methods, and pre-harvest intervals.',
    badges: ['State Agri University', 'Agritech Portal', 'Fungicide Efficacy'],
    category: 'agronomic'
  },

  // Category 3 — Peer-Reviewed Scientific Sources
  {
    title: 'Antibiotics & Phyto-extracts Against Bacterial Blight of Cotton',
    sourceName: 'Indian Phytopathology (Springer Nature)',
    url: 'https://link.springer.com/article/10.1007/s42360-022-00476-x',
    description: 'Peer-reviewed research study assessing Copper Oxychloride, Streptocycline bactericide efficacy, and bio-botanical extracts against Xanthomonas.',
    badges: ['Springer Nature', 'Peer-Reviewed Journal', 'DOI: 10.1007'],
    category: 'scientific'
  },
  {
    title: 'Effect of Chemicals in Controlling Bacterial Blight of Cotton',
    sourceName: 'The Pharma Innovation Journal (2021)',
    url: 'https://www.thepharmajournal.com/archives/2021/vol10issue10/PartAL/13-4-62-946.pdf',
    description: 'Experimental investigation on field concentrations, spray intervals, and curative disease reduction index across cotton cultivars.',
    badges: ['Pharma Innovation', 'Empirical Field Trial', 'Bactericide Study'],
    category: 'scientific'
  },
  {
    title: 'Cotton Leaf Curl Virus (CLCuV) & Whitefly Vector Management',
    sourceName: 'CABI Plantwise Knowledge Bank',
    url: 'https://plantwiseplusknowledgebank.org/doi/full/10.1079/pwkb.20147801354',
    description: 'Global agronomic knowledge base on Begomovirus transmission dynamics, whitefly vector threshold (ETL), and barrier crop management.',
    badges: ['CABI International', 'Global Knowledge Bank', 'Vector Control'],
    category: 'scientific'
  }
];

export default function ReferencesPage() {
  useDocumentTitle('Data Sources & References | AgriLens');
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 px-4 sm:px-6">
      {/* Top Header Navigation */}
      <header className="pt-6 pb-4 border-b border-earth-200 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="inline-block" aria-label="AgriLens Home">
          <AgriLensLogo size="md" />
        </Link>
        <Link
          to={user ? '/dashboard' : '/'}
          className="text-xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors border border-primary-200/60 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{user ? 'Back to Dashboard' : 'Back to Home'}</span>
        </Link>
      </header>

      {/* Page Title Header */}
      <PageHeader
        title="Data Sources & References"
        description="Official regulatory authorities, peer-reviewed literature, and agricultural university research citations underpinning AgriLens diagnostics and treatment protocols."
      />

      {/* Primary Academic Disclosure Banner (No redundant top badge) */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GraduationCap className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20 flex-shrink-0 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-normal">
              <strong>AgriLens is an academic project.</strong> Disease and treatment information is compiled from the following government, research, and industry sources for academic demonstration purposes. Always verify current recommendations with a certified agricultural officer before field application.
            </p>
          </div>
        </div>
      </div>

      {/* Category 1 — Regulatory Authority */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-earth-900">
          <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading">Category 1 — Regulatory Authority</h2>
            <p className="text-xs text-earth-500">Statutory regulatory body governing registered agrochemicals in India.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {REFERENCES_DATA.filter((r) => r.category === 'regulatory').map((item, idx) => (
            <Card key={idx} className="border-earth-200 hover:border-primary-400 transition-all hover:shadow-md bg-white">
              <CardContent className="p-5 sm:p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-earth-900 leading-snug">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-700 transition-colors"
                      >
                        {item.title}
                      </a>
                    </h3>
                    <p className="text-xs font-medium text-primary-700">{item.sourceName}</p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex-shrink-0 self-start border border-primary-200"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                {item.description && (
                  <p className="text-xs text-earth-600 leading-relaxed">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.badges.map((b, bIdx) => (
                    <Badge key={bIdx} variant="outline" className="text-[10px] bg-earth-50 border-earth-200 text-earth-700">
                      {b}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Category 2 — Agronomic & Research Sources */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-earth-900">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading">Category 2 — Agronomic & Research Sources</h2>
            <p className="text-xs text-earth-500">Field advisories and crop protection guidelines from national institutes & state universities.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REFERENCES_DATA.filter((r) => r.category === 'agronomic').map((item, idx) => (
            <Card key={idx} className="border-earth-200 hover:border-emerald-500 transition-all hover:shadow-md bg-white flex flex-col justify-between">
              <CardContent className="p-5 space-y-3 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {item.badges.map((b, bIdx) => (
                      <Badge key={bIdx} variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                        {b}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-earth-900 leading-snug">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-700 transition-colors"
                    >
                      {item.title}
                    </a>
                  </h3>
                  <p className="text-[11px] font-medium text-emerald-700">{item.sourceName}</p>
                  {item.description && (
                    <p className="text-xs text-earth-600 leading-relaxed pt-1">{item.description}</p>
                  )}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-between w-full px-3.5 py-2 bg-earth-50 hover:bg-emerald-50 text-earth-800 hover:text-emerald-900 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-earth-200 hover:border-emerald-300"
                >
                  <span>View Source Reference</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Category 3 — Peer-Reviewed Scientific Sources */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-earth-900">
          <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading">Category 3 — Peer-Reviewed Scientific Sources</h2>
            <p className="text-xs text-earth-500">Published scientific papers and international plant pathology knowledge bases.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REFERENCES_DATA.filter((r) => r.category === 'scientific').map((item, idx) => (
            <Card key={idx} className="border-earth-200 hover:border-purple-500 transition-all hover:shadow-md bg-white flex flex-col justify-between">
              <CardContent className="p-5 space-y-3 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {item.badges.map((b, bIdx) => (
                      <Badge key={bIdx} variant="secondary" className="text-[10px] bg-purple-50 text-purple-800 border-purple-200">
                        {b}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-earth-900 leading-snug">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-700 transition-colors"
                    >
                      {item.title}
                    </a>
                  </h3>
                  <p className="text-[11px] font-medium text-purple-700">{item.sourceName}</p>
                  {item.description && (
                    <p className="text-xs text-earth-600 leading-relaxed pt-1">{item.description}</p>
                  )}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-between w-full px-3.5 py-2 bg-earth-50 hover:bg-purple-50 text-earth-800 hover:text-purple-900 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-earth-200 hover:border-purple-300"
                >
                  <span>Read Scientific Article</span>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Category 4 — Regulatory Transparency Note */}
      <section className="space-y-3">
        <Card className="border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white shadow-sm overflow-hidden">
          <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                    Category 4 — Regulatory Transparency
                  </span>
                  <Badge variant="success" className="text-[10px]">Pesticide Safety Verified</Badge>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-earth-900">
                  None of the chemical products referenced in this app appear on India's list of banned or restricted pesticides.
                </h3>
                <p className="text-xs text-earth-600">
                  List of Pesticides Which Are Banned, Refused Registration and Restricted in Use — Directorate of Plant Protection, Quarantine & Storage, Government of India.
                </p>
              </div>
            </div>

            <a
              href="http://ppqs.gov.in/sites/default/files/list_of_pesticides_which_are_banned_refused_registration_and_restricted_in_use.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex-shrink-0 self-start sm:self-center"
            >
              <span>View Official PPQS Banned List</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
