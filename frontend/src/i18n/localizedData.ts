import type { Language } from './translations';

export interface DiseaseProfile {
  id: string;
  name: string;
  scientific_name: string;
  causal_agent: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  disease_index_score: string;
  economic_threshold_level: string;
  vulnerable_stage: string;
  description: string;
  symptoms: string[];
  recommended_treatments: {
    chemical: string;
    dosage: string;
    organic: string;
  };
  preventive_measures: string[];
}

export function getLocalizedDiseases(lang: Language): DiseaseProfile[] {
  if (lang === 'hi') {
    return [
      {
        id: 'bacterial_blight',
        name: 'जीवाणु जनित धब्बा रोग (Bacterial Blight)',
        scientific_name: 'Xanthomonas citri pv. malvacearum',
        causal_agent: 'जीवाणु (संवहनी प्रणाली प्रसार)',
        severity: 'critical',
        disease_index_score: '85/100 (गंभीर फसल खतरा)',
        economic_threshold_level: '5% संक्रमित पत्ती क्षेत्र प्रति पौधा',
        vulnerable_stage: 'अंकुरण से डोडी (बॉल) विकास चरण',
        description:
          'जीवाणु जनित धब्बा रोग में पत्तियों पर पानी से भिगोए हुए कोणीय धब्बे बनते हैं, जिससे पत्तियां समय से पहले गिर जाती हैं और डोडी में सड़न होती है।',
        symptoms: [
          'पत्तियों की शिराओं से घिरे पानी से भीगे कोणीय धब्बे',
          'तने पर गहरे भूरे रंग की धारियां (ब्लैक आर्म)',
          'पत्तियों का समय से पहले गिरना और बोंड (डोडी) सड़न'
        ],
        recommended_treatments: {
          chemical: 'कॉपर ऑक्सीक्लोराइड 50% WP (500 ग्राम/एकड़) + स्ट्रेप्टोसाइक्लिन (6 ग्राम/एकड़)',
          dosage: '200 लीटर साफ पानी प्रति एकड़ में घोलें',
          organic: 'नीम तेल (NSKE 5%) या स्यूडोमोनस फ्लोरोसेंस (10 ग्राम/लीटर)'
        },
        preventive_measures: [
          'कार्बोक्सिन + थिरम (2 ग्राम/किग्रा) से उपचारित बीजों का उपयोग करें।',
          'जीवाणु प्रसार को रोकने के लिए ऊपर से पानी छिड़काव से बचें।',
          'गैर-कपास फसलों (मक्का या ज्वार) के साथ 2-वर्षीय फसल चक्र अपनाएं।'
        ]
      },
      {
        id: 'curl_virus',
        name: 'कपास पत्ती मरोड़िया वायरस (Leaf Curl Virus)',
        scientific_name: 'Begomovirus / Whitefly Vector Complex',
        causal_agent: 'विषाणु (सफेद मक्खी बेमिसिया टैबासी द्वारा प्रसारित)',
        severity: 'critical',
        disease_index_score: '92/100 (उच्च आर्थिक नुकसान खतरा)',
        economic_threshold_level: '1-2 वयस्क सफेद मक्खी प्रति पत्ती',
        vulnerable_stage: 'प्रारंभिक वानस्पतिक चरण (बुआई के 20-60 दिन बाद)',
        description:
          'यह वायरस पत्तियों को ऊपर या नीचे की ओर मोड़ देता है, शिराएं मोटी हो जाती हैं और पौधे का विकास रुक जाता है।',
        symptoms: [
          'पत्तियों के किनारों का ऊपर और नीचे की ओर मुड़ना',
          'पत्ती की निचली सतह पर गाढ़ी हरी शिराओं का उभरना',
          'पौधों का बौनापन और कप के आकार की विकृति'
        ],
        recommended_treatments: {
          chemical: 'एसिटामिप्रिड 20% SP (100 ग्राम/एकड़) या डायफेंथियूरॉन 50% WP (250 ग्राम/एकड़)',
          dosage: 'सफेद मक्खी नियंत्रण हेतु 200 लीटर पानी प्रति एकड़ छिड़कें',
          organic: 'पीले चिपचिपे जाल (20 जाल/एकड़) + वर्टिसिलियम लेकानी (5 ग्राम/लीटर)'
        },
        preventive_measures: [
          'खेत की मेड़ों से खरपतवार (कंघी, गाजर घास) नष्ट करें।',
          'सफेद मक्खी को रोकने के लिए खेत के चारों ओर ज्वार या बाजरा की 3-4 कतारें लगाएं।',
          'रोग प्रतिरोधी अनुशंसित कपास किस्मों का चयन करें।'
        ]
      },
      {
        id: 'leaf_hopper_jassids',
        name: 'हरा तेला / जस्सिड्स (Leaf Hopper Jassids)',
        scientific_name: 'Amrasca biguttula biguttula',
        causal_agent: 'रस चूसक कीट शिशु एवं वयस्क',
        severity: 'high',
        disease_index_score: '74/100 (उच्च कीट तनाव)',
        economic_threshold_level: '2-3 शिशु या वयस्क प्रति पत्ती',
        vulnerable_stage: 'वानस्पतिक से पुष्पन चरण',
        description:
          'जस्सिड पत्ती के निचले हिस्से से रस चूसते हैं और विषैला द्रव छोड़ते हैं, जिससे पत्तियां पीली पड़कर जल जाती हैं (हॉपरबर्न)।',
        symptoms: [
          'पत्ती के किनारों का पीला पड़ना',
          'पत्तियों का नीचे की ओर कप की तरह मुड़ना',
          'पत्ती के किनारों का लाल-भूरा होकर सूखना (हॉपरबर्न)'
        ],
        recommended_treatments: {
          chemical: 'फ्लोनिकामिड 50% WG (60 ग्राम/एकड़) या थियामेथॉक्सम 25% WG (40 ग्राम/एकड़)',
          dosage: '200 लीटर पानी प्रति एकड़ में छिड़कें',
          organic: 'नीम तेल 5% (5 मिली/लीटर) छिड़कें'
        },
        preventive_measures: [
          'अत्यधिक नाइट्रोजन उर्वरक के प्रयोग से बचें।',
          'मित्र कीटों (लेडीबर्ड बीटल) का संरक्षण करें।',
          'कपास के साथ लोबिया या सोयाबीन की अंतर-फसल लें।'
        ]
      },
      {
        id: 'leaf_redding',
        name: 'पत्ती लाल होना (Physiological Leaf Redding)',
        scientific_name: 'Physiological / Magnesium Deficiency Stress',
        causal_agent: 'मैग्नीशियम (Mg) की कमी + ठंडी रातों का तनाव',
        severity: 'moderate',
        disease_index_score: '48/100 (शारीरिक तनाव)',
        economic_threshold_level: '10% पत्ती क्षेत्र का लाल पड़ना',
        vulnerable_stage: 'डोडी (बॉल) निर्माण एवं पकने का चरण',
        description:
          'मैग्नीशियम की कमी और रात के कम तापमान (<15°C) के कारण हरी शिराओं के बीच की पत्तियां बैंगनी-लाल हो जाती हैं।',
        symptoms: [
          'शिराएं हरी रहते हुए पत्तियों का लाल-बैंगनी होना',
          'पत्तियों का समय से पहले पककर कड़ा व कुरकुरा होना',
          'डोडी विकास में रुकावट और पत्तियां गिरना'
        ],
        recommended_treatments: {
          chemical: 'मैग्नीशियम सल्फेट (1.0 किग्रा/एकड़) + NPK 19:19:19 (1.0 किग्रा/एकड़)',
          dosage: '200 लीटर पानी में मिलाकर 10 दिन के अंतराल पर छिड़कें',
          organic: 'सड़ी गोबर की खाद (2 टन/एकड़) + जैव उर्वरक डालें'
        },
        preventive_measures: [
          'डोडी विकास के समय खेत में नमी बनाए रखें।',
          'मिट्टी परीक्षण कराकर मैग्नीशियम की संतुलित मात्रा दें।',
          'सूखे के बाद अचानक अत्यधिक सिंचाई से बचें।'
        ]
      },
      {
        id: 'herbicide_growth_damage',
        name: 'खरपतवारनाशक क्षति (Herbicide Phytotoxicity)',
        scientific_name: 'Herbicide Drift / Phytotoxicity',
        causal_agent: 'रसायन बहकाव (2,4-D / ग्लाइफोसेट)',
        severity: 'high',
        disease_index_score: '68/100 (रासायनिक क्षति)',
        economic_threshold_level: 'नयी पत्तियों का विकृत होना',
        vulnerable_stage: 'कोई भी वानस्पतिक चरण',
        description:
          'पास के खेतों से खरपतवारनाशक दवा उड़कर आने पर पत्तियां जूते के तस्मे की तरह पतली व विकृत हो जाती हैं।',
        symptoms: [
          'पत्तियों का धागे जैसी पतली व विकृत होना',
          'पत्तियों का पीला पड़ना और वृद्धि रुकना',
          'तनों का मुड़ना और नयी कोपलों की विकृति'
        ],
        recommended_treatments: {
          chemical: 'ह्यूमिक एसिड 12% (400 मिली/एकड़) + जिंक (200 ग्राम/एकड़)',
          dosage: '200 लीटर पानी में मिलाकर छिड़काव करें',
          organic: 'पंचगव्य 3% या समुद्री शैवाल अर्क छिड़कें'
        },
        preventive_measures: [
          'छिड़काव के समय सुरक्षा कवच (हुड) का उपयोग करें।',
          'तेज हवा (>10 किमी/घंटा) में खरपतवारनाशक न छिड़कें।',
          'स्प्रे पंप को पानी से 3 बार अच्छी तरह धोएं।'
        ]
      },
      {
        id: 'leaf_variegation',
        name: 'पत्ती चितकबरापन (Leaf Variegation)',
        scientific_name: 'Genetic / Chimera Variegation',
        causal_agent: 'आनुवंशिक मोज़ेक या क्लोरोफिल उत्परिवर्तन',
        severity: 'low',
        disease_index_score: '18/100 (कम क्षति)',
        economic_threshold_level: 'कोई आर्थिक नुकसान नहीं',
        vulnerable_stage: 'वानस्पतिक विकास',
        description:
          'क्लोरोफिल की कमी के कारण पत्तियों पर बिना किसी नुकसान के पीले या सफेद चितकबरे धब्बे दिखाई देते हैं।',
        symptoms: [
          'पत्तियों पर पीले या सफेद मोज़ेक धब्बे',
          'सामान्य पत्ती संरचना व वृद्धि',
          'उपज पर कोई विपरीत प्रभाव नहीं'
        ],
        recommended_treatments: {
          chemical: 'सूक्ष्म पोषक तत्व छिड़काव (500 ग्राम/एकड़)',
          dosage: '200 लीटर पानी में छिड़कें',
          organic: 'वर्मीकम्पोस्ट अर्क (50 मिली/लीटर)'
        },
        preventive_measures: [
          'चितकबरे पौधों के बीजों का भविष्य में उपयोग न करें।',
          'संतुलित सूक्ष्म पोषक तत्व दें।'
        ]
      },
      {
        id: 'healthy_leaf',
        name: 'स्वस्थ कपास फसल (Healthy Canopy)',
        scientific_name: 'Gossypium hirsutum (Normal Physiology)',
        causal_agent: 'कोई नहीं (उत्कृष्ट स्वास्थ्य)',
        severity: 'low',
        disease_index_score: '0/100 (उत्कृष्ट फसल स्वास्थ्य)',
        economic_threshold_level: 'लागू नहीं',
        vulnerable_stage: 'सभी चरण',
        description:
          'पत्तियां गहरी हरी, चिकनी और रोग या कीट के प्रभाव से 100% मुक्त हैं।',
        symptoms: [
          'समान हरा रंग व मोमी परत',
          'सामान्य पत्ती संरचना',
          'मजबूत विकास व स्वस्थ फूल/बोंड'
        ],
        recommended_treatments: {
          chemical: 'कोई छिड़काव आवश्यक नहीं (सामान्य खाद जारी रखें)',
          dosage: 'लागू नहीं',
          organic: 'एज़ोटोबैक्टर व पीएसबी जैव उर्वरक दें'
        },
        preventive_measures: [
          'संतुलित NPK मात्रा (120:60:60 किग्रा/हेक्टेयर) दें।',
          'एग्रीलेंस से साप्ताहिक निरीक्षण जारी रखें।',
          'खेत में जल निकासी की उचित व्यवस्था रखें।'
        ]
      }
    ];
  }

  if (lang === 'mr') {
    return [
      {
        id: 'bacterial_blight',
        name: 'जिवाणूजन्य करपा (Bacterial Blight)',
        scientific_name: 'Xanthomonas citri pv. malvacearum',
        causal_agent: 'जिवाणू (वाहिनी प्रणाली प्रसार)',
        severity: 'critical',
        disease_index_score: '८५/१०० (अतिधोकादायक)',
        economic_threshold_level: '५% बाधित पान क्षेत्र प्रति झाड',
        vulnerable_stage: 'रोपटे ते बोंड विकास टप्पा',
        description:
          'जिवाणूजन्य करप्यामुळे पानांवर शिरांनी मर्यादित केलेले पाण्याचे ठिपके पडतात, पाने गळतात आणि बोंडे सडतात.',
        symptoms: [
          'पानांच्या शिरांनी मर्यादित पाण्याचे कोनीय ठिपके',
          'फांद्यांवर व खोडावर काळे डाग (ब्लॅक आर्म)',
          'वेळेपूर्वी पानगळ आणि बोंड सडणे'
        ],
        recommended_treatments: {
          chemical: 'कॉपर ऑक्सिक्लोराइड ५०% WP (५०० ग्रॅम/एकरी) + स्ट्रिप्टोसायक्लिन (६ ग्रॅम/एकरी)',
          dosage: '२०० लिटर स्वच्छ पाण्यात मिसळा',
          organic: 'निंबोळी अर्क (NSKE ५%) किंवा सुडोमोनस फ्लुरोसन्स (१० ग्रॅम/लिटर)'
        },
        preventive_measures: [
          'कार्बोक्सिन + थिराम (२ ग्रॅम/किलो) प्रक्रिया केलेले बियाणे वापरा.',
          'जिवाणू प्रसार रोखण्यासाठी तुषार सिंचन टाळा.',
          'मका किंवा ज्वारी पिकासोबत २ वर्षांचे पीक फेरपालट करा.'
        ]
      },
      {
        id: 'curl_virus',
        name: 'कापूस पर्णमोड / चुरडा-मुरडा (Leaf Curl Virus)',
        scientific_name: 'Begomovirus / Whitefly Vector Complex',
        causal_agent: 'विषाणू (पांढरी माशी बेमिसिया टॅबासी द्वारे प्रसार)',
        severity: 'critical',
        disease_index_score: '९२/१०० (उच्च आर्थिक नुकसान)',
        economic_threshold_level: '१-२ प्रौढ पांढरी माशी प्रति पान',
        vulnerable_stage: 'सुरवातीचा शाकीय वाढीचा टप्पा (२०-६० दिवस)',
        description:
          'या रोगामुळे पाने वर किंवा खाली गोळा होतात, शिरा जाड होतात आणि झाडांची वाढ खुंटते.',
        symptoms: [
          'पानांच्या कडा वर किंवा खाली वळणे',
          'पानाच्या मागच्या बाजूला काळ्या हिरव्या शिरा फुलणे',
          'झाडाची वाढ खुंटणे व पानाच्या कळ्या फुटणे'
        ],
        recommended_treatments: {
          chemical: 'अ‍ॅसिटामिप्रिड २०% SP (१०० ग्रॅम/एकरी) किंवा डायफेंथिओरॉन ५०% WP (२५० ग्रॅम/एकरी)',
          dosage: '२०० लिटर पाण्यात मिसळून फवारा',
          organic: 'पिवळे चिकट सापळे (२० सापळे/एकरी) + व्हर्टिसिलियम लेकानी'
        },
        preventive_measures: [
          'शेताच्या बांधावरील तण (कांगणी, गाजरगवत) नष्ट करा.',
          'पांढरी माशी रोखण्यासाठी शेताभोवती ज्वार किंवा बाजरीच्या ३-४ ओळी लावा.',
          'रोगप्रतिकारक कापूस वाणांची निवड करा.'
        ]
      },
      {
        id: 'leaf_hopper_jassids',
        name: 'तुडतुडे व मावा (Leaf Hopper Jassids)',
        scientific_name: 'Amrasca biguttula biguttula',
        causal_agent: 'रस शोषणारे कीटक',
        severity: 'high',
        disease_index_score: '७४/१०० (उच्च कीटक ताण)',
        economic_threshold_level: '२-३ तुडतुडे प्रति पान',
        vulnerable_stage: 'शाकीय वाढ ते फुलधारणा',
        description:
          'तुडतुडे पानाच्या मागून रस शोषतात आणि विषारी द्रव सोडतात, ज्यामुळे पानांच्या कडा लाल-भूऱ्या होऊन वाळतात (हॉपरबर्न).',
        symptoms: [
          'पानांच्या कडा पिवळ्या पडणे',
          'पाने खाली वाटीसारखी वळणे',
          'पानाच्या कडा लाल-भूऱ्या होऊन वाळणे (हॉपरबर्न)'
        ],
        recommended_treatments: {
          chemical: 'फ्लोनिकामािड ५०% WG (६० ग्रॅम/एकरी) किंवा थायामेथॉक्सम २५% WG (४० ग्रॅम/एकरी)',
          dosage: '२०० लिटर पाण्यात फवारा',
          organic: 'निंबोळी अर्क ५% (५ मिली/लिटर) फवारा'
        },
        preventive_measures: [
          'जास्त नत्र खतांचा वापर टाळा.',
          'लेडीबर्ड बीटल या मित्रकीटकांचे जतन करा.',
          'कापसामध्ये चवळी किंवा सोयाबीन आंतरपीक घ्या.'
        ]
      },
      {
        id: 'leaf_redding',
        name: 'कापूस लाल्या पडणे (Physiological Leaf Redding)',
        scientific_name: 'Physiological / Magnesium Deficiency Stress',
        causal_agent: 'मॅग्नेशियम (Mg) कमतरता + थंड रात्रींचा ताण',
        severity: 'moderate',
        disease_index_score: '४८/१०० (शारीरिक ताण)',
        economic_threshold_level: '१०% पाने लाल पडणे',
        vulnerable_stage: 'बोंड धारणा व पकवता टप्पा',
        description:
          'मॅग्नेशियमच्या कमतरतेमुळे आणि रात्रीच्या कमी तापमानामुळे (<१५°C) हिरव्या शिरांमधील पान जांभळे-लाल पडते.',
        symptoms: [
          'शिरा हिरव्या राहून पाने लाल-जांभळी होणे',
          'पाने कडक व वाळल्यासारखी होणे',
          'बोंडांची वाढ थांबणे व पानगळ होणे'
        ],
        recommended_treatments: {
          chemical: 'मॅग्नेशियम सल्फेट (१.० किलो/एकरी) + १९:१९:१९ NPK (१.० किलो/एकरी)',
          dosage: '२०० लिटर पाण्यात मिसळून १० दिवसांच्या अंतराने फवारा',
          organic: 'चांगले कुजलेले शेणखत (२ टन/एकरी) वापरा'
        },
        preventive_measures: [
          'बोंड वाढीच्या काळात जमिनीत पुरेशी ओल ठेवा.',
          'माती परीक्षण करून मॅग्नेशियमचा पुरवठा करा.',
          'मोठ्या खंडानंतर अचानक जास्त पाणी देणे टाळा.'
        ]
      },
      {
        id: 'herbicide_growth_damage',
        name: 'तणनाशक बाधा (Herbicide Phytotoxicity)',
        scientific_name: 'Herbicide Drift / Phytotoxicity',
        causal_agent: 'रसायन वाऱ्यामुळे उडणे (२,४-D / ग्लायफोसेट)',
        severity: 'high',
        disease_index_score: '६८/१०० (रासायनिक हानी)',
        economic_threshold_level: 'नवीन पाने विकृत होणे',
        vulnerable_stage: 'कोणताही वाढीचा टप्पा',
        description:
          'शेजारील शेतातील तणनाशक वाऱ्याने उडून आल्यावर पानांची रचना नाडीसारखी किंवा दोरीसारखी विकृत होते.',
        symptoms: [
          'पाने दोरीसारखी बारीक व विकृत होणे',
          'पाने पिवळी पडणे व वाढ थांबणे',
          'शेंड्यांची विकृती'
        ],
        recommended_treatments: {
          chemical: 'ह्युमिक अ‍ॅसिड १२% (४०० मिली/एकरी) + झिंक (२०० ग्रॅम/एकरी)',
          dosage: '२०० लिटर पाण्यात मिसळून फवारा',
          organic: 'पंचगव्य ३% किंवा सीवीड अर्क फवारा'
        },
        preventive_measures: [
          'तणनाशक फवारताना नोझलवर हुड (संरक्षक) वापरा.',
          'वेगवान वाऱ्यात तणनाशक फवारू नका.',
          'फवारणी पंप ३ वेळा पाण्याने स्वच्छ धुवा.'
        ]
      },
      {
        id: 'leaf_variegation',
        name: 'पानांवरील पांढरे डाग (Leaf Variegation)',
        scientific_name: 'Genetic / Chimera Variegation',
        causal_agent: 'जनुकीय बदल किंवा क्लोरोफिल कमतरता',
        severity: 'low',
        disease_index_score: '१८/१०० (कमी धोका)',
        economic_threshold_level: 'नुकसान होत नाही',
        vulnerable_stage: 'शाकीय वाढ',
        description:
          'हरिमद्रव्याच्या कमतरतेमुळे पानांवर पांढरे किंवा पिवळे डाग दिसतात. यामुळे उत्पन्नावर परिणाम होत नाही.',
        symptoms: [
          'पानांवर पिवळे-पांढरे डाग',
          'पानांची रचना सामान्य राहणे',
          'उत्पन्नावर परिणाम नाही'
        ],
        recommended_treatments: {
          chemical: 'सूक्ष्म अन्नद्रव्ये फवारणी (५०० ग्रॅम/एकरी)',
          dosage: '२०० लिटर पाण्यात फवारा',
          organic: 'वर्मीकंपोस्ट अर्क वापरा'
        },
        preventive_measures: [
          'अशा झाडांचे बियाणे पुढील पिकासाठी वापरू नका.',
          'संतुलित सूक्ष्म अन्नद्रव्ये द्या.'
        ]
      },
      {
        id: 'healthy_leaf',
        name: 'निरोगी कापूस पिक (Healthy Canopy)',
        scientific_name: 'Gossypium hirsutum (Normal Physiology)',
        causal_agent: 'काहीही नाही (उत्कृष्ट आरोग्य)',
        severity: 'low',
        disease_index_score: '०/१०० (उत्कृष्ट पीक आरोग्य)',
        economic_threshold_level: 'लागू नाही',
        vulnerable_stage: 'सर्व टप्पे',
        description:
          'पाने टवटवीत, हिरवीगार आणि कोणत्याही रोग किंवा किडीपासून १००% मुक्त आहेत.',
        symptoms: [
          'समान हिरवा रंग व मेणचट थर',
          'सुदृढ पानांची रचना',
          'नियमित फुलधारणा व बोंड धारणा'
        ],
        recommended_treatments: {
          chemical: 'फवारणीची गरज नाही (नियमित खत व्यवस्थापन ठेवा)',
          dosage: 'लागू नाही',
          organic: 'अ‍ॅझोटोबॅक्टर व पीएसबी जिवाणू खत द्या'
        },
        preventive_measures: [
          'संतुलित NPK खतमात्रा (१२०:६०:६० किलो/हेक्टरी) द्या.',
          'ॲग्रीलेन्सने साप्ताहिक पाहणी सुरू ठेवा.',
          'शेतात योग्य निचरा व्यवस्था ठेवा.'
        ]
      }
    ];
  }

  // DEFAULT ENGLISH (en)
  return [
    {
      id: 'bacterial_blight',
      name: 'Bacterial Blight / Angular Leaf Spot',
      scientific_name: 'Xanthomonas citri pv. malvacearum',
      causal_agent: 'Bacterium (Vascular System Spreading)',
      severity: 'critical',
      disease_index_score: '85/100 (Severe Crop Threat)',
      economic_threshold_level: '5% infected leaf area per plant',
      vulnerable_stage: 'Seedling to Boll Development Stage',
      description:
        'Bacterial Blight causes water-soaked angular leaf lesions bounded by veins, severe leaf dropping, black arm stem necrosis, and boll rot.',
      symptoms: [
        'Water-soaked angular spots bounded by leaf veins',
        'Vein browning and dark water-soaked streaks on stems',
        'Premature leaf drop and sunken black lesions on bolls'
      ],
      recommended_treatments: {
        chemical: 'Copper Oxychloride 50% WP (500g/acre) + Streptocycline (6g/acre)',
        dosage: 'Mix in 200 Litres spray water per acre',
        organic: 'Neem Seed Kernel Extract (NSKE 5%) or Pseudomonas fluorescens (10g/L)'
      },
      preventive_measures: [
        'Use delinted seeds treated with Carboxin + Thiram (2g/kg).',
        'Avoid overhead sprinkler irrigation to reduce bacterial splash spread.',
        'Practice 2-year crop rotation with non-host maize or sorghum crops.'
      ]
    },
    {
      id: 'curl_virus',
      name: 'Cotton Leaf Curl Virus (CLCuV)',
      scientific_name: 'Begomovirus / Whitefly Vector Complex',
      causal_agent: 'Viral Disease (Transmitted by Bemisia tabaci Whiteflies)',
      severity: 'critical',
      disease_index_score: '92/100 (High Economic Loss Vector)',
      economic_threshold_level: '1-2 adult whiteflies per leaf',
      vulnerable_stage: 'Early Vegetative Stage (20-60 days post-sowing)',
      description:
        'CLCuV leads to upward or downward leaf curling, vein thickening, leaf-like outgrowths (enations) under leaves, and severe plant stunting.',
      symptoms: [
        'Upward and downward leaf margin cupping and curling',
        'Dark green vein thickening on lower leaf surface',
        'Small cup-shaped leaf enations and stunted plant growth'
      ],
      recommended_treatments: {
        chemical: 'Acetamiprid 20% SP (100g/acre) OR Diafenthiuron 50% WP (250g/acre)',
        dosage: 'Mix in 200 Litres spray water per acre for vector suppression',
        organic: 'Yellow Sticky Traps (20 traps/acre) + Verticillium lecanii (5g/L)'
      },
      preventive_measures: [
        'Eradicate weed hosts (Abutilon indicum, Parthenium) around field borders.',
        'Sow 3-4 border rows of sorghum or bajra as natural whitefly barriers.',
        'Plant virus-tolerant cotton hybrid varieties recommended for your region.'
      ]
    },
    {
      id: 'leaf_hopper_jassids',
      name: 'Leaf Hopper Jassids Damage',
      scientific_name: 'Amrasca biguttula biguttula',
      causal_agent: 'Sap-Sucking Pest Nymphs & Adults',
      severity: 'high',
      disease_index_score: '74/100 (High Pest Stress)',
      economic_threshold_level: '2-3 nymphs or adults per leaf',
      vulnerable_stage: 'Vegetative to Flowering Stage',
      description:
        'Jassid nymphs and adults suck sap from leaf undersides, injecting toxic saliva that causes margin yellowing, downward cupping, and "hopperburn".',
      symptoms: [
        'Yellowing of leaf margins progressing inward',
        'Downward leaf margin cupping and curling',
        'Reddish-brown leaf border scorching (hopperburn)'
      ],
      recommended_treatments: {
        chemical: 'Flonicamid 50% WG (60g/acre) OR Thiamethoxam 25% WG (40g/acre)',
        dosage: 'Mix in 200 Litres spray water per acre',
        organic: 'Neem Oil 5% (5ml/L + 1ml liquid soap) OR Beauveria bassiana'
      },
      preventive_measures: [
        'Avoid excessive nitrogenous fertilizer application.',
        'Conserve natural bio-predators like ladybird beetles and green lacewings.',
        'Intercrop with cowpea or soybean to foster beneficial insects.'
      ]
    },
    {
      id: 'leaf_redding',
      name: 'Physiological Leaf Redding',
      scientific_name: 'Nutritional / Thermal Stress Disorder',
      causal_agent: 'Magnesium (Mg) Deficiency + Cold Night Stress',
      severity: 'moderate',
      disease_index_score: '48/100 (Abiotic Physiological Stress)',
      economic_threshold_level: '10% leaf canopy displaying interveinal reddening',
      vulnerable_stage: 'Boll Formation & Maturation Stage',
      description:
        'Leaf Redding occurs when leaves turn purplish-red between green veins due to magnesium deficiency, low night temperatures (<15°C), or nitrogen depletion.',
      symptoms: [
        'Interveinal leaf reddening while major veins remain green',
        'Premature leaf senescence and leaf brittle texture',
        'Reduced boll development and early leaf shedding'
      ],
      recommended_treatments: {
        chemical: 'Magnesium Sulphate (MgSO4 1.0kg/acre) + Soluble NPK 19:19:19 (1.0kg/acre)',
        dosage: 'Foliar spray in 200 Litres water at 10-day intervals',
        organic: 'Apply well-decomposed Farmyard Manure (2 tonnes/acre) + Bio-fertilizers'
      },
      preventive_measures: [
        'Maintain adequate soil moisture during peak boll development phase.',
        'Perform soil testing to maintain soil pH and secondary magnesium balance.',
        'Avoid sudden prolonged irrigation delays after dry spells.'
      ]
    },
    {
      id: 'herbicide_growth_damage',
      name: 'Herbicide Growth Damage / Phytotoxicity',
      scientific_name: 'Non-Selective Herbicide Drift Injury',
      causal_agent: 'Chemical Drift (2,4-D / Glyphosate / Dicamba)',
      severity: 'high',
      disease_index_score: '68/100 (Chemical Damage Vector)',
      economic_threshold_level: 'Visual strapping or strapping on new flushes',
      vulnerable_stage: 'Any vegetative or flowering stage',
      description:
        'Caused by accidental spray drift from non-selective herbicides. Results in leaf strapping, distorted shoe-string growth, leaf cupping, and chlorosis.',
      symptoms: [
        'Shoe-string leaf distortion and parallel vein strapping',
        'Leaf bleaching/chlorosis and growth terminal stunting',
        'Stem twisting and epinasty on young shoots'
      ],
      recommended_treatments: {
        chemical: 'Foliar Bio-stimulant (Humic Acid 12% @ 400mL/acre) + Chelated Zinc (200g/acre)',
        dosage: 'Foliar spray in 200 Litres water to stimulate cell recovery',
        organic: 'Spray Panchagavya 3% or Seaweed Extract (2mL/L water)'
      },
      preventive_measures: [
        'Use hooded protective nozzles when spraying herbicides near cotton.',
        'Do not apply non-selective weedicides during high wind speeds (>10 km/h).',
        'Rinse spray pumps thoroughly with triple-water wash before cotton spraying.'
      ]
    },
    {
      id: 'leaf_variegation',
      name: 'Leaf Variegation Disorder',
      scientific_name: 'Chimerical / Genetic Variegation',
      causal_agent: 'Genetic Chimera or Minor Chloroplast Mutation',
      severity: 'low',
      disease_index_score: '18/100 (Low Non-Contagious Condition)',
      economic_threshold_level: 'No economic loss threshold',
      vulnerable_stage: 'Vegetative Canopy Growth',
      description:
        'Leaf Variegation displays irregular cream-white or yellow mosaic patches on random leaves due to genetic chimera or minor chlorophyll loss.',
      symptoms: [
        'Irregular yellow or white leaf mosaic mottling',
        'Normal leaf texture without tissue distortion',
        'Normal plant vigor without yield loss'
      ],
      recommended_treatments: {
        chemical: 'Multi-Micronutrient Spray (500g/acre) if trace mineral deficiency co-exists',
        dosage: 'Foliar application in 200 Litres water',
        organic: 'Vermicompost Extract Wash (50mL/L water)'
      },
      preventive_measures: [
        'Do not use seeds from variegated plants for future crop cycles.',
        'Ensure balanced micro-nutrient foliar nutrition during canopy expansion.'
      ]
    },
    {
      id: 'healthy_leaf',
      name: 'Healthy Cotton Crop Canopy',
      scientific_name: 'Gossypium hirsutum (Normal Physiology)',
      causal_agent: 'None (Optimum Crop Health)',
      severity: 'low',
      disease_index_score: '0/100 (Optimal Crop Health)',
      economic_threshold_level: 'N/A',
      vulnerable_stage: 'All Growth Stages',
      description:
        'Leaves show dark green chlorophyll pigmentation, smooth venation, strong structural integrity, and zero visual disease or pest damage.',
      symptoms: [
        'Uniform green leaf color and natural leaf wax coating',
        'Normal lobed leaf geometry and active leaf venation',
        'Healthy shoot growth and vigorous flowering/bolling'
      ],
      recommended_treatments: {
        chemical: 'None required (Sustain standard agronomic fertigation schedule)',
        dosage: 'N/A',
        organic: 'Apply liquid Azotobacter & PSB bio-fertilizers (500mL/acre)'
      },
      preventive_measures: [
        'Maintain recommended NPK fertilizer schedule (120:60:60 kg/ha).',
        'Perform regular weekly crop inspections using AgriLens for early detection.',
        'Ensure adequate field drainage during monsoon periods.'
      ]
    }
  ];
}

export const COTTON_DISEASE_LIBRARY = getLocalizedDiseases('en');

export interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  season: string;
  durationDays: string;
  idealTemp: string;
  waterRequirement: string;
  soilType: string;
  keyPests: string[];
  description: string;
}

export function getLocalizedCrops(lang: Language): CropInfo[] {
  if (lang === 'hi') {
    return [
      {
        id: 'cotton_bt',
        name: 'कपास (Gossypium hirsutum)',
        scientificName: 'Gossypium hirsutum L.',
        season: 'खरीफ मौसम (मई - नवंबर)',
        durationDays: '150 - 180 दिन',
        idealTemp: '21°C - 35°C',
        waterRequirement: '500 - 800 mm',
        soilType: 'काली कपासी मिट्टी (रेगुर) / जल निकासी वाली दोमट',
        keyPests: ['सफेद मक्खी (बेगोमोवायरस वाहक)', 'लीफ हॉपर जैसिड्स', 'जीवाणु झुलसा', 'गुलाबी सुंडी'],
        description: 'कपास भारत की प्रमुख व्यावसायिक रेशा फसल है। अधिकतम पैदावार के लिए उच्च तापमान, मध्यम वर्षा और जल निकासी वाली गहरी काली मिट्टी आदर्श होती है।'
      }
    ];
  }
  if (lang === 'mr') {
    return [
      {
        id: 'cotton_bt',
        name: 'कापूस (Gossypium hirsutum)',
        scientificName: 'Gossypium hirsutum L.',
        season: 'खरीप हंगाम (मे - नोव्हेंबर)',
        durationDays: '150 - 180 दिवस',
        idealTemp: '21°C - 35°C',
        waterRequirement: '500 - 800 mm',
        soilType: 'काळी कापसाची माती (रेगूर) / चांगला निचरा होणारी जमीन',
        keyPests: ['पांढरी माशी (बेगोमोव्हायरस वाहक)', 'तुडतुडे (जॅसिड्स)', 'जिवाणू करपा', 'बोंड अळी'],
        description: 'कापूस हे भारतातील प्रमुख व्यावसायिक पीक आहे. भरपूर उत्पादनासाठी उष्ण तापमान, मध्यम पाऊस आणि पाण्याचा चांगला निचरा होणारी काळी माती उत्तम असते.'
      }
    ];
  }
  return [
    {
      id: 'cotton_bt',
      name: 'Cotton (Gossypium hirsutum)',
      scientificName: 'Gossypium hirsutum L.',
      season: 'Kharif Season (May - Nov)',
      durationDays: '150 - 180 Days',
      idealTemp: '21°C - 35°C',
      waterRequirement: '500 - 800 mm',
      soilType: 'Deep Black Cotton Soil (Regur) / Well-drained Loam',
      keyPests: ['Whitefly (Begomovirus vector)', 'Leaf Hopper Jassids', 'Bacterial Blight', 'Bollworm'],
      description: "Cotton is India's prime commercial fiber crop. High temperature, moderate rainfall, and well-drained deep black soil are ideal for maximum boll yield."
    }
  ];
}

/**
 * Normalizes any disease string (e.g. "Bacterial Blight", "bacterial_blight", "Bacterial Blight / Angular Leaf Spot")
 * to its standard canonical ID (e.g. "bacterial_blight").
 */
export function normalizeDiseaseId(diseaseIdOrName?: string | null): string {
  if (!diseaseIdOrName) return 'healthy_leaf';
  const clean = diseaseIdOrName.toLowerCase().trim().replace(/[-/\s]+/g, '_');
  if (clean.includes('bacterial') || clean.includes('blight') || clean.includes('angular')) return 'bacterial_blight';
  if (clean.includes('curl') || clean.includes('clcuv')) return 'curl_virus';
  if (clean.includes('jassid') || clean.includes('hopper')) return 'leaf_hopper_jassids';
  if (clean.includes('redding') || clean.includes('red')) return 'leaf_redding';
  if (clean.includes('herbicide') || clean.includes('phytotox')) return 'herbicide_growth_damage';
  if (clean.includes('variegat')) return 'leaf_variegation';
  if (clean.includes('healthy')) return 'healthy_leaf';
  return clean;
}

/**
 * Returns the localized disease profile for a given disease name/ID and language.
 */
export function getLocalizedDiseaseProfile(diseaseIdOrName: string | undefined | null, lang: Language): DiseaseProfile {
  const normId = normalizeDiseaseId(diseaseIdOrName);
  const list = getLocalizedDiseases(lang);
  const found = list.find((d) => d.id === normId);
  return found || list[0];
}

const SECONDARY_TAGS: Record<string, Record<Language, string>> = {
  whitefly: {
    en: 'Whiteflies (Bemisia tabaci)',
    hi: 'सफेद मक्खी (Whiteflies / Bemisia tabaci)',
    mr: 'पांढरी माशी (Whiteflies / Bemisia tabaci)'
  },
  aphid: {
    en: 'Aphids',
    hi: 'माहू / एफिड्स (Aphids)',
    mr: 'मावा (Aphids)'
  },
  thrip: {
    en: 'Thrips',
    hi: 'थ्रिप्स (Thrips)',
    mr: 'फुलकिडे / थ्रिप्स (Thrips)'
  },
  jassids_thrips: {
    en: 'Jassids & Thrips',
    hi: 'जस्सिड्स और थ्रिप्स (Jassids & Thrips)',
    mr: 'तुडतुडे आणि फुलकिडे (Jassids & Thrips)'
  },
  boll_rot: {
    en: 'Boll Rot Complex',
    hi: 'डोडी सड़न रोग (Boll Rot Complex)',
    mr: 'बोंड सड रोग (Boll Rot Complex)'
  },
  mg_deficiency: {
    en: 'Magnesium Deficiency',
    hi: 'मैग्नीशियम की कमी (Mg Deficiency)',
    mr: 'मॅग्नेशियम कमतरता (Mg Deficiency)'
  },
  soil_health: {
    en: 'Soil Health & Immunity Support',
    hi: 'मृदा स्वास्थ्य व रोग प्रतिरोधक क्षमता सुधार',
    mr: 'जमीन आरोग्य व पीक प्रतिकारशक्ती संवर्धन'
  }
};

/**
 * Returns the localized display name for a disease or pest tag.
 */
export function getLocalizedDiseaseName(diseaseIdOrName: string | undefined | null, lang: Language): string {
  if (!diseaseIdOrName) {
    const list = getLocalizedDiseases(lang);
    const healthy = list.find(d => d.id === 'healthy_leaf');
    return healthy ? healthy.name : 'Healthy Leaf';
  }
  const clean = diseaseIdOrName.toLowerCase().trim();
  if (clean.includes('whitefl') || clean.includes('bemisia')) return SECONDARY_TAGS.whitefly[lang] || SECONDARY_TAGS.whitefly.en;
  if (clean.includes('aphid')) return SECONDARY_TAGS.aphid[lang] || SECONDARY_TAGS.aphid.en;
  if (clean.includes('thrip') && clean.includes('jassid')) return SECONDARY_TAGS.jassids_thrips[lang] || SECONDARY_TAGS.jassids_thrips.en;
  if (clean.includes('thrip')) return SECONDARY_TAGS.thrip[lang] || SECONDARY_TAGS.thrip.en;
  if (clean.includes('boll') && clean.includes('rot')) return SECONDARY_TAGS.boll_rot[lang] || SECONDARY_TAGS.boll_rot.en;
  if (clean.includes('magnesium') && clean.includes('defic')) return SECONDARY_TAGS.mg_deficiency[lang] || SECONDARY_TAGS.mg_deficiency.en;
  if (clean.includes('soil') || clean.includes('immunity')) return SECONDARY_TAGS.soil_health[lang] || SECONDARY_TAGS.soil_health.en;

  const profile = getLocalizedDiseaseProfile(diseaseIdOrName, lang);
  return profile.name;
}

/**
 * Returns the localized description for a disease.
 */
export function getLocalizedDiseaseDescription(diseaseIdOrName: string | undefined | null, lang: Language): string {
  const profile = getLocalizedDiseaseProfile(diseaseIdOrName, lang);
  return profile.description;
}

export const TREATMENT_DESCRIPTIONS: Record<string, Record<Language, string>> = {
  blitox_strepto: {
    en: 'Broad-spectrum bactericide and protective copper fungicide designed to eliminate vascular Xanthomonas bacteria.',
    hi: 'व्यापक स्पेक्ट्रम जीवाणुनाशक और सुरक्षात्मक कॉपर कवकनाशी जो संवहनी ज़ैंथोमोनस जीवाणु को नष्ट करने हेतु तैयार किया गया है।',
    mr: 'जिवाणूनाशक आणि संरक्षणात्मक तांबेयुक्त बुरशीनाशक जे झँथोमोनस जिवाणूंचा संसर्ग नष्ट करण्यासाठी वापरले जाते.'
  },
  acetamiprid_diafenthiuron: {
    en: 'Systemic insecticide and miticide vector-suppressor that halts sap transmission of Begomoviruses.',
    hi: 'प्रणालीगत कीटनाशक और रस-चूसक कीट नियंत्रक जो बेगोमोवायरस के प्रसार और सफेद मक्खी को रोकता है।',
    mr: 'आंतरप्रवाही कीटकनाशक जे पांढऱ्या माशीचे नियंत्रण करून पर्णमोड (चुरडा-मुरडा) विषाणूचा प्रसार थांबवते.'
  },
  flonicamid_thiamethoxam: {
    en: 'Selective feeding blocker that causes immediate feeding cessation in jassid nymphs while preserving beneficial ladybird beetles.',
    hi: 'चयनात्मक कीटनाशक जो जस्सिड्स (हरा तेला) के रस चूसने पर तुरंत रोक लगाता है और मित्र कीटों की रक्षा करता है।',
    mr: 'निवडक कीटकनाशक जे तुडतुड्यांना रस शोषण्यापासून तत्काळ रोखते आणि मित्रकीटकांचे रक्षण करते.'
  },
  mgso4_npk: {
    en: 'Foliar nutritional corrective that replenishes magnesium reserves and restores chlorophyll synthesis.',
    hi: 'पोषक तत्व छिड़काव जो मैग्नीशियम की कमी को पूरा करता है और पत्तियों में हरा क्लोरोफिल वापस लाता है।',
    mr: 'पानांवरील अन्नद्रव्य फवारणी जी मॅग्नेशियमची कमतरता भरून काढून पानांमधील हरितद्रव्य पुनरुज्जीवित करते.'
  },
  humic_seaweed: {
    en: 'Natural biostimulant rich in plant auxins, cytokinins, and organic amino acids that reverses herbicide-induced cell damage.',
    hi: 'प्राकृतिक बायो-स्टिमुलेंट जो पादप हार्मोन और अमीनो एसिड से भरपूर है और खरपतवारनाशक से हुई क्षति को ठीक करता है।',
    mr: 'नैसर्गिक बायो-स्टिम्युलेटर जे वनस्पती संप्रेरकांनी समृद्ध असून तणनाशकाच्या धक्क्यातून पिकाला पूर्ववत करते.'
  },
  nske_neem: {
    en: 'Eco-friendly botanical repellant and antifeedant that disrupts insect oviposition and bacterial adherence.',
    hi: 'पर्यावरण अनुकूल वानस्पतिक नीम अर्क जो कीटों को दूर रखता है और अंडे देने व जीवाणु संक्रमण को रोकता है।',
    mr: 'पर्यावरणपूरक वनस्पतीजन्य निंबोळी अर्क जो कीटकांना दूर ठेवतो आणि अंडी घालण्यापासून रोखतो.'
  },
  yellow_sticky_verticillium: {
    en: 'Integrated bio-defense protocol combining physical vector trapping with entomopathogenic spore parasitism.',
    hi: 'एकीकृत जैविक सुरक्षा जिसमें पीले चिपचिपे जाल और मित्र फफूंद से सफेद मक्खी व रस-चूसक कीटों का नियंत्रण होता है।',
    mr: 'एकात्मिक जैविक कीड नियंत्रण ज्यामध्ये पिवळे चिकट सापळे आणि मित्र बुरशीच्या साहाय्याने कीड नियंत्रण केले जाते.'
  },
  azotobacter_psb: {
    en: 'Beneficial rhizobacteria that fix atmospheric nitrogen and solubilize bound soil phosphorus for enhanced root vigor.',
    hi: 'लाभकारी जीवाणु खाद जो वायुमंडलीय नाइट्रोजन को स्थिर करती है और मिट्टी के फास्फोरस को घोलकर जड़ों को मजबूत बनाती है।',
    mr: 'उपयुक्त जिवाणू खत जे हवेतील नत्र स्थिर करते आणि जमिनीतील स्फुरद विरघळवून मुळांची वाढ मजबूत करते.'
  }
};

export function getLocalizedTreatmentDescription(treatmentId: string, lang: Language): string {
  const t = TREATMENT_DESCRIPTIONS[treatmentId];
  if (!t) return '';
  return t[lang] || t.en;
}

export function getLocalizedThreatLevel(severity: string | undefined | null, lang: Language): string {
  const s = (severity || '').toLowerCase();
  if (lang === 'hi') {
    if (s.includes('crit')) return 'अत्यधिक गंभीर (CRITICAL)';
    if (s.includes('high')) return 'उच्च (HIGH)';
    if (s.includes('mod')) return 'मध्यम (MODERATE)';
    if (s.includes('low')) return 'निम्न (LOW)';
    return 'कोई नहीं (NONE)';
  }
  if (lang === 'mr') {
    if (s.includes('crit')) return 'अतिधोकादायक (CRITICAL)';
    if (s.includes('high')) return 'जास्त (HIGH)';
    if (s.includes('mod')) return 'मध्यम (MODERATE)';
    if (s.includes('low')) return 'कमी (LOW)';
    return 'काहीही नाही (NONE)';
  }
  return severity ? severity.toUpperCase() : 'NONE';
}

export function getLocalizedSprayInterval(intervalDays: number, lang: Language): string {
  if (lang === 'hi') return `प्रत्येक ${intervalDays} दिनों में दोहराएं`;
  if (lang === 'mr') return `दर ${intervalDays} दिवसांनी पुन्हा फवारणी करा`;
  return `Repeat every ${intervalDays} days`;
}

export function formatLocalizedDosageSummary(
  productName: string,
  waterLitres: number,
  acres: number,
  isHealthy: boolean,
  lang: Language
): string {
  if (isHealthy) {
    if (lang === 'hi') return 'स्वस्थ फसल के लिए किसी रासायनिक छिड़काव की आवश्यकता नहीं है।';
    if (lang === 'mr') return 'निरोगी पिकासाठी कोणत्याही रासायनिक फवारणीची आवश्यकता नाही.';
    return 'No chemical dosage required for healthy canopy.';
  }
  if (lang === 'hi') {
    return `${acres} एकड़ के लिए ${waterLitres}L पानी में ${productName} मिलाएं।`;
  }
  if (lang === 'mr') {
    return `${acres} एकरासाठी ${waterLitres}L पाण्यात ${productName} मिसळा.`;
  }
  return `Mix ${productName} in ${waterLitres}L water for ${acres} acre${acres > 1 ? 's' : ''}.`;
}

export function getLocalizedWeatherRule(isHealthy: boolean, lang: Language): string {
  if (isHealthy) {
    if (lang === 'hi') return 'अनुकूल मौसम व खेत की स्थिति। सामान्य फसल देखभाल जारी रखें।';
    if (lang === 'mr') return 'अनुकूल हवामान व शेतातील परिस्थिती. नियमित पीक व्यवस्थापन सुरू ठेवा.';
    return 'Favorable field conditions. Continue standard crop care.';
  }
  if (lang === 'hi') {
    return 'यदि तेज हवा (>12 किमी/घंटा) हो या 4 घंटे के भीतर बारिश की संभावना हो तो छिड़काव न करें।';
  }
  if (lang === 'mr') {
    return 'जोरदार वारा (>१२ किमी/तास) असल्यास किंवा ४ तासांत पावसाची शक्यता असल्यास फवारणी करू नका.';
  }
  return 'Do not spray if high wind (>12 km/h) or rainfall is expected within 4 hours.';
}

export function getLocalizedBioRemedy(isHealthy: boolean, rawRemedy: string, lang: Language): { remedy: string; description: string } {
  if (isHealthy) {
    if (lang === 'hi') {
      return {
        remedy: 'नियमित जैविक पोषक छिड़काव',
        description: 'मिट्टी में जैविक खाद बनाए रखें और मित्र कीटों का संरक्षण करें।'
      };
    }
    if (lang === 'mr') {
      return {
        remedy: 'नियमित सेंद्रिय पोषण फवारणी',
        description: 'जमिनीतील सेंद्रिय कर्ब राखा आणि मित्रकीटकांचे संवर्धन करा.'
      };
    }
    return {
      remedy: 'Routine organic foliar nourishment',
      description: 'Maintain soil organic matter and beneficial insect habitats.'
    };
  }

  if (lang === 'hi') {
    return {
      remedy: rawRemedy || 'नीम तेल (NSKE 5%) या स्यूडोमोनस',
      description: 'पर्यावरण के अनुकूल रोग नियंत्रण के लिए प्रमाणित जैविक विकल्प।'
    };
  }
  if (lang === 'mr') {
    return {
      remedy: rawRemedy || 'निंबोळी अर्क (NSKE ५%) किंवा सुडोमोनस',
      description: 'पर्यावरणपूरक रोग नियंत्रणासाठी प्रमाणित सेंद्रिय/जैविक पर्याय.'
    };
  }
  return {
    remedy: rawRemedy || 'Certified Bio-Control Formulation',
    description: 'Certified bio-organic alternative for eco-friendly disease control.'
  };
}

export function getLocalizedEmergencyAction(isHealthy: boolean, chemicalProduct: string, lang: Language): string {
  if (isHealthy) {
    if (lang === 'hi') return 'फसल में कोई रोग नहीं मिला। सामान्य फसल देखभाल और कीट निरीक्षण जारी रखें।';
    if (lang === 'mr') return 'पिकात कोणताही रोग आढळला नाही. नियमित पाहणी व खत व्यवस्थापन सुरू ठेवा.';
    return 'No disease symptoms detected. Continue routine pest monitoring and standard agronomic practices.';
  }
  if (lang === 'hi') return `तत्काल जरूरी कदम: अगले 24-48 घंटों के भीतर ${chemicalProduct} का छिड़काव करें।`;
  if (lang === 'mr') return `तातडीची कारवाई: पुढील २४-४८ तासांत ${chemicalProduct} ची फवारणी करा.`;
  return `Immediate Action Required: Apply ${chemicalProduct} within next 24-48 hours.`;
}
