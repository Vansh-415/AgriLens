import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../hooks/useToast';
import { scansService } from '../../../services/scansService';
import type { PredictionData } from '../../../types/prediction';
import { getConfidenceTier, isHealthyClass } from '../../../types/prediction';
import {
  getLocalizedDiseaseName,
  getLocalizedDiseaseDescription,
  getLocalizedDiseaseSubtitle,
  getLocalizedEmergencyAction,
  formatAcreUnit
} from '../../../i18n/localizedData';
import { DiagnosticPdfReport } from '../components/DiagnosticPdfReport';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { printReportElement } from '../../../utils/printReport';
import {
  UploadCloud,
  Image as ImageIcon,
  Camera,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  FlaskConical,
  Leaf,
  CloudSun,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  Info
} from 'lucide-react';

export default function DetectPage() {
  const { t, language } = useLanguage();
  const d = t.detect;
  useDocumentTitle(d.title);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [captureSource, setCaptureSource] = useState<'upload' | 'camera' | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [landAcres, setLandAcres] = useState<number>(1.0);
  const [useTta, setUseTta] = useState<boolean>(true);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [activeTab, setActiveTab] = useState<'chemical' | 'organic' | 'preventative'>('chemical');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showProbabilityBreakdown, setShowProbabilityBreakdown] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isUnderDev, setIsUnderDev] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFileSelect = (file: File, source: 'upload' | 'camera' = 'upload') => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File Type', 'Please select a valid leaf image (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File Too Large', 'Image size must be less than 25MB.');
      return;
    }
    setSelectedFile(file);
    setCaptureSource(source);
    setPreview(URL.createObjectURL(file));
    setPrediction(null);
    setIsUnderDev(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0], 'upload');
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setCaptureSource(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPrediction(null);
    setIsUnderDev(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleRemove = handleClear;

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setIsAnalyzing(true);
      const res = await scansService.predictDisease(selectedFile, landAcres, useTta);
      if (res.success && res.data) {
        setPrediction(res.data);
        setIsUnderDev(false);
        toast.success('Diagnosis Complete', `${d.diagResult}: ${res.data.predicted_class}`);
      } else {
        toast.error('Diagnosis Failed', res.message || 'Diagnosis returned unexpected response.');
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      const rawMsg: string = err?.response?.data?.detail || err?.message || 'Failed to complete diagnosis.';
      let title = 'Diagnosis Error';
      let message = rawMsg;

      if (rawMsg.includes('IMAGE_BLURRY:')) {
        title = 'Image Too Blurry';
        message = rawMsg.replace('IMAGE_BLURRY:', '').trim();
      } else if (rawMsg.includes('NO_LEAF_DETECTED:')) {
        title = 'No Cotton Leaf Detected';
        message = rawMsg.replace('NO_LEAF_DETECTED:', '').trim();
      } else if (rawMsg.includes('LOW_RESOLUTION:')) {
        title = 'Low Resolution Image';
        message = rawMsg.replace('LOW_RESOLUTION:', '').trim();
      } else if (rawMsg.includes('CORRUPTED_IMAGE:')) {
        title = 'Unreadable Image File';
        message = rawMsg.replace('CORRUPTED_IMAGE:', '').trim();
      }

      toast.error(title, message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Not Supported', 'Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!prediction) return;

    const adv = prediction.personalized_advisory;
    const localizedDisName = isHealthyClass(prediction.predicted_class)
      ? getLocalizedDiseaseName('healthy_leaf', language)
      : getLocalizedDiseaseName(prediction.predicted_class, language);
    const emergencyActionText = getLocalizedEmergencyAction(
      isHealthyClass(prediction.predicted_class),
      adv.calculated_dosage.product_name,
      language,
      prediction.predicted_class
    );
    const textToSpeak = `
      ${localizedDisName}. ${adv.severity}.
      ${emergencyActionText}.
      ${adv.calculated_dosage.product_name}. ${adv.calculated_dosage.dosage_summary}.
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintReport = () => {
    printReportElement('agrilens-diagnostic-report-sheet');
  };

  const getSeverityBadgeClass = (severity: string) => {
    const s = severity.toLowerCase();
    if (s.includes('severe') || s.includes('high') || s.includes('critical') || s.includes('गंभीर') || s.includes('अतिधोका'))
      return 'bg-rose-100 text-rose-800 border-rose-300';
    if (s.includes('moderate') || s.includes('मध्यम')) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={d.title}
        description={d.subtitle}
      />

      {/* Acreage Context Banner */}
      <Card className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                {d.landContextTitle}
              </div>
              <h3 className="text-lg font-bold text-white">{t.common.landAcres}</h3>
              <p className="text-xs text-emerald-200">
                {d.landContextDesc}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/15">
              <label className="text-xs font-semibold text-emerald-100 whitespace-nowrap">{t.common.landAcres}:</label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={landAcres}
                onChange={(e) => setLandAcres(Math.max(0.1, parseFloat(e.target.value) || 1.0))}
                className="w-20 px-2 py-1.5 bg-white text-earth-900 font-bold rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[36px]"
              />
              <div className="flex flex-wrap gap-1.5">
                {[0.5, 1.0, 2.5, 5.0].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setLandAcres(preset)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors font-bold min-h-[36px] cursor-pointer ${
                      landAcres === preset
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-white/20 text-emerald-100 hover:bg-white/30'
                    }`}
                  >
                    {preset}A
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="h-full border-earth-200">
            <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-base font-bold text-earth-900 dark:text-white mb-3 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  {d.uploadTitle}
                </h3>

                {/* Single Cotton Leaf Guidance Callout */}
                <div className="mb-3.5 p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed font-medium flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{d.uploadGuidance}</span>
                </div>

                {!preview ? (
                  <div className="space-y-4">
                    {/* Option 1: Live Camera Button */}
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer border border-emerald-500/30 text-left"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform shadow-inner">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{d.openCamera}</span>
                            <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                              Live
                            </span>
                          </h4>
                          <p className="text-xs text-emerald-100 font-light mt-0.5">{d.cameraGuide}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Clean Divider */}
                    <div className="relative flex items-center justify-center my-1">
                      <div className="border-t border-earth-200 dark:border-earth-700 w-full" />
                      <span className="bg-white dark:bg-earth-800 px-3 text-[11px] font-extrabold text-earth-400 dark:text-earth-500 uppercase tracking-widest absolute">
                        {d.orDivider}
                      </span>
                    </div>

                    {/* Option 2: Drag & Drop / Browse Upload */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-earth-300 dark:border-earth-700 hover:border-primary-500 bg-earth-50/60 dark:bg-earth-900/40 hover:bg-primary-50/40 dark:hover:bg-earth-800/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[170px]"
                    >
                      <div className="p-3 bg-white dark:bg-earth-800 rounded-full shadow-xs mb-2.5 text-primary-600 dark:text-primary-400 border border-earth-100 dark:border-earth-700">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-earth-900 dark:text-white">{d.dragDrop}</h4>
                      <p className="text-xs text-earth-500 dark:text-earth-400 mt-0.5">{d.browseFile}</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'upload')}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden max-h-[320px] border border-earth-200 dark:border-earth-700 bg-black/5 flex items-center justify-center shadow-xs">
                      <img src={preview} alt="Scan preview" className="max-h-[320px] w-full object-contain" />
                      <button
                        onClick={handleRemove}
                        className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
                        title={t.common.clear}
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Source Indicator Tag */}
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5 border border-white/20">
                        {captureSource === 'camera' ? (
                          <>
                            <Camera className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{d.cameraSource}</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-primary-400" />
                            <span>{d.uploadSource}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-earth-600 dark:text-earth-400 bg-earth-50 dark:bg-earth-800/60 p-2.5 rounded-xl border border-earth-200 dark:border-earth-700">
                      <span className="flex items-center gap-2 font-medium truncate max-w-[200px]">
                        <ImageIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        {selectedFile?.name}
                      </span>
                      <span className="font-semibold">{(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>

                    {/* Dual Retake Actions */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCameraOpen(true)}
                        disabled={isAnalyzing}
                        className="flex-1 text-xs rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{d.retakePhoto}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                        className="flex-1 text-xs rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                        <span>{d.useFileFallback}</span>
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'upload')}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-3 pt-4 border-t border-earth-100 dark:border-earth-800">
                <div className="flex items-center justify-between text-xs text-earth-600 dark:text-earth-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useTta}
                      onChange={(e) => setUseTta(e.target.checked)}
                      className="rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="font-medium">{d.multiAngleScan}</span>
                  </label>
                  <span className="text-emerald-600 font-semibold text-[11px]">{d.enhancedAccuracy}</span>
                </div>

                <div className="flex gap-2">
                  {preview && (
                    <Button variant="outline" onClick={handleRemove} disabled={isAnalyzing} className="w-1/3">
                      {t.common.clear}
                    </Button>
                  )}
                  <Button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isAnalyzing}
                    isLoading={isAnalyzing}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isAnalyzing ? d.runningDiagnosis : t.common.runDiagnosis}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {!prediction ? (
            isUnderDev ? (
              <Card className="h-full border-amber-300 dark:border-amber-700/60 min-h-[420px] flex items-center justify-center bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 dark:from-earth-900 dark:to-earth-850 shadow-md">
                <CardContent className="text-center p-8 space-y-4 max-w-md">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wider rounded-full border border-amber-300 dark:border-amber-700">
                      {d.phase2Feature}
                    </span>
                    <h3 className="text-xl font-black text-earth-950 dark:text-white">
                      {d.featureUnderDev}
                    </h3>
                    <p className="text-xs text-earth-600 dark:text-earth-400 leading-relaxed font-medium">
                      {d.featureUnderDevDesc}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClear}
                      className="text-xs font-bold rounded-xl bg-white dark:bg-earth-800 hover:bg-earth-100 border-earth-300"
                    >
                      {d.clearTryAnother}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full border-earth-200 dark:border-earth-700 min-h-[420px] flex items-center justify-center bg-white dark:bg-earth-850">
                <CardContent className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 bg-primary-50 dark:bg-earth-800 rounded-full flex items-center justify-center mx-auto text-primary-600 dark:text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-earth-900 dark:text-white">{d.awaitingInput}</h3>
                  <p className="text-xs text-earth-500 dark:text-earth-400 max-w-md mx-auto">{d.awaitingDesc}</p>
                </CardContent>
              </Card>
            )
          ) : (
            (() => {
              const confTier = getConfidenceTier(prediction.confidence);
              const topCandidates = Object.entries(prediction.class_probabilities || {})
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3);

              if (confTier === 'uncertain') {
                return (
                  <div className="space-y-4">
                    {/* Uncertain Result Card */}
                    <Card className="border-2 border-amber-400 shadow-lg overflow-hidden bg-white">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-100 uppercase tracking-wider">
                              <AlertTriangle className="w-4 h-4 text-amber-200" />
                              {d.uncertainResult}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                              {d.diagnosisInconclusive}
                            </h2>
                            <p className="text-xs text-amber-100 mt-0.5 font-medium">
                              {d.uncertainConfidenceMsg}: {prediction.confidence_pct}
                            </p>
                          </div>

                          <div className="px-3 py-1.5 bg-white text-amber-900 font-extrabold text-xs rounded-lg shadow-sm">
                            {prediction.confidence_pct}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5 space-y-5">
                        {/* Prominent Guidance Message */}
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-xs sm:text-sm font-medium leading-relaxed">
                          {d.uncertainGuidance}
                        </div>

                        {/* Top 2-3 Candidate Diseases */}
                        <div className="space-y-3 p-4 bg-earth-50 rounded-2xl border border-earth-200">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-800">
                              {d.topCandidates}
                            </h4>
                            <span className="text-[11px] font-semibold text-earth-500">{d.sortedByProbability}</span>
                          </div>

                          <div className="space-y-2.5">
                            {topCandidates.map(([cname, prob]) => (
                              <div key={cname} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-earth-800">
                                  <span>{getLocalizedDiseaseName(cname, language)}</span>
                                  <span>{(prob * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-2 bg-earth-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.max(3, prob * 100)}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Disclaimer Footnote */}
                        <div className="flex items-start gap-2 text-[11px] text-earth-500 bg-earth-50 dark:bg-earth-800/50 px-3 py-2 rounded-lg border border-earth-200/70 dark:border-earth-700">
                          <Info className="w-3.5 h-3.5 flex-shrink-0 text-earth-400 mt-0.5" />
                          <div className="leading-snug space-y-0.5">
                            <p>{t.common.aiDisclaimer}</p>
                            <p className="text-earth-600 dark:text-earth-400 font-medium">{t.common.leafScopeDisclaimer}</p>
                          </div>
                        </div>

                        {/* Hidden Treatment Note */}
                        <div className="p-3.5 bg-earth-100 rounded-xl text-center text-xs text-earth-700 font-medium border border-earth-200">
                          {d.hiddenTreatmentNote}
                        </div>

                        {/* Primary & Secondary Actions */}
                        <div className="space-y-3 pt-1">
                          <Button
                            onClick={handleClear}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-full shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            {d.retakePhoto}
                          </Button>

                          <div className="text-center space-y-1 pt-1">
                            <button
                              onClick={() => setShowPdfModal(true)}
                              className="text-xs font-semibold text-earth-600 hover:text-earth-900 underline cursor-pointer"
                            >
                              {d.downloadAnyway}
                            </button>
                            <p className="text-[11px] text-earth-500 font-light">
                              {d.notRecommendedUncertain}
                            </p>
                          </div>
                        </div>

                        {/* Full Class Spectrum Accordion */}
                        <div className="border-t border-earth-100 pt-3">
                          <button
                            onClick={() => setShowProbabilityBreakdown(!showProbabilityBreakdown)}
                            className="flex items-center justify-between w-full text-xs font-semibold text-earth-800 hover:text-primary-700 py-1 cursor-pointer"
                          >
                            <span>{d.multiClassSpectrum}</span>
                            {showProbabilityBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {showProbabilityBreakdown && (
                            <div className="space-y-2 mt-3 p-3 bg-earth-50 rounded-lg text-xs">
                              {Object.entries(prediction.class_probabilities).map(([cname, prob]) => (
                                <div key={cname} className="space-y-1">
                                  <div className="flex justify-between font-medium text-earth-800">
                                    <span>{getLocalizedDiseaseName(cname, language)}</span>
                                    <span className="font-bold">{(prob * 100).toFixed(1)}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-earth-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-earth-400 transition-all duration-500"
                                      style={{ width: `${Math.max(1, prob * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Primary Diagnosis Banner */}
                  <Card className="border-2 border-primary-500 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-700 to-emerald-700 text-white p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            {isHealthyClass(prediction.predicted_class) ? d.healthyDiagnosisHeader : d.diagResult}
                          </div>
                          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                            <h2 className="text-2xl font-black text-white">
                              {isHealthyClass(prediction.predicted_class)
                                ? getLocalizedDiseaseName('healthy_leaf', language)
                                : getLocalizedDiseaseName(prediction.predicted_class, language)}
                            </h2>
                            <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full ${
                              isHealthyClass(prediction.predicted_class)
                                ? 'bg-emerald-300 text-emerald-950 shadow-xs'
                                : 'bg-rose-500 text-white shadow-xs'
                            }`}>
                              {isHealthyClass(prediction.predicted_class) ? t.common.healthyCanopy : t.common.pathologyFound}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-100 italic mt-0.5">
                            {getLocalizedDiseaseSubtitle(prediction.predicted_class, language)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className={`px-3 py-1 font-extrabold text-xs rounded-lg shadow-sm border ${
                            confTier === 'high'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                              : 'bg-amber-100 text-amber-950 border-amber-300'
                          }`}>
                            {confTier === 'high' ? t.common.highConfidence : t.common.moderateConfidence} ({prediction.confidence_pct})
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleToggleSpeech}
                              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${isSpeaking
                                ? 'bg-rose-500 text-white animate-pulse'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            >
                              {isSpeaking ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5" /> {t.common.stopVoice}
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" /> {t.common.listenTts}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setShowPdfModal(true)}
                              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-white text-primary-900 rounded-full hover:bg-emerald-50 transition-colors shadow-sm"
                            >
                              <FileText className="w-3.5 h-3.5 text-primary-700" /> {t.common.pdfReport}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-emerald-100 pt-4 mt-3 border-t border-white/15">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          {d.diagTime}: {prediction.prediction_time_ms} ms
                        </span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${getSeverityBadgeClass(prediction.personalized_advisory.severity)}`}>
                          {t.common.threatIndex}: {prediction.personalized_advisory.severity}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-5 space-y-4">
                      <p className="text-xs text-earth-700 leading-relaxed">
                        {isHealthyClass(prediction.predicted_class)
                          ? getLocalizedDiseaseDescription('healthy_leaf', language)
                          : getLocalizedDiseaseDescription(prediction.predicted_class, language) || prediction.personalized_advisory.description}
                      </p>

                      <div className="border-t border-earth-100 pt-3">
                        <button
                          onClick={() => setShowProbabilityBreakdown(!showProbabilityBreakdown)}
                          className="flex items-center justify-between w-full text-xs font-semibold text-earth-800 hover:text-primary-700 py-1"
                        >
                          <span>{d.multiClassSpectrum}</span>
                          {showProbabilityBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showProbabilityBreakdown && (
                          <div className="space-y-2 mt-3 p-3 bg-earth-50 rounded-lg text-xs">
                            {Object.entries(prediction.class_probabilities).map(([cname, prob]) => (
                              <div key={cname} className="space-y-1">
                                <div className="flex justify-between font-medium text-earth-800">
                                  <span>{getLocalizedDiseaseName(cname, language)}</span>
                                  <span className="font-bold">{(prob * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-earth-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${cname === prediction.predicted_class ? 'bg-primary-600' : 'bg-earth-400'
                                      }`}
                                    style={{ width: `${Math.max(1, prob * 100)}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Disclaimer Footnote */}
                  <div className="flex items-start gap-2 text-[11px] text-earth-500 px-1 py-0.5">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 text-earth-400 mt-0.5" />
                    <div className="leading-snug space-y-0.5">
                      <p>{t.common.aiDisclaimer}</p>
                      <p className="text-earth-600 dark:text-earth-400 font-medium">{t.common.leafScopeDisclaimer}</p>
                    </div>
                  </div>

                  {/* Emergency Action */}
                  <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500 text-amber-900 space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      {d.emergencyTitle}
                    </div>
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      {getLocalizedEmergencyAction(isHealthyClass(prediction.predicted_class), prediction.personalized_advisory.calculated_dosage.product_name, language, prediction.predicted_class)}
                    </p>
                  </div>

                  {/* Treatment Tabs */}
                  <Card className="border-earth-200">
                    <div className="flex border-b border-earth-200 bg-earth-50 rounded-t-xl overflow-hidden">
                      <button
                        onClick={() => setActiveTab('chemical')}
                        className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'chemical'
                          ? 'border-primary-600 text-primary-700 bg-white'
                          : 'border-transparent text-earth-600 hover:text-earth-900'
                          }`}
                      >
                        <FlaskConical className="w-4 h-4 text-primary-600" />
                        {d.tabChemical}
                      </button>
                      <button
                        onClick={() => setActiveTab('organic')}
                        className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'organic'
                          ? 'border-emerald-600 text-emerald-700 bg-white'
                          : 'border-transparent text-earth-600 hover:text-earth-900'
                          }`}
                      >
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        {d.tabOrganic}
                      </button>
                      <button
                        onClick={() => setActiveTab('preventative')}
                        className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'preventative'
                          ? 'border-teal-600 text-teal-700 bg-white'
                          : 'border-transparent text-earth-600 hover:text-earth-900'
                          }`}
                      >
                        <CloudSun className="w-4 h-4 text-teal-600" />
                        {d.tabCultural}
                      </button>
                    </div>

                    <CardContent className="p-5">
                      {activeTab === 'chemical' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-primary-50/60 rounded-xl border border-primary-200 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700">
                                  {d.recProduct}
                                </span>
                                <h4 className="text-base font-extrabold text-primary-950">
                                  {prediction.personalized_advisory.calculated_dosage.product_name}
                                </h4>
                              </div>
                              <span className="px-2.5 py-1 bg-primary-600 text-white font-bold text-xs rounded-md">
                                {landAcres} {formatAcreUnit(landAcres, language)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-primary-200/60">
                              <div>
                                <span className="text-earth-500 block text-[11px]">{d.activeIngredient}:</span>
                                <span className="font-semibold text-earth-900">
                                  {prediction.personalized_advisory.calculated_dosage.active_ingredient}
                                </span>
                              </div>
                              <div>
                                <span className="text-earth-500 block text-[11px]">{d.dosagePerAcre}:</span>
                                <span className="font-semibold text-earth-900">
                                  {prediction.personalized_advisory.calculated_dosage.dosage_per_acre}
                                </span>
                              </div>
                              <div>
                                <span className="text-earth-500 block text-[11px]">{d.totalWater}:</span>
                                <span className="font-bold text-primary-700 text-sm">
                                  {prediction.personalized_advisory.calculated_dosage.total_water_litres} Litres
                                </span>
                              </div>
                                <div>
                                  <span className="text-earth-500 block text-[11px]">{d.repeatInterval}:</span>
                                  <span className="font-semibold text-earth-900">
                                    Every {prediction.personalized_advisory.calculated_dosage.application_interval_days} {t.common.days}
                                  </span>
                                </div>
                            </div>
                          </div>

                          <div className="p-3 bg-earth-50 rounded-lg text-xs text-earth-700 border border-earth-200">
                            <span className="font-bold text-earth-900">{d.summary}: </span>
                            {prediction.personalized_advisory.calculated_dosage.dosage_summary}
                          </div>
                        </div>
                      )}

                      {activeTab === 'organic' && (
                        <div className="space-y-3">
                          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                              <Leaf className="w-4 h-4 text-emerald-600" />
                              {d.tabOrganic}
                            </h4>
                            <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
                              {prediction.personalized_advisory.biological_organic.remedy}
                            </p>
                            <p className="text-xs text-emerald-800 pt-1">
                              {prediction.personalized_advisory.biological_organic.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'preventative' && (
                        <div className="space-y-4 text-xs">
                          <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 space-y-1">
                            <div className="font-bold text-teal-950 flex items-center gap-2">
                              <CloudSun className="w-4 h-4 text-teal-600" />
                              {d.weatherRule}
                            </div>
                            <p className="text-teal-900 font-medium">
                              {prediction.personalized_advisory.weather_safety_rule}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <span className="font-bold text-earth-900 block text-xs">
                              {d.culturalTitle}:
                            </span>
                            <ul className="space-y-1.5 pl-4 list-disc text-earth-700">
                              {prediction.personalized_advisory.cultural_preventative.map((item, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })()
          )}
        </div>
      </div>



      {/* PDF Export Modal */}
      {prediction && showPdfModal && (
        <Modal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          title={t.common.pdfReport}
        >
          <div className="space-y-4">
            <div className="flex justify-end gap-2 no-print">
              <Button onClick={handlePrintReport} className="bg-primary-700 hover:bg-primary-800 text-white">
                <Printer className="w-4 h-4 mr-2" /> {t.common.printReport}
              </Button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <DiagnosticPdfReport
                prediction={prediction}
                landAcres={landAcres}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => handleFileSelect(file, 'camera')}
      />
    </div>
  );
}
