export type Language = 'en' | 'hi' | 'mr';

export interface TranslationDictionary {
  nav: {
    dashboard: string;
    detect: string;
    history: string;
    crops: string;
    diseases: string;
    treatments: string;
    assistant: string;
    profile: string;
    settings: string;
    admin: string;
  };
  common: {
    language: string;
    selectLanguage: string;
    landAcres: string;
    acres: string;
    runDiagnosis: string;
    pdfReport: string;
    printReport: string;
    listenTts: string;
    stopVoice: string;
    voiceInput: string;
    listening: string;
    typeOrSpeak: string;
    send: string;
    clear: string;
    severity: string;
    threatIndex: string;
    certainty: string;
    emergencyAction: string;
    chemicalTreatment: string;
    bioOrganicRemedy: string;
    culturalRules: string;
    waterRequired: string;
    dosagePerAcre: string;
    welcomeBack: string;
    recentScans: string;
    totalScans: string;
    healthyCanopy: string;
    pathologyFound: string;
    activeCrops: string;
    searchPlaceholder: string;
    viewDetails: string;
    logout: string;
    aiDisclaimer: string;
    highConfidence: string;
    moderateConfidence: string;
    uncertain: string;
    recent: string;
    farmer: string;
    cottonLeafScan: string;
    cancel: string;
    save: string;
    delete: string;
    more: string;
    days: string;
    viewPdfReport: string;
  };
  dashboard: {
    title: string;
    description: string;
    weeklyScanVolume: string;
    noScanActivity: string;
    noScanDesc: string;
    noRecentScans: string;
    noRecentDesc: string;
  };
  history: {
    title: string;
    description: string;
    noHistory: string;
    noHistoryDesc: string;
    runNewScan: string;
  };
  crops: {
    title: string;
    description: string;
    growingPeriod: string;
    idealTemp: string;
    waterNeed: string;
    soilType: string;
    keyPests: string;
  };
  profile: {
    title: string;
    description: string;
    fullName: string;
    email: string;
    phone: string;
    farmLocation: string;
    totalLand: string;
    role: string;
    saveChanges: string;
    personalCredentials: string;
    accountSecurity: string;
    currentPassword: string;
    newPassword: string;
    updatePassword: string;
  };
  settings: {
    title: string;
    description: string;
    appearance: string;
    themeMode: string;
    notifications: string;
    voiceSettings: string;
    audioOutputSpeed: string;
    pwaInstallTitle: string;
    pwaInstallHeading: string;
    pwaInstallDesc: string;
    appInstalled: string;
    installApp: string;
    preferredLanguage: string;
    languageSelectDesc: string;
    light: string;
    dark: string;
    system: string;
    connectivityStatus: string;
    networkStatus: string;
    networkMonitorDesc: string;
    online: string;
    offline: string;
    pwaTitle: string;
    pwaCacheDesc: string;
    pwaActive: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    contactSupport: string;
    rightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    liveBadge: string;
    speakingBadge: string;
    fieldSize: string;
    askTopics: string;
    resetChat: string;
    copyText: string;
    copied: string;
    speakMsg: string;
    stopMsg: string;
    disclaimer: string;
    voiceInputHelp: string;
    audioReadoutHelp: string;
    dosageScaleHelp: string;
  };
  detect: {
    title: string;
    subtitle: string;
    landContextTitle: string;
    landContextDesc: string;
    uploadTitle: string;
    dragDrop: string;
    browseFile: string;
    multiAngleScan: string;
    enhancedAccuracy: string;
    runningDiagnosis: string;
    awaitingInput: string;
    awaitingDesc: string;
    diagResult: string;
    diagTime: string;
    multiClassSpectrum: string;
    emergencyTitle: string;
    tabChemical: string;
    tabOrganic: string;
    tabCultural: string;
    recProduct: string;
    activeIngredient: string;
    dosagePerAcre: string;
    totalWater: string;
    repeatInterval: string;
    summary: string;
    weatherRule: string;
    culturalTitle: string;
    openCamera: string;
    takePhoto: string;
    capturePhoto: string;
    switchCamera: string;
    cameraGuide: string;
    cameraUnavailable: string;
    useFileFallback: string;
    retakePhoto: string;
    orDivider: string;
    cameraSource: string;
    uploadSource: string;
    uncertainResult: string;
    diagnosisInconclusive: string;
    uncertainConfidenceMsg: string;
    uncertainGuidance: string;
    topCandidates: string;
    sortedByProbability: string;
    hiddenTreatmentNote: string;
    downloadAnyway: string;
    notRecommendedUncertain: string;
    healthyDiagnosisHeader: string;
    phase2Feature: string;
    featureUnderDev: string;
    featureUnderDevDesc: string;
    clearTryAnother: string;
  };
  diseases: {
    title: string;
    subtitle: string;
    allThreats: string;
    criticalThreat: string;
    highSeverity: string;
    moderateStress: string;
    normalHealthy: string;
    diseaseIndexScore: string;
    etl: string;
    vulnerableStage: string;
    keySymptoms: string;
    viewProtocol: string;
    causalAgent: string;
    descAndPathology: string;
    curativeProtocol: string;
    chemicalProduct: string;
    standardDosage: string;
    bioOrganicAlternative: string;
    stage: string;
  };
  treatments: {
    title: string;
    subtitle: string;
    allProtocols: string;
    chemicalInterventions: string;
    organicInterventions: string;
    biologicalInterventions: string;
    phi: string;
    ratePerAcre: string;
    activeFormulation: string;
    viewDosageSafety: string;
    commercialBrands: string;
    requiredPpe: string;
    safetyPrecaution: string;
    bioControl: string;
    category: string;
    dosageRules: string;
    sprayDilution: string;
    repeatApplication: string;
    daysWaiting: string;
  };
  pdfReport: {
    title: string;
    subtitle: string;
    refNo: string;
    date: string;
    targetCrop: string;
    landSize: string;
    primaryPathology: string;
    certaintyScore: string;
    threatRating: string;
    observation: string;
    emergencyContainment: string;
    prescriptionTitle: string;
    totalWater: string;
    specification: string;
    prescription: string;
    fieldCalculation: string;
    recProduct: string;
    activeFormulation: string;
    applicationSchedule: string;
    phiWaiting: string;
    bioAlternative: string;
    weatherRule: string;
    preventiveMeasures: string;
    footerNote: string;
    officerSignoff: string;
  };
  admin: {
    title: string;
    description: string;
    addRecord: string;
    management: string;
    noRecords: string;
    createRecord: string;
    confirmDeletion: string;
    deleteConfirmDesc: string;
    name: string;
    associatedCrop: string;
    treatmentType: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      detect: 'Detect Disease',
      history: 'Scan History',
      crops: 'Crop Library',
      diseases: 'Disease Index',
      treatments: 'Treatments',
      assistant: 'AI Assistant',
      profile: 'Profile',
      settings: 'Settings',
      admin: 'Admin Panel',
    },
    common: {
      language: 'Language',
      selectLanguage: 'Select Language',
      landAcres: 'Land Area (Acres)',
      acres: 'Acres',
      runDiagnosis: 'Run Field Diagnosis',
      pdfReport: 'PDF Report',
      printReport: 'Print / Download 1-Page PDF Report',
      listenTts: '🔊 Listen (TTS)',
      stopVoice: 'Stop Voice',
      voiceInput: '🎤 Voice Input',
      listening: 'Listening...',
      typeOrSpeak: 'Type or speak your crop question...',
      send: 'Send',
      clear: 'Clear',
      severity: 'Severity',
      threatIndex: 'Threat Level',
      certainty: 'Diagnostic Score',
      emergencyAction: 'Immediate Action Needed (Next 24-48 Hours)',
      chemicalTreatment: 'Recommended Chemical Spray',
      bioOrganicRemedy: 'Organic Remedy',
      culturalRules: 'Field Guidelines',
      waterRequired: 'Total Water Needed',
      dosagePerAcre: 'Dosage Per Acre',
      welcomeBack: 'Welcome back',
      recentScans: 'Recent Field Scans',
      totalScans: 'Total Scans',
      healthyCanopy: 'Healthy Leaf',
      pathologyFound: 'Disease Found',
      activeCrops: 'Active Fields',
      searchPlaceholder: 'Search disease or treatment...',
      viewDetails: 'View Details',
      logout: 'Logout',
      aiDisclaimer: 'AI predictions may sometimes be inaccurate. Please verify with an agricultural expert before taking action.',
      highConfidence: 'High Confidence',
      moderateConfidence: 'Moderate Confidence',
      uncertain: 'Uncertain',
      recent: 'Recent',
      farmer: 'Farmer',
      cottonLeafScan: 'Cotton Leaf Scan',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      more: 'more',
      days: 'Days',
      viewPdfReport: 'View PDF Report',
    },
    dashboard: {
      title: 'Dashboard',
      description: 'Cotton crop disease diagnosis and field scan records.',
      weeklyScanVolume: 'Weekly Scan Volume',
      noScanActivity: 'No scan activity yet',
      noScanDesc: 'Scan metrics will appear here once you perform leaf disease scans.',
      noRecentScans: 'No recent scans',
      noRecentDesc: 'Your recent crop scans will appear here.',
    },
    history: {
      title: 'Crop Scan History',
      description: 'Saved leaf scan history and PDF advisory reports.',
      noHistory: 'No scan history found',
      noHistoryDesc: 'Your saved scans and PDF reports will appear here.',
      runNewScan: 'Run New Scan',
    },
    crops: {
      title: 'Cotton Crop Guide',
      description: 'Guide to cotton growth stages, soil types, and climate conditions.',
      growingPeriod: 'Growing Period',
      idealTemp: 'Ideal Temperature',
      waterNeed: 'Water Needed',
      soilType: 'Soil Type',
      keyPests: 'Key Pests & Diseases',
    },
    profile: {
      title: 'Profile Settings',
      description: 'Manage your name, contact info, and field parameters.',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      farmLocation: 'Farm Location',
      totalLand: 'Total Field Area',
      role: 'Role',
      saveChanges: 'Save Changes',
      personalCredentials: 'Personal Credentials',
      accountSecurity: 'Account Security',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      updatePassword: 'Update Password',
    },
    settings: {
      title: 'Settings & Preferences',
      description: 'Set language, theme modes, and app preferences.',
      appearance: 'Theme Mode',
      themeMode: 'Color Theme',
      notifications: 'Alerts',
      voiceSettings: 'Voice Settings',
      audioOutputSpeed: 'Speech Speed',
      pwaInstallTitle: 'Progressive Web App (PWA) Mobile Install',
      pwaInstallHeading: 'Install AgriLens on Home Screen',
      pwaInstallDesc: 'AgriLens can be installed directly onto your Android, iPhone, or Desktop home screen as a standalone offline mobile application.',
      appInstalled: 'App Installed ✓',
      installApp: 'Install Mobile App',
      preferredLanguage: 'Platform Preferred Language',
      languageSelectDesc: 'Select global language for full site translation & voice AI:',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      connectivityStatus: 'Connectivity & PWA Status',
      networkStatus: 'Network Status',
      networkMonitorDesc: 'Real-time connection monitor',
      online: '🟢 Online',
      offline: '🔴 Offline Field Mode Active',
      pwaTitle: 'Progressive Web App (PWA)',
      pwaCacheDesc: 'Service worker & offline cache active',
      pwaActive: 'Active (Offline Ready)',
    },
    footer: {
      tagline: 'Smart Cotton Disease Detection & Treatment Advisory Platform.',
      quickLinks: 'Quick Links',
      contactSupport: 'Support',
      rightsReserved: 'All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
    },
    assistant: {
      title: 'AI Crop Advisory Assistant',
      subtitle: 'Ask questions about cotton diseases, active chemical dosages, organic remedies, and weather spraying rules.',
      liveBadge: 'AI Agronomist Active',
      speakingBadge: 'Speaking...',
      fieldSize: 'Field Acreage',
      askTopics: 'Common Advisory Topics',
      resetChat: 'Reset Conversation',
      copyText: 'Copy Text',
      copied: 'Copied!',
      speakMsg: 'Listen',
      stopMsg: 'Stop Voice',
      disclaimer: 'Educational Agronomic Advisory: Baseline dosage calculations based on standard agronomic rates (200L/acre).',
      voiceInputHelp: 'Speak to ask queries directly in your chosen language',
      audioReadoutHelp: 'Listen to spoken answers with interactive audio controls',
      dosageScaleHelp: 'Adjust field acreage to automatically scale spray quantities',
    },
    detect: {
      title: 'Leaf Disease Diagnosis Studio',
      subtitle: 'Upload a cotton leaf photo for instant disease detection and field dosage calculations.',
      landContextTitle: 'Your Field Size',
      landContextDesc: 'Set your land acreage to calculate total spray water and chemical dosage.',
      uploadTitle: 'Upload Leaf Photo',
      dragDrop: 'Drag & Drop leaf photo here',
      browseFile: 'or click to choose photo (JPEG, PNG, WEBP max 10MB)',
      multiAngleScan: 'Multi-Angle Precision Scan',
      enhancedAccuracy: 'High Accuracy',
      runningDiagnosis: 'Analyzing Photo...',
      awaitingInput: 'Upload a Leaf Photo',
      awaitingDesc: 'Upload a leaf photo on the left and click "Run Field Diagnosis".',
      diagResult: 'Diagnosis Result',
      diagTime: 'Scan Time',
      multiClassSpectrum: 'Disease Probabilities',
      emergencyTitle: 'Immediate Action Needed (Next 24-48 Hours)',
      tabChemical: 'Chemical Spray',
      tabOrganic: 'Organic Remedy',
      tabCultural: 'Field Rules',
      recProduct: 'Recommended Chemical',
      activeIngredient: 'Active Ingredient',
      dosagePerAcre: 'Dosage Per Acre',
      totalWater: 'Total Water Needed',
      repeatInterval: 'Repeat Interval',
      summary: 'Dosage Summary',
      weatherRule: 'Weather Spray Rule',
      culturalTitle: 'Preventive Care Guidelines',
      openCamera: 'Open Live Camera',
      takePhoto: 'Take Photo',
      capturePhoto: 'Capture Photo',
      switchCamera: 'Switch Camera',
      cameraGuide: 'Align cotton leaf within the guide frame',
      cameraUnavailable: 'Camera is unavailable or permission was denied.',
      useFileFallback: 'Choose from Files Instead',
      retakePhoto: 'Retake Photo',
      orDivider: 'OR',
      cameraSource: 'Captured with Live Camera',
      uploadSource: 'Uploaded Leaf Image',
      uncertainResult: 'Uncertain Result',
      diagnosisInconclusive: 'Diagnosis Inconclusive',
      uncertainConfidenceMsg: 'Confidence score is below the 65% certainty threshold',
      uncertainGuidance: "We couldn't confidently identify the disease. Try retaking the photo with better lighting, a closer angle, or a cleaner background.",
      topCandidates: 'Top Candidate Diseases',
      sortedByProbability: 'Sorted by AI probability',
      hiddenTreatmentNote: 'Treatment recommendations are hidden until the disease is confidently identified.',
      downloadAnyway: 'Download Report Anyway',
      notRecommendedUncertain: 'Not recommended — confidence is too low for a reliable diagnosis.',
      healthyDiagnosisHeader: 'Healthy Canopy Diagnosis',
      phase2Feature: 'Phase 2 Feature',
      featureUnderDev: 'Feature Under Development',
      featureUnderDevDesc: 'AI Leaf Disease Inference pipeline, automated pathology classification, and chemical dosage formulation will be activated in Phase 2.',
      clearTryAnother: 'Clear & Try Another Photo',
    },
    diseases: {
      title: 'Cotton Disease Index',
      subtitle: 'Catalog of cotton leaf diseases, symptoms, and treatment options.',
      allThreats: 'All Threat Levels',
      criticalThreat: 'Critical Threat',
      highSeverity: 'High Threat',
      moderateStress: 'Moderate Threat',
      normalHealthy: 'Healthy Leaf',
      diseaseIndexScore: 'Threat Score',
      etl: 'Pest Threshold (ETL)',
      vulnerableStage: 'Vulnerable Stage',
      keySymptoms: 'Main Symptoms',
      viewProtocol: 'View Treatment',
      causalAgent: 'Causal Agent',
      descAndPathology: 'Description & Pathology',
      curativeProtocol: 'Curative Protocol Recommendation',
      chemicalProduct: 'Chemical Product',
      standardDosage: 'Standard Dosage',
      bioOrganicAlternative: 'Bio-Organic Alternative',
      stage: 'Stage',
    },
    treatments: {
      title: 'Treatment Protocols',
      subtitle: 'Guide to spray solutions, chemical dosages, and field safety rules.',
      allProtocols: 'All Treatments',
      chemicalInterventions: 'Chemical Sprays',
      organicInterventions: 'Organic Remedies',
      biologicalInterventions: 'Bio-Controls',
      phi: 'Waiting Days (PHI)',
      ratePerAcre: 'Rate Per Acre',
      activeFormulation: 'Active Ingredient',
      viewDosageSafety: 'View Dosage & Safety',
      commercialBrands: 'Common Brand Names',
      requiredPpe: 'Safety Gear (PPE)',
      safetyPrecaution: 'Safety Precaution',
      bioControl: 'Bio-Control',
      category: 'Category',
      dosageRules: 'Standard Dosage & Dilution Rules',
      sprayDilution: 'Spray Water Dilution',
      repeatApplication: 'Repeat Application',
      daysWaiting: 'Days Waiting',
    },
    pdfReport: {
      title: 'AgriLens Pathology Report',
      subtitle: 'Cotton Crop Diagnostic & Treatment Summary',
      refNo: 'REF #',
      date: 'Date',
      targetCrop: 'Crop: Cotton (Gossypium hirsutum)',
      landSize: 'Field Size',
      primaryPathology: 'Detected Disease',
      certaintyScore: 'Diagnostic Score',
      threatRating: 'Threat Level',
      observation: 'Field Observation',
      emergencyContainment: 'Immediate Action Needed (Next 24-48 Hours)',
      prescriptionTitle: 'Recommended Treatment Plan',
      totalWater: 'Total Water Needed',
      specification: 'Item',
      prescription: 'Details',
      fieldCalculation: 'Calculation',
      recProduct: 'Recommended Product',
      activeFormulation: 'Active Ingredient',
      applicationSchedule: 'Spray Schedule',
      phiWaiting: 'Waiting Days (PHI)',
      bioAlternative: 'Organic Alternative',
      weatherRule: 'Weather Rule',
      preventiveMeasures: 'Preventive Guidelines',
      footerNote: 'Generated Advisory Report for Cotton Field Management.',
      officerSignoff: 'Advisory Summary',
    },
    admin: {
      title: 'Admin Control Center',
      description: 'Manage crop catalogues, disease profiles, and treatment protocols with full CRUD permissions.',
      addRecord: 'Add',
      management: 'Management',
      noRecords: 'No records found.',
      createRecord: 'Create Record',
      confirmDeletion: 'Confirm Deletion',
      deleteConfirmDesc: 'Are you sure you want to delete this record? This action cannot be undone.',
      name: 'Name',
      associatedCrop: 'Associated Crop',
      treatmentType: 'Treatment Type',
    },
  },
  hi: {
    nav: {
      dashboard: 'डैशबोर्ड',
      detect: 'रोग पहचान',
      history: 'स्कैन इतिहास',
      crops: 'फसल गाइड',
      diseases: 'रोग सूचकांक',
      treatments: 'उपचार',
      assistant: 'एआई सहायक',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्स',
      admin: 'एडमिन पैनल',
    },
    common: {
      language: 'भाषा',
      selectLanguage: 'भाषा चुनें',
      landAcres: 'खेत का आकार (एकड़)',
      acres: 'एकड़',
      runDiagnosis: 'रोग जांच करें',
      pdfReport: 'पीडीएफ रिपोर्ट',
      printReport: '1-पेज रिपोर्ट प्रिंट करें',
      listenTts: '🔊 सुनें',
      stopVoice: 'आवाज बंद करें',
      voiceInput: '🎤 बोलकर पूछें',
      listening: 'सुन रहा है...',
      typeOrSpeak: 'अपना सवाल लिखें या बोलें...',
      send: 'भेजें',
      clear: 'हटाएं',
      severity: 'गंभीरता',
      threatIndex: 'खतरा स्तर',
      certainty: 'सटीकता',
      emergencyAction: 'तत्काल जरूरी कदम (24-48 घंटे)',
      chemicalTreatment: 'रासायनिक दवा छिड़काव',
      bioOrganicRemedy: 'जैविक उपाय',
      culturalRules: 'खेत के नियम',
      waterRequired: 'कुल आवश्यक पानी',
      dosagePerAcre: 'प्रति एकड़ दवा मात्रा',
      welcomeBack: 'स्वागत है',
      recentScans: 'हाल के स्कैन',
      totalScans: 'कुल स्कैन',
      healthyCanopy: 'स्वस्थ पत्ती',
      pathologyFound: 'रोग मिला',
      activeCrops: 'पंजीकृत खेत',
      searchPlaceholder: 'रोग या दवा खोजें...',
      viewDetails: 'विवरण देखें',
      logout: 'लॉगआउट',
      aiDisclaimer: 'एआई भविष्यवाणियां कभी-कभी गलत हो सकती हैं। कोई भी कदम उठाने से पहले कृपया किसी कृषि विशेषज्ञ से पुष्टि करें।',
      highConfidence: 'उच्च सटीकता',
      moderateConfidence: 'मध्यम सटीकता',
      uncertain: 'अनिश्चित',
      recent: 'हाल का',
      farmer: 'किसान',
      cottonLeafScan: 'कपास पत्ती स्कैन',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      more: 'अधिक',
      days: 'दिन',
      viewPdfReport: 'पीडीएफ रिपोर्ट देखें',
    },
    dashboard: {
      title: 'डैशबोर्ड',
      description: 'कपास फसल रोग पहचान और खेत रिकॉर्ड।',
      weeklyScanVolume: 'साप्ताहिक स्कैन मात्रा',
      noScanActivity: 'अभी कोई स्कैन नहीं है',
      noScanDesc: 'जांच करने के बाद स्कैन आंकड़े यहां दिखाई देंगे।',
      noRecentScans: 'कोई हाल का स्कैन नहीं',
      noRecentDesc: 'आपके हाल के स्कैन यहां दिखेंगे।',
    },
    history: {
      title: 'स्कैन इतिहास',
      description: 'सहेजे गए स्कैन और पीडीएफ रिपोर्ट रिकॉर्ड।',
      noHistory: 'कोई इतिहास नहीं मिला',
      noHistoryDesc: 'आपके सहेजे गए स्कैन यहां दिखेंगे।',
      runNewScan: 'नया स्कैन करें',
    },
    crops: {
      title: 'कपास फसल गाइड',
      description: 'कपास विकास, मिट्टी और मौसम की आसान जानकारी।',
      growingPeriod: 'फसल अवधि',
      idealTemp: 'सही तापमान',
      waterNeed: 'पानी की जरूरत',
      soilType: 'मिट्टी का प्रकार',
      keyPests: 'मुख्य कीट और रोग',
    },
    profile: {
      title: 'प्रोफाइल सेटिंग्स',
      description: 'अपना नाम, संपर्क और खेत का आकार बदलें।',
      fullName: 'पूरा नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर',
      farmLocation: 'खेत का पता',
      totalLand: 'कुल खेत का आकार',
      role: 'भूमिका',
      saveChanges: 'बदलाव सहेजें',
      personalCredentials: 'व्यक्तिगत जानकारी',
      accountSecurity: 'खाता सुरक्षा',
      currentPassword: 'वर्तमान पासवर्ड',
      newPassword: 'नया पासवर्ड',
      updatePassword: 'पासवर्ड अपडेट करें',
    },
    settings: {
      title: 'सेटिंग्स',
      description: 'भाषा, थीम और ऐप सेटिंग्स बदलें।',
      appearance: 'थीम',
      themeMode: 'कलर थीम',
      notifications: 'सूचनाएं',
      voiceSettings: 'आवाज सेटिंग्स',
      audioOutputSpeed: 'बोलने की गति',
      pwaInstallTitle: 'प्रोग्रेसिव वेब ऐप (PWA) मोबाइल इंस्टाल',
      pwaInstallHeading: 'एग्रीलेंस को होम स्क्रीन पर इंस्टॉल करें',
      pwaInstallDesc: 'एग्रीलेंस को सीधे अपने एंड्रॉयड, आईफोन या डेस्कटॉप होम स्क्रीन पर ऑफलाइन मोबाइल ऐप के रूप में इंस्टॉल किया जा सकता है।',
      appInstalled: 'ऐप इंस्टॉल है ✓',
      installApp: 'मोबाइल ऐप इंस्टॉल करें',
      preferredLanguage: 'प्लेटफॉर्म पसंदीदा भाषा',
      languageSelectDesc: 'संपूर्ण अनुवाद और आवाज एआई के लिए भाषा चुनें:',
      light: 'लाइट',
      dark: 'डार्क',
      system: 'सिस्टम',
      connectivityStatus: 'कनेक्टिविटी और PWA स्थिति',
      networkStatus: 'नेटवर्क स्थिति',
      networkMonitorDesc: 'रीयल-टाइम कनेक्शन मॉनिटर',
      online: '🟢 ऑनलाइन',
      offline: '🔴 ऑफलाइन फील्ड मोड सक्रिय',
      pwaTitle: 'प्रोग्रेसिव वेब ऐप (PWA)',
      pwaCacheDesc: 'सर्विस वर्कर और ऑफलाइन कैश सक्रिय',
      pwaActive: 'सक्रिय (ऑफलाइन तैयार)',
    },
    footer: {
      tagline: 'कपास फसल रोग पहचान एवं दवा सलाह मंच।',
      quickLinks: 'क्विक लिंक्स',
      contactSupport: 'सहायता',
      rightsReserved: 'सर्वाधिकार सुरक्षित।',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा शर्तें',
    },
    assistant: {
      title: 'एआई फसल सलाहकार',
      subtitle: 'कपास रोगों, दवा की मात्रा, जैविक उपायों और मौसम नियमों पर प्रश्न पूछें।',
      liveBadge: 'एआई सलाहकार सक्रिय',
      speakingBadge: 'आवाज जारी है...',
      fieldSize: 'खेत का आकार',
      askTopics: 'प्रमुख सलाह विषय',
      resetChat: 'बातचीत रीसेट करें',
      copyText: 'कॉपी करें',
      copied: 'कॉपी हो गया!',
      speakMsg: 'सुनें',
      stopMsg: 'रोकें',
      disclaimer: 'शैक्षणिक कृषि सलाह: 200 लीटर/एकड़ मानक आधार पर दवा की गणना।',
      voiceInputHelp: 'अपनी भाषा में बोलकर सीधे प्रश्न पूछें',
      audioReadoutHelp: 'जवाबों को आवाज में सुनने और रोकने का नियंत्रण',
      dosageScaleHelp: 'एकड़ बदलकर दवा और पानी की मात्रा तुरंत जानें',
    },
    detect: {
      title: 'पत्ती रोग जांच स्टूडियो',
      subtitle: 'कपास पत्ती की फोटो अपलोड करें और तुरंत रोग तथा दवा की मात्रा जानें।',
      landContextTitle: 'खेत का आकार',
      landContextDesc: 'पानी और दवा की सही मात्रा जानने के लिए एकड़ चुनें।',
      uploadTitle: 'पत्ती की फोटो अपलोड करें',
      dragDrop: 'फोटो यहां खींचकर छोड़ें',
      browseFile: 'या गैलरी से फोटो चुनें (अधिकतम 10MB)',
      multiAngleScan: 'सटीक स्कैनिंग',
      enhancedAccuracy: 'उच्च सटीकता',
      runningDiagnosis: 'जांच जारी है...',
      awaitingInput: 'पत्ती की फोटो अपलोड करें',
      awaitingDesc: 'बाएं फोटो अपलोड करें और "रोग जांच करें" पर क्लिक करें।',
      diagResult: 'जांच का परिणाम',
      diagTime: 'स्कैन समय',
      multiClassSpectrum: 'रोग संभावना',
      emergencyTitle: 'तत्काल जरूरी कदम (24-48 घंटे)',
      tabChemical: 'रासायनिक दवा',
      tabOrganic: 'जैविक उपाय',
      tabCultural: 'खेत नियम',
      recProduct: 'अनुशंसित दवा',
      activeIngredient: 'मुख्य घटक',
      dosagePerAcre: 'प्रति एकड़ खुराक',
      totalWater: 'कुल आवश्यक पानी',
      repeatInterval: 'छिड़काव समय',
      summary: 'खुराक सारांश',
      weatherRule: 'मौसम छिड़काव नियम',
      culturalTitle: 'बचाव के नियम',
      openCamera: 'लाइव कैमरा खोलें',
      takePhoto: 'फोटो खींचें',
      capturePhoto: 'फोटो लें',
      switchCamera: 'कैमरा बदलें',
      cameraGuide: 'कपास के पत्ते को फ्रेम के अंदर रखें',
      cameraUnavailable: 'कैमरा उपलब्ध नहीं है या अनुमति नहीं मिली।',
      useFileFallback: 'गैलरी से फोटो चुनें',
      retakePhoto: 'दोबारा फोटो लें',
      orDivider: 'या',
      cameraSource: 'कैमरे से खींची गई फोटो',
      uploadSource: 'अपलोड की गई पत्ती फोटो',
      uncertainResult: 'अनिश्चित परिणाम',
      diagnosisInconclusive: 'निदान अनिर्णायक',
      uncertainConfidenceMsg: 'सटीकता स्कोर 65% सीमा से कम है',
      uncertainGuidance: 'हम निश्चित रूप से रोग की पहचान नहीं कर सके। कृपया बेहतर रोशनी या साफ पृष्ठभूमि के साथ दोबारा फोटो लें।',
      topCandidates: 'शीर्ष संभावित रोग',
      sortedByProbability: 'एआई संभावना के अनुसार',
      hiddenTreatmentNote: 'रोग की निश्चित पहचान होने तक उपचार सिफारिशें छिपाई गई हैं।',
      downloadAnyway: 'फिर भी रिपोर्ट डाउनलोड करें',
      notRecommendedUncertain: 'सिफारिश नहीं की जाती — विश्वसनीय निदान के लिए सटीकता बहुत कम है।',
      healthyDiagnosisHeader: 'स्वस्थ फसल निदान',
      phase2Feature: 'फेज 2 सुविधा',
      featureUnderDev: 'सुविधा निर्माणाधीन है',
      featureUnderDevDesc: 'एआई पत्ती रोग पहचान और रासायनिक खुराक निर्माण फेज 2 में सक्रिय होगा।',
      clearTryAnother: 'हटाएं और दूसरी फोटो आज़माएं',
    },
    diseases: {
      title: 'कपास रोग सूचकांक',
      subtitle: 'कपास पत्ती रोगों, लक्षणों और दवाओं की सूची।',
      allThreats: 'सभी खतरे',
      criticalThreat: 'बड़ा खतरा',
      highSeverity: 'उच्च खतरा',
      moderateStress: 'मध्यम खतरा',
      normalHealthy: 'स्वस्थ पत्ती',
      diseaseIndexScore: 'खतरा स्कोर',
      etl: 'कीट सीमा (ETL)',
      vulnerableStage: 'संवेदनशील समय',
      keySymptoms: 'मुख्य लक्षण',
      viewProtocol: 'दवा देखें',
      causalAgent: 'कारक जीव',
      descAndPathology: 'विवरण और रोग विज्ञान',
      curativeProtocol: 'रोग निवारण उपचार सिफारिश',
      chemicalProduct: 'रासायनिक दवा',
      standardDosage: 'मानक खुराक',
      bioOrganicAlternative: 'जैविक विकल्प',
      stage: 'चरण',
    },
    treatments: {
      title: 'उपचार और दवाएं',
      subtitle: 'दवाओं की सही मात्रा, ब्रांड और छिड़काव नियमों की सूची।',
      allProtocols: 'सभी दवाएं',
      chemicalInterventions: 'रासायनिक स्प्रे',
      organicInterventions: 'जैविक उपाय',
      biologicalInterventions: 'बायो-कंट्रोल',
      phi: 'प्रतीक्षा दिन (PHI)',
      ratePerAcre: 'प्रति एकड़ दर',
      activeFormulation: 'मुख्य घटक',
      viewDosageSafety: 'मात्रा और सुरक्षा देखें',
      commercialBrands: 'दुकान का ब्रांड नाम',
      requiredPpe: 'सुरक्षा गियर (PPE)',
      safetyPrecaution: 'सुरक्षा नियम',
      bioControl: 'जैविक नियंत्रण',
      category: 'श्रेणी',
      dosageRules: 'मानक दवा खुराक और घोल नियम',
      sprayDilution: 'छिड़काव पानी की मात्रा',
      repeatApplication: 'दोबारा छिड़काव',
      daysWaiting: 'दिन प्रतीक्षा',
    },
    pdfReport: {
      title: 'एग्रीलेंस रोग निदान रिपोर्ट',
      subtitle: 'कपास फसल रोग और दवा सलाह सारांश',
      refNo: 'संदर्भ क्र #',
      date: 'दिनांक',
      targetCrop: 'फसल: कपास (Gossypium hirsutum)',
      landSize: 'खेत का आकार',
      primaryPathology: 'पहचाना गया रोग',
      certaintyScore: 'सटीकता स्कोर',
      threatRating: 'खतरा स्तर',
      observation: 'निरीक्षण विवरण',
      emergencyContainment: 'तत्काल जरूरी कदम (24-48 घंटे)',
      prescriptionTitle: 'दवा परामर्श पर्ची',
      totalWater: 'कुल आवश्यक पानी',
      specification: 'विवरण',
      prescription: 'सलाह',
      fieldCalculation: 'खेत की गणना',
      recProduct: 'अनुशंसित दवा',
      activeFormulation: 'मुख्य घटक',
      applicationSchedule: 'छिड़काव समय',
      phiWaiting: 'प्रतीक्षा दिन (PHI)',
      bioAlternative: 'जैविक विकल्प',
      weatherRule: 'मौसम नियम',
      preventiveMeasures: 'बचाव नियम',
      footerNote: 'कपास खेत प्रबंधन हेतु तैयार की गई सलाह रिपोर्ट।',
      officerSignoff: 'सलाह सारांश',
    },
    admin: {
      title: 'एडमिन नियंत्रण केंद्र',
      description: 'फसल सूची, रोग प्रोफाइल और उपचार प्रोटोकॉल का प्रबंधन करें।',
      addRecord: 'जोड़ें',
      management: 'प्रबंधन',
      noRecords: 'कोई रिकॉर्ड नहीं मिला।',
      createRecord: 'रिकॉर्ड बनाएं',
      confirmDeletion: 'हटाने की पुष्टि करें',
      deleteConfirmDesc: 'क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
      name: 'नाम',
      associatedCrop: 'संबंधित फसल',
      treatmentType: 'उपचार प्रकार',
    },
  },
  mr: {
    nav: {
      dashboard: 'डॅशबोर्ड',
      detect: 'रोग निदान',
      history: 'स्कॅन इतिहास',
      crops: 'पिक माहिती',
      diseases: 'रोग अनुक्रमणिका',
      treatments: 'उपचार पद्धती',
      assistant: 'एआय सहाय्यक',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्ज',
      admin: 'अ‍ॅडमिन पॅनेल',
    },
    common: {
      language: 'भाषा',
      selectLanguage: 'भाषा निवडा',
      landAcres: 'शेताचे क्षेत्र (एकरामध्ये)',
      acres: 'एकरा',
      runDiagnosis: 'रोग तपासणी करा',
      pdfReport: 'पीडीएफ अहवाल',
      printReport: '१-पान अहवाल प्रिंट करा',
      listenTts: '🔊 ऐका',
      stopVoice: 'आवाज थांबवा',
      voiceInput: '🎤 बोला',
      listening: 'ऐकत आहे...',
      typeOrSpeak: 'तुमचा प्रश्न लिहा किंवा बोला...',
      send: 'पाठवा',
      clear: 'क्लियर करा',
      severity: 'तीव्रता',
      threatIndex: 'धोका पातळी',
      certainty: 'अचूकता',
      emergencyAction: 'तातडीची कारवाई (२४-४८ तास)',
      chemicalTreatment: 'रासायनिक औषध फवारणी',
      bioOrganicRemedy: 'जैविक उपाय',
      culturalRules: 'शेती नियम',
      waterRequired: 'एकूण आवश्यक पाणी',
      dosagePerAcre: 'प्रती एकरी औषध प्रमाण',
      welcomeBack: 'स्वागत आहे',
      recentScans: 'नुकतेच केलेले स्कॅन',
      totalScans: 'एकूण स्कॅन',
      healthyCanopy: 'निरोगी पान',
      pathologyFound: 'रोग आढळला',
      activeCrops: 'नोंदणीकृत शेत',
      searchPlaceholder: 'रोग किंवा औषध शोधा...',
      viewDetails: 'तपशील पहा',
      logout: 'लॉगआउट',
      aiDisclaimer: 'एआय अंदाज काही वेळा चुकीचे असू शकतात. कोणतीही कृती करण्यापूर्वी कृपया कृषी तज्ञांचा सल्ला घ्या.',
      highConfidence: 'उच्च अचूकता',
      moderateConfidence: 'मध्यम अचूकता',
      uncertain: 'अनिश्चित',
      recent: 'नुकतेच',
      farmer: 'शेतकरी',
      cottonLeafScan: 'कापूस पान स्कॅन',
      cancel: 'रद्द करा',
      save: 'जतन करा',
      delete: 'हटवा',
      more: 'अधिक',
      days: 'दिवस',
      viewPdfReport: 'पीडीएफ अहवाल पहा',
    },
    dashboard: {
      title: 'डॅशबोर्ड',
      description: 'कापूस पीक रोग तपासणी व शेत नोंदी.',
      weeklyScanVolume: 'साप्ताहिक स्कॅन प्रमाण',
      noScanActivity: 'अद्याप कोणतीही स्कॅन नोंद नाही',
      noScanDesc: 'तपासणी केल्यानंतर येथे स्कॅन आकडेवारी दिसेल.',
      noRecentScans: 'नुकतेच केलेले स्कॅन नाहीत',
      noRecentDesc: 'तुमचे नुकतेच केलेले स्कॅन येथे दिसतील.',
    },
    history: {
      title: 'स्कॅन इतिहास',
      description: 'जतन केलेला स्कॅन इतिहास व पीडीएफ अहवाल.',
      noHistory: 'इतिहास सापडला नाही',
      noHistoryDesc: 'तुमचे जतन केलेले अहवाल येथे दिसतील.',
      runNewScan: 'नवीन स्कॅन करा',
    },
    crops: {
      title: 'कापूस पीक माहिती',
      description: 'कापूस वाढीचे टप्पे, जमीन व हवामान माहिती.',
      growingPeriod: 'पीक कालावधी',
      idealTemp: 'योग्य तापमान',
      waterNeed: 'पाण्याची गरज',
      soilType: 'जमिनीचा प्रकार',
      keyPests: 'मुख्य कीटक व रोग',
    },
    profile: {
      title: 'प्रोफाइल सेटिंग्ज',
      description: 'तुमचे नाव, संपर्क माहिती व शेताचे क्षेत्र बदला.',
      fullName: 'संपूर्ण नाव',
      email: 'ईमेल पत्ता',
      phone: 'फोन नंबर',
      farmLocation: 'शेताचे ठिकाण',
      totalLand: 'एकूण शेत क्षेत्र',
      role: 'भूमिका',
      saveChanges: 'बदल जतन करा',
      personalCredentials: 'वैयक्तिक माहिती',
      accountSecurity: 'खाते सुरक्षा',
      currentPassword: 'सध्याचा पासवर्ड',
      newPassword: 'नवीन पासवर्ड',
      updatePassword: 'पासवर्ड अपडेट करा',
    },
    settings: {
      title: 'सेटिंग्ज',
      description: 'भाषा, रंग थीम व अ‍ॅप सेटिंग्ज बदला.',
      appearance: 'रंग थीम',
      themeMode: 'थीम मोड',
      notifications: 'सूचना',
      voiceSettings: 'आवाज सेटिंग्ज',
      audioOutputSpeed: 'बोलण्याचा वेग',
      pwaInstallTitle: 'प्रोग्रेसिव वेब ॲप (PWA) मोबाईल इन्स्टॉल',
      pwaInstallHeading: 'ॲग्रीलेन्स होम स्क्रीनवर इन्स्टॉल करा',
      pwaInstallDesc: 'ॲग्रीलेन्स थेट तुमच्या अँड्रॉइड, आयफोन किंवा डेस्कटॉप स्क्रीनवर ऑफलाइन मोबाईल ॲप म्हणून इन्स्टॉल केले जाऊ शकते.',
      appInstalled: 'ॲप इन्स्टॉल केले ✓',
      installApp: 'मोबाईल ॲप इन्स्टॉल करा',
      preferredLanguage: 'प्लॅटफॉर्म पसंतीची भाषा',
      languageSelectDesc: 'संपूर्ण भाषांतर आणि आवाज एआय साठी भाषा निवडा:',
      light: 'लाइट',
      dark: 'डार्क',
      system: 'सिस्टम',
      connectivityStatus: 'कनेक्टिव्हिटी आणि PWA स्थिती',
      networkStatus: 'नेटवर्क स्थिती',
      networkMonitorDesc: 'रिअल-टाइम कनेक्शन मॉनिटर',
      online: '🟢 ऑनलाइन',
      offline: '🔴 ऑफलाइन फील्ड मोड सक्रिय',
      pwaTitle: 'प्रोग्रेसिव वेब ॲप (PWA)',
      pwaCacheDesc: 'सर्व्हिस वर्कर आणि ऑफलाइन कॅश सक्रिय',
      pwaActive: 'सक्रिय (ऑफलाइन तयार)',
    },
    footer: {
      tagline: 'स्मार्ट कापूस पीक रोग निदान व औषध सल्ला प्रणाली.',
      quickLinks: 'क्विक लिंक्स',
      contactSupport: 'मदत केंद्र',
      rightsReserved: 'सर्व हक्क राखीव.',
      privacyPolicy: 'गोपनीयता धोरण',
      termsOfService: 'सेवा अटी',
    },
    assistant: {
      title: 'एआय पीक सल्लागार',
      subtitle: 'कापूस रोग, औषधांचे प्रमाण, सेंद्रिय उपाय आणि फवारणी नियमांवर प्रश्न विचारा.',
      liveBadge: 'एआय सल्लागार कार्यरत',
      speakingBadge: 'आवाज सुरू आहे...',
      fieldSize: 'शेताचे क्षेत्र',
      askTopics: 'प्रमुख कृषी विषय',
      resetChat: 'संभाषण रीसेट करा',
      copyText: 'कॉपी करा',
      copied: 'कॉपी झाले!',
      speakMsg: 'ऐका',
      stopMsg: 'थांबवा',
      disclaimer: 'शैक्षणिक कृषी सल्ला: प्रति एकरी २०० लीटर प्रमाणित पाण्यानुसार औषध मोजणी.',
      voiceInputHelp: 'तुमच्या भाषेत बोलून थेट प्रश्न विचारा',
      audioReadoutHelp: 'उत्तरे ऐकण्यासाठी व थांबवण्यासाठी ऑडिओ बटण वापरा',
      dosageScaleHelp: 'एकर बदलून औषध व पाण्याचे प्रमाण लगेच मोजा',
    },
    detect: {
      title: 'पान रोग तपासणी स्टुडिओ',
      subtitle: 'कापसाच्या पानाचा फोटो अपलोड करा व लगेच रोग व औषधाचे प्रमाण जाणा.',
      landContextTitle: 'शेताचे क्षेत्र',
      landContextDesc: 'पाणी व औषध प्रमाणासाठी एकर निवडा.',
      uploadTitle: 'पानाचा फोटो टाका',
      dragDrop: 'फोटो येथे टाका',
      browseFile: 'किंवा गॅलरीमधून निवडा (कमाल 10MB)',
      multiAngleScan: 'अचूक स्कॅनिंग',
      enhancedAccuracy: 'उच्च अचूकता',
      runningDiagnosis: 'तपासणी सुरू आहे...',
      awaitingInput: 'पानाचा फोटो टाका',
      awaitingDesc: 'डाव्या बाजूला फोटो टाका व "रोग तपासणी करा" वर क्लिक करा.',
      diagResult: 'तपासणी निकाल',
      diagTime: 'स्कॅन वेळ',
      multiClassSpectrum: 'रोग शक्यता',
      emergencyTitle: 'तातडीची कारवाई (२४-४८ तास)',
      tabChemical: 'रासायनिक औषध',
      tabOrganic: 'जैविक उपाय',
      tabCultural: 'शेती नियम',
      recProduct: 'शिफारस केलेले औषध',
      activeIngredient: 'मुख्य घटक',
      dosagePerAcre: 'प्रती एकरी औषध प्रमाण',
      totalWater: 'एकूण आवश्यक पाणी',
      repeatInterval: 'फवारणी वेळ',
      summary: 'औषध प्रमाण सारांश',
      weatherRule: 'हवामान नियम',
      culturalTitle: 'बचाव नियम',
      openCamera: 'थेट कॅमेरा उघडा',
      takePhoto: 'फोटो काढा',
      capturePhoto: 'फोटो घ्या',
      switchCamera: 'कॅमेरा बदला',
      cameraGuide: 'कापसाचे पान फ्रेमच्या आत व्यवस्थित ठेवा',
      cameraUnavailable: 'कॅमेरा उपलब्ध नाही किंवा परवानगी नाकारली.',
      useFileFallback: 'गॅलरीमधून फोटो निवडा',
      retakePhoto: 'पुन्हा फोटो काढा',
      orDivider: 'किंवा',
      cameraSource: 'कॅमेऱ्याने काढलेला फोटो',
      uploadSource: 'अपलोड केलेली फाईल',
      uncertainResult: 'अनिश्चित निकाल',
      diagnosisInconclusive: 'निदान अनिर्णित',
      uncertainConfidenceMsg: 'अचूकता स्कोअर 65% मर्यादेपेक्षा कमी आहे',
      uncertainGuidance: 'आम्ही खात्रीशीरपणे रोग ओळखू शकलो नाही. कृपया चांगल्या प्रकाशात किंवा जवळून पुन्हा फोटो घ्या.',
      topCandidates: 'संभाव्य प्रमुख रोग',
      sortedByProbability: 'एआय संभाव्यतेनुसार',
      hiddenTreatmentNote: 'रोगाची खात्रीशीर ओळख होईपर्यंत उपचार माहिती लपवली आहे.',
      downloadAnyway: 'तरीही अहवाल डाउनलोड करा',
      notRecommendedUncertain: 'शिफारस केलेली नाही — अचूकता अत्यंत कमी आहे.',
      healthyDiagnosisHeader: 'निरोगी पीक तपासणी',
      phase2Feature: 'फेज २ सुविधा',
      featureUnderDev: 'सुविधा प्रगतीपथावर आहे',
      featureUnderDevDesc: 'एआय पान रोग ओळख आणि औषध प्रमाण सूत्र फेज २ मध्ये सक्रिय केले जाईल.',
      clearTryAnother: 'साफ करा आणि दुसरा फोटो घ्या',
    },
    diseases: {
      title: 'कापूस रोग अनुक्रमणिका',
      subtitle: 'कापूस पानांवरील रोग, लक्षणे व औषधांची सूची.',
      allThreats: 'सर्व धोके',
      criticalThreat: 'मोठा धोका',
      highSeverity: 'उच्च धोका',
      moderateStress: 'मध्यम धोका',
      normalHealthy: 'निरोगी पान',
      diseaseIndexScore: 'धोका स्कोर',
      etl: 'कीटक मर्यादा (ETL)',
      vulnerableStage: 'संवेदनशील वेळ',
      keySymptoms: 'मुख्य लक्षणे',
      viewProtocol: 'औषध पहा',
      causalAgent: 'कारणीभूत घटक',
      descAndPathology: 'वर्णन आणि रोगशास्त्र',
      curativeProtocol: 'रोग निवारण उपचार शिफारस',
      chemicalProduct: 'रासायनिक औषध',
      standardDosage: 'प्रमाणित मात्रा',
      bioOrganicAlternative: 'जैविक पर्याय',
      stage: 'टप्पा',
    },
    treatments: {
      title: 'उपचार व औषधे',
      subtitle: 'औषधांचे प्रमाण, ब्रँड नावे व फवारणी नियमांची सूची.',
      allProtocols: 'सर्व औषधे',
      chemicalInterventions: 'रासायनिक औषधे',
      organicInterventions: 'जैविक उपाय',
      biologicalInterventions: 'बायो-कंट्रोल',
      phi: 'प्रतीक्षा दिवस (PHI)',
      ratePerAcre: 'प्रती एकरी प्रमाण',
      activeFormulation: 'मुख्य घटक',
      viewDosageSafety: 'प्रमाण व सुरक्षा पहा',
      commercialBrands: 'दुकानातील ब्रँड नावे',
      requiredPpe: 'सुरक्षा साधने (PPE)',
      safetyPrecaution: 'सुरक्षा नियम',
      bioControl: 'जैविक नियंत्रण',
      category: 'प्रवर्ग',
      dosageRules: 'प्रमाणित औषध मात्रा आणि द्रावण नियम',
      sprayDilution: 'फवारणी पाण्याचे प्रमाण',
      repeatApplication: 'पुन्हा फवारणी',
      daysWaiting: 'दिवस प्रतीक्षा',
    },
    pdfReport: {
      title: 'ॲग्रीलेन्स रोग निदान अहवाल',
      subtitle: 'कापूस पीक रोग व औषध सल्ला सारांश',
      refNo: 'संदर्भ क्र #',
      date: 'दिनांक',
      targetCrop: 'पीक: कापूस (Gossypium hirsutum)',
      landSize: 'शेताचे क्षेत्र',
      primaryPathology: 'निदान झालेला रोग',
      certaintyScore: 'अचूकता स्कोर',
      threatRating: 'धोका पातळी',
      observation: 'निरीक्षण तपशील',
      emergencyContainment: 'तातडीची कारवाई (२४-४८ तास)',
      prescriptionTitle: 'औषध फवारणी सल्ला पत्रक',
      totalWater: 'एकूण आवश्यक पाणी',
      specification: 'तपशील',
      prescription: 'सल्ला',
      fieldCalculation: 'शेताची गणना',
      recProduct: 'शिफारस केलेले औषध',
      activeFormulation: 'मुख्य घटक',
      applicationSchedule: 'फवारणी वेळ',
      phiWaiting: 'प्रतीक्षा दिवस (PHI)',
      bioAlternative: 'जैविक पर्याय',
      weatherRule: 'हवामान नियम',
      preventiveMeasures: 'बचाव नियम',
      footerNote: 'कापूस शेत व्यवस्थापनासाठी तयार केलेला सल्ला अहवाल.',
      officerSignoff: 'सल्ला सारांश',
    },
    admin: {
      title: 'अ‍ॅडमिन नियंत्रण केंद्र',
      description: 'पिक यादी, रोग माहिती आणि उपचार पद्धतींचे व्यवस्थापन करा.',
      addRecord: 'जोडा',
      management: 'व्यवस्थापन',
      noRecords: 'कोणतीही नोंद आढळली नाही.',
      createRecord: 'नोंद तयार करा',
      confirmDeletion: 'हटवण्याची खात्री करा',
      deleteConfirmDesc: 'तुम्हाला खात्री आहे की तुम्ही ही नोंद हटवू इच्छिता? ही कृती पूर्ववत केली जाऊ शकत नाही.',
      name: 'नाव',
      associatedCrop: 'संबंधित पीक',
      treatmentType: 'उपचार प्रकार',
    },
  },
};
