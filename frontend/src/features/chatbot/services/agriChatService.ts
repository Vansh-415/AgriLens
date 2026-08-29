import type { Language } from '../../../i18n/translations';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  isVoice?: boolean;
}

/**
 * Strips markdown, symbols, and formatting for natural, fluent voice readout
 */
export function cleanTextForSpeech(rawText: string): string {
  return rawText
    .replace(/[🌿🌾•\-\*#_`~]/g, ' ')
    .replace(/[:]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Robust voice selector that ensures Marathi and Hindi Devanagari text
 * is never played using an English robotic voice
 */
export function getBestVoiceForLanguage(targetLang: Language): { voice: SpeechSynthesisVoice | null; langCode: string } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return {
      voice: null,
      langCode: targetLang === 'hi' ? 'hi-IN' : targetLang === 'mr' ? 'hi-IN' : 'en-IN',
    };
  }

  const voices = window.speechSynthesis.getVoices();

  // 1. MARATHI (mr)
  if (targetLang === 'mr') {
    // A. Check for genuine Marathi voice
    const mrVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith('mr') ||
        v.name.toLowerCase().includes('marathi')
    );
    if (mrVoice) {
      return { voice: mrVoice, langCode: 'mr-IN' };
    }

    // B. Devanagari Fallback: Native Hindi Neural Voice (Google हिन्दी / Microsoft Hemant / Kalpana / Heera)
    // Devanagari phonology in Hindi voice articulates Marathi syllables accurately without garbling
    const hiVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('hemant') ||
        v.name.toLowerCase().includes('kalpana')
    );
    if (hiVoice) {
      return { voice: hiVoice, langCode: 'hi-IN' };
    }

    // C. Indian regional voice
    const inVoice = voices.find((v) => v.lang.toLowerCase().includes('in'));
    if (inVoice) {
      return { voice: inVoice, langCode: 'hi-IN' };
    }

    return { voice: null, langCode: 'hi-IN' };
  }

  // 2. HINDI (hi)
  if (targetLang === 'hi') {
    const hiVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('hemant') ||
        v.name.toLowerCase().includes('kalpana')
    );
    if (hiVoice) {
      return { voice: hiVoice, langCode: 'hi-IN' };
    }

    const inVoice = voices.find((v) => v.lang.toLowerCase().includes('in'));
    return { voice: inVoice || null, langCode: 'hi-IN' };
  }

  // 3. ENGLISH (en)
  const enInVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().replace('_', '-') === 'en-in' ||
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('ravi') ||
      v.name.toLowerCase().includes('heera')
  );
  if (enInVoice) {
    return { voice: enInVoice, langCode: 'en-IN' };
  }

  const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  return { voice: enVoice || null, langCode: 'en-IN' };
}

type TopicIntent =
  | 'leaf_curl'
  | 'bacterial_blight'
  | 'grey_mildew'
  | 'leaf_redding'
  | 'pink_bollworm'
  | 'sucking_pests'
  | 'fertilizer'
  | 'weather'
  | 'greeting';

/**
 * Multilingual Intent Classifier that parses keywords across EN, HI, and MR
 */
function classifyIntent(input: string): TopicIntent {
  const q = input.toLowerCase().trim();
  if (!q) return 'greeting';

  // 1. Bacterial Blight (Check before general words to avoid collision)
  if (
    q.includes('bacterial') ||
    q.includes('blight') ||
    q.includes('angular') ||
    q.includes('जिवाणू') ||
    q.includes('जीवाणु') ||
    q.includes('करपा') ||
    q.includes('ब्लाइट') ||
    q.includes('ठिपके') ||
    q.includes('blitox') ||
    q.includes('strepto')
  ) {
    return 'bacterial_blight';
  }

  // 2. Leaf Curl Virus & Whitefly
  if (
    q.includes('curl') ||
    q.includes('clcuv') ||
    q.includes('whitefly') ||
    q.includes('पर्णमोड') ||
    q.includes('मरोड़िया') ||
    q.includes('सफेद मक्खी') ||
    q.includes('पांढरी माशी') ||
    q.includes('माशी') ||
    q.includes('चूर्ण')
  ) {
    return 'leaf_curl';
  }

  // 3. Grey Mildew / Dahiya
  if (
    q.includes('dahiya') ||
    q.includes('mildew') ||
    q.includes('दहिया') ||
    q.includes('भुरी') ||
    q.includes('पांढरी बुरशी') ||
    q.includes('सफेद फफूंद') ||
    q.includes('powdery')
  ) {
    return 'grey_mildew';
  }

  // 4. Physiological Leaf Redding (Lalya / Magnesium)
  if (
    q.includes('redding') ||
    q.includes('red leaf') ||
    q.includes('magnesium') ||
    q.includes('लाल्या') ||
    q.includes('पत्ती लाल') ||
    q.includes('लाल') ||
    q.includes('मॅग्नेशियम') ||
    q.includes('mgso4')
  ) {
    return 'leaf_redding';
  }

  // 5. Pink Bollworm
  if (
    q.includes('pink') ||
    q.includes('bollworm') ||
    q.includes('गुलाबी') ||
    q.includes('बोंडअळी') ||
    q.includes('सुंडी') ||
    q.includes('फेरोमोन') ||
    q.includes('trap')
  ) {
    return 'pink_bollworm';
  }

  // 6. Sucking Pests (Jassids, Aphids, Thrips)
  if (
    q.includes('jassid') ||
    q.includes('aphid') ||
    q.includes('thrip') ||
    q.includes('hopper') ||
    q.includes('sucking') ||
    q.includes('तुडतुडे') ||
    q.includes('मावा') ||
    q.includes('थ्रिप्स') ||
    q.includes('तेला') ||
    q.includes('चेपा')
  ) {
    return 'sucking_pests';
  }

  // 7. Fertilizer Schedule & Nutrition
  if (
    q.includes('fertilizer') ||
    q.includes('npk') ||
    q.includes('urea') ||
    q.includes('dap') ||
    q.includes('खत') ||
    q.includes('खाद') ||
    q.includes('पोषक') ||
    q.includes('schedule')
  ) {
    return 'fertilizer';
  }

  // 8. Weather & Spraying Precautions
  if (
    q.includes('weather') ||
    q.includes('rain') ||
    q.includes('wind') ||
    q.includes('हवामान') ||
    q.includes('मौसम') ||
    q.includes('पाऊस') ||
    q.includes('बारिश') ||
    q.includes('वारा') ||
    q.includes('हवा')
  ) {
    return 'weather';
  }

  return 'greeting';
}

/**
 * Intelligent Agronomic Knowledge Engine for Cotton Crops
 * Supports English (en), Hindi (hi), and Marathi (mr) with acreage scaling.
 */
export function generateAgronomistResponse(
  userInput: string,
  landAcres: number = 1.0,
  language: Language = 'en'
): { text: string; suggestedActions: string[] } {
  const intent = classifyIntent(userInput);
  const waterVol = Math.round(landAcres * 200);

  // ==========================================
  // 1. MARATHI LANGUAGE RESPONSES (mr)
  // ==========================================
  if (language === 'mr') {
    switch (intent) {
      case 'leaf_curl': {
        const acetamiprid = Math.round(landAcres * 100);
        const diafenthiuron = Math.round(landAcres * 250);
        return {
          text: `🌿 कापूस पर्णमोड (Leaf Curl Virus) आणि पांढरी माशी नियंत्रण:

• रासायनिक उपाय:
  - अ‍ॅसिटामिप्रिड २०% SP: ${acetamiprid} ग्रॅम (${landAcres} एकरासाठी)
  - किंवा डायफेंथिओरॉन ५०% WP: ${diafenthiuron} ग्रॅम
• आवश्यक फवारणी पाणी: ${waterVol} लिटर स्वच्छ पाणी वापरा.
• सेंद्रिय व जैविक उपाय:
  - प्रति एकरी १५-२० पिवळे चिकट सापळे लावा.
  - ५% निंबोळी अर्क (NSKE) किंवा कडुलिंब तेल ५०० मिली फवारा.
• आर्थिक नुकसान पातळी (ETL): प्रति पान १-२ पांढऱ्या माशा दिसताच फवारणी सुरू करा.`,
          suggestedActions: ['जिवाणू करपा औषध', 'लाल्या रोगावर उपाय', 'फवारणी हवामान नियम']
        };
      }

      case 'bacterial_blight': {
        const copper = Math.round(landAcres * 500);
        const strepto = Math.round(landAcres * 20);
        return {
          text: `🌿 कापूस जिवाणूजन्य करपा (Bacterial Blight / Angular Leaf Spot) उपाय:

• शिफारस केलेले रासायनिक मिश्रण:
  - कॉपर ऑक्सिक्लोराइड ५०% WP: ${copper} ग्रॅम (${landAcres} एकरासाठी)
  - स्ट्रेप्टोसायक्लिन: ${strepto} ग्रॅम
• फवारणी पाणी: ${waterVol} लिटर स्वच्छ पाण्यात नीट मिसळून फवारा.
• काढणीपूर्व प्रतीक्षा (PHI): फवारणीनंतर किमान १५ दिवस काढणी करू नका.
• प्रतिबंधात्मक काळजी: अतिरिक्त नत्र खतांचा वापर टाळा आणि शेतात पाण्याचा निचरा व्यवस्थित ठेवा.`,
          suggestedActions: ['दहिया रोगावर उपाय', 'पांढरी माशी नियंत्रण', 'खत वेळापत्रक']
        };
      }

      case 'grey_mildew': {
        const azoxy = Math.round(landAcres * 200);
        const carbendazim = Math.round(landAcres * 250);
        return {
          text: `🌿 कापूस दहिया रोग / भुरी (Grey Mildew) नियंत्रण:

• रासायनिक फवारणी:
  - अझॉक्सीस्ट्रॉबिन १८.२% + डायफेनोकोनाझोल ११.४% SC: ${azoxy} मिली (${landAcres} एकरासाठी)
  - किंवा कार्बेन्डाझिम ५०% WP: ${carbendazim} ग्रॅम
• पाणी प्रमाण: ${waterVol} लिटर पाण्यात मिसळा.
• फवारणी वेळ: पानाच्या खालील भागावर पांढरी भुकटी दिसताच सकाळी किंवा संध्याकाळी फवारणी करावी.`,
          suggestedActions: ['जिवाणू करपा औषध', 'लाल्या रोगावर उपाय', 'फवारणी हवामान नियम']
        };
      }

      case 'leaf_redding': {
        const mg = (landAcres * 1.0).toFixed(1);
        const npk = (landAcres * 1.0).toFixed(1);
        return {
          text: `🌿 कापूस लाल्या रोग (Physiological Leaf Redding) व्यवस्थापन:

• कारण: अन्नद्रव्यांची कमतरता (मॅग्नेशियम व नत्र) आणि थंडीचा ताण.
• फवारणी उपाय:
  - मॅग्नेशियम सल्फेट (Mg-SO4): ${mg} किलो (${landAcres} एकरासाठी)
  - १९:१९:१९ विद्राव्य खत: ${npk} किलो
• पाणी प्रमाण: ${waterVol} लिटर स्वच्छ पाण्यात मिसळून फवारणी करा.
• जमीन व्यवस्थापन: बोंडे भरण्याच्या काळात जमिनीत पुरेसा ओलावा टिकवून ठेवा.`,
          suggestedActions: ['खत फवारणी वेळापत्रक', 'पांढरी माशी नियंत्रण', 'हवामान सुरक्षा नियम']
        };
      }

      case 'pink_bollworm': {
        const emamectin = Math.round(landAcres * 100);
        const profenofos = Math.round(landAcres * 400);
        return {
          text: `🌿 कापूस गुलाबी बोंडअळी (Pink Bollworm) एकात्मिक नियंत्रण:

• कामगंध सापळे: एकरी ५-८ फेरोमोन ट्रॅप लावा (ETL: सलग ३ दिवस प्रति ट्रॅप ८ पतंग).
• रासायनिक फवारणी:
  - इमामेक्टिन बेन्झोएट ५% SG: ${emamectin} ग्रॅम (${landAcres} एकरासाठी)
  - किंवा प्रोफेनोफॉस ५०% EC: ${profenofos} मिली
• पाणी प्रमाण: ${waterVol} लिटर पाण्यात मिसळा.
• निंबोळी अर्क ५% ची पहिली फवारणी फुले येण्याच्या सुरुवातीला करा.`,
          suggestedActions: ['लाल्या रोगावर उपाय', 'तुडतुडे नियंत्रण', 'फवारणी हवामान नियम']
        };
      }

      case 'sucking_pests': {
        const flonicamid = Math.round(landAcres * 80);
        const thiamethoxam = Math.round(landAcres * 40);
        return {
          text: `🌿 रसशोषक कीटक (तुडतुडे, मावा, थ्रिप्स) नियंत्रण:

• रासायनिक पर्याय:
  - फ्लोनिकामिड ५०% WG: ${flonicamid} ग्रॅम (${landAcres} एकरासाठी)
  - किंवा थायामेथॉक्सम २५% WG: ${thiamethoxam} ग्रॅम
• पाणी प्रमाण: ${waterVol} लिटर पाणी वापरा.
• सेंद्रिय उपाय: निंबोळी तेल ५ मिली प्रति लिटर पाण्यात मिसळून फवारा.`,
          suggestedActions: ['पांढरी माशी नियंत्रण', 'जिवाणू करपा औषध', 'गुलाबी बोंडअळी उपाय']
        };
      }

      case 'fertilizer': {
        return {
          text: `🌿 कापूस पीक खत व्यवस्थापन वेळापत्रक:

• पायाभूत डोस (पेरणीवेळी): DAP किंवा १०:२६:२६ + पोटॅश.
• पहिली खताची मात्रा (३० दिवसांनी): युरिया + सूक्ष्मअन्नद्रव्ये.
• दुसरी मात्रा (६० दिवसांनी - फुलोरा अवस्था): युरिया + पोटॅश + मॅग्नेशियम सल्फेट.
• फवारणी खते: फुलोरा व बोंड अवस्थेत ०:५२:३४ आणि १३:०:४५ ची फवारणी फायदेशीर ठरते.`,
          suggestedActions: ['लाल्या रोगावर उपाय', 'फवारणी हवामान नियम', 'जिवाणू करपा औषध']
        };
      }

      case 'weather': {
        return {
          text: `🌿 फवारणीसाठी हवामान सुरक्षा मार्गदर्शक सूचना:

• हवेचा वेग: ताशी १५ किमी पेक्षा जास्त वारा असल्यास फवारणी करू नका.
• तापमान: २५°C ते ३५°C दरम्यान तापमान योग्य असते; दुपारचे कडक ऊन टाळा.
• पाऊस अंदाज: फवारणीनंतर किमान २-३ तास पाऊस नसणे आवश्यक आहे (Rainfastness).
• स्टिकर/स्प्रेडर: पावसाळ्यात फवारणी करताना सिलिकॉनयुक्त स्प्रेडर नक्की वापरा.`,
          suggestedActions: ['पर्णमोड (Leaf Curl) औषध', 'जिवाणू करपा औषध', 'गुलाबी बोंडअळी उपाय']
        };
      }

      default: {
        return {
          text: `नमस्कार! मी ॲग्रीलेन्स एआय कृषी सल्लागार आहे 🌾.

मी तुमच्या ${landAcres} एकर शेतानुसार कापूस पिकाचे रोग, किडी, औषध प्रमाण, पाणी आणि फवारणी नियमांची माहिती देऊ शकतो.

खालीलपैकी कोणताही प्रश्न विचारू शकता:`,
          suggestedActions: [
            'पर्णमोड (Leaf Curl) औषध',
            'जिवाणू करपा औषध व PHI',
            'लाल्या रोगावर फवारणी उपाय',
            'गुलाबी बोंडअळी नियंत्रण'
          ]
        };
      }
    }
  }

  // ==========================================
  // 2. HINDI LANGUAGE RESPONSES (hi)
  // ==========================================
  if (language === 'hi') {
    switch (intent) {
      case 'leaf_curl': {
        const acetamiprid = Math.round(landAcres * 100);
        const diafenthiuron = Math.round(landAcres * 250);
        return {
          text: `🌿 कपास पत्ती मरोड़िया (Leaf Curl Virus) और सफेद मक्खी नियंत्रण:

• रासायनिक उपचार:
  - एसिटामिप्रिड 20% SP: ${acetamiprid} ग्राम (${landAcres} एकड़ हेतु)
  - या डायफेंथियूरॉन 50% WP: ${diafenthiuron} ग्राम
• आवश्यक स्प्रे पानी: ${waterVol} लीटर साफ पानी में मिलाकर छिड़काव करें।
• जैविक एवं निवारक उपाय:
  - 15-20 पीले चिपचिपे कार्ड (Yellow Sticky Traps) प्रति एकड़ लगाएं।
  - 5% नीम तेल (NSKE) 500 मिली प्रति एकड़ छिड़कें।
• आर्थिक सीमा (ETL): 1-2 सफेद मक्खी प्रति पत्ती दिखते ही तुरंत छिड़काव करें।`,
          suggestedActions: ['जीवाणु ब्लाइट की दवा', 'पत्ती लाल होने का उपाय', 'मौसम छिड़काव नियम']
        };
      }

      case 'bacterial_blight': {
        const copper = Math.round(landAcres * 500);
        const strepto = Math.round(landAcres * 20);
        return {
          text: `🌿 कपास जीवाणु जनित धब्बा रोग (Bacterial Blight / Angular Leaf Spot):

• अनुशंसित रासायनिक घोल:
  - कॉपर ऑक्सीक्लोराइड 50% WP: ${copper} ग्राम (${landAcres} एकड़ हेतु)
  - स्ट्रेप्टोसाइक्लिन: ${strepto} ग्राम
• स्प्रे पानी की मात्रा: ${waterVol} लीटर साफ पानी में घोलें।
• कटाई पूर्व प्रतीक्षा अवधि (PHI): छिड़काव के बाद कम से कम 15 दिन कटाई न करें।
• बचाव उपाय: अत्यधिक यूरिया का उपयोग न करें तथा खेत में जल निकास सुनिश्चित करें।`,
          suggestedActions: ['दहिया रोग का समाधान', 'सफेद मक्खी नियंत्रण', 'खाद अनुसूची']
        };
      }

      case 'grey_mildew': {
        const azoxy = Math.round(landAcres * 200);
        const carbendazim = Math.round(landAcres * 250);
        return {
          text: `🌿 कपास दहिया रोग / सफेद फफूंद (Grey Mildew) नियंत्रण:

• अनुशंसित कवकनाशी:
  - एजॉक्सीस्ट्रोबिन 18.2% + डाइफेनोकोनाजोल 11.4% SC: ${azoxy} मिली (${landAcres} एकड़ हेतु)
  - या कार्बेन्डाजिम 50% WP: ${carbendazim} ग्राम
• पानी की मात्रा: ${waterVol} लीटर पानी में मिलाकर छिड़कें।
• छिड़काव समय: पत्ती के नीचे सफेद पाउडर दिखते ही सुबह या शाम छिड़काव करें।`,
          suggestedActions: ['जीवाणु ब्लाइट की दवा', 'पत्ती लाल होने का उपाय', 'मौसम छिड़काव नियम']
        };
      }

      case 'leaf_redding': {
        const mg = (landAcres * 1.0).toFixed(1);
        const npk = (landAcres * 1.0).toFixed(1);
        return {
          text: `🌿 कपास में पत्ती लाल होना (Physiological Leaf Redding) समाधान:

• यह मैग्नीशियम/नाइट्रोजन की कमी और ठंड के तनाव से होता है।
• छिड़काव उपाय:
  - मैग्नीशियम सल्फेट (Mg-SO4): ${mg} किग्रा (${landAcres} एकड़ हेतु)
  - 19:19:19 NPK घुलनशील खाद: ${npk} किग्रा
• पानी की मात्रा: ${waterVol} लीटर साफ पानी में घोल बनाकर छिड़कें।
• सिंचाई: टिंडे बनते समय खेत में नमी का उचित स्तर बनाए रखें।`,
          suggestedActions: ['खाद अनुसूची', 'सफेद मक्खी नियंत्रण', 'मौसम छिड़काव नियम']
        };
      }

      case 'pink_bollworm': {
        const emamectin = Math.round(landAcres * 100);
        const profenofos = Math.round(landAcres * 400);
        return {
          text: `🌿 कपास गुलाबी सुंडी (Pink Bollworm) प्रबंधन:

• फेरोमोन ट्रैप: 5-8 ट्रैप प्रति एकड़ लगाएं।
• रासायनिक छिड़काव:
  - इमामेक्टिन बेंजोएट 5% SG: ${emamectin} ग्राम (${landAcres} एकड़ हेतु)
  - या प्रोफेनोफॉस 50% EC: ${profenofos} मिली
• पानी की मात्रा: ${waterVol} लीटर पानी का उपयोग करें।
• फूल आने की शुरुआती अवस्था में नीम तेल 5% का छिड़काव अवश्य करें।`,
          suggestedActions: ['हरा तेला नियंत्रण', 'पत्ती लाल होने का उपाय', 'मौसम छिड़काव नियम']
        };
      }

      case 'sucking_pests': {
        const flonicamid = Math.round(landAcres * 80);
        const thiamethoxam = Math.round(landAcres * 40);
        return {
          text: `🌿 रस चूसक कीट (हरा तेला, चेपा, थ्रिप्स) नियंत्रण:

• रासायनिक विकल्प:
  - फ्लोनिकामिड 50% WG: ${flonicamid} ग्राम (${landAcres} एकड़ हेतु)
  - या थियामेथॉक्सम 25% WG: ${thiamethoxam} ग्राम
• पानी की मात्रा: ${waterVol} लीटर पानी में मिलाएं।
• जैविक उपाय: 5 मिली प्रति लीटर नीम का तेल मिलाकर छिड़कें।`,
          suggestedActions: ['सफेद मक्खी नियंत्रण', 'जीवाणु ब्लाइट की दवा', 'गुलाबी सुंडी उपाय']
        };
      }

      case 'fertilizer': {
        return {
          text: `🌿 कपास फसल खाद प्रबंधन अनुसूची:

• बुवाई के समय (बेसल डोज): DAP या 10:26:26 + पोटाश।
• पहली टॉप ड्रेसिंग (30 दिन पर): यूरिया + जिंक/माइक्रोन्यूट्रिएंट्स।
• दूसरी टॉप ड्रेसिंग (60 दिन पर): यूरिया + पोटाश + मैग्नीशियम सल्फेट।
• फोलियर स्प्रे: फूल और टिंडे बनने पर 0:52:34 और 13:0:45 का छिड़काव लाभकारी है।`,
          suggestedActions: ['पत्ती लाल होने का उपाय', 'जीवाणु ब्लाइट की दवा', 'मौसम छिड़काव नियम']
        };
      }

      case 'weather': {
        return {
          text: `🌿 सुरक्षित छिड़काव हेतु मौसम दिशानिर्देश:

• हवा की गति: 15 किमी/घंटे से अधिक तेज हवा में छिड़काव न करें।
• तापमान: 25°C से 35°C के बीच सुबह या शाम छिड़काव उत्तम है।
• बारिश की संभावना: छिड़काव के बाद कम से कम 2-3 घंटे बारिश नहीं होनी चाहिए।
• स्टीकर/स्प्रेडर: बारिश के मौसम में सिलिकॉन स्प्रेडर अवश्य मिलाएं।`,
          suggestedActions: ['पत्ती मरोड़िया दवा', 'जीवाणु ब्लाइट दवा', 'गुलाबी सुंडी उपाय']
        };
      }

      default: {
        return {
          text: `नमस्ते! मैं एग्रीलेंस एआई कृषि सलाहकार हूं 🌾।

मैं आपके ${landAcres} एकड़ खेत के अनुसार कपास रोगों, कीटों, दवा की मात्रा और पानी के अनुपात की जानकारी दे सकता हूं।

नीचे दिए गए किसी भी विषय पर पूछें:`,
          suggestedActions: [
            'पत्ती मरोड़िया (Leaf Curl) स्प्रे',
            'जीवाणु ब्लाइट दवा एवं PHI',
            'पत्ती लाल होना समाधान',
            'गुलाबी सुंडी नियंत्रण'
          ]
        };
      }
    }
  }

  // ==========================================
  // 3. ENGLISH LANGUAGE RESPONSES (en - Default)
  // ==========================================
  switch (intent) {
    case 'leaf_curl': {
      const acetamiprid = Math.round(landAcres * 100);
      const diafenthiuron = Math.round(landAcres * 250);
      return {
        text: `🌿 Cotton Leaf Curl Virus (CLCuV) & Whitefly Vector Management:

• Curative Chemical Options:
  - Acetamiprid 20% SP: ${acetamiprid}g (for ${landAcres} acre(s))
  - OR Diafenthiuron 50% WP: ${diafenthiuron}g
• Water Volume Requirement: Dilute thoroughly in ${waterVol} Litres clean water.
• Bio-Organic & Cultural Measures:
  - Deploy 15-20 Yellow Sticky Traps per acre.
  - Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil (10,000 PPM).
• Economic Threshold Level (ETL): Intervene promptly when 1-2 whiteflies per leaf are observed.`,
        suggestedActions: ['Bacterial Blight Solution', 'Leaf Redding Solution', 'Safe Spray Weather Rules']
      };
    }

    case 'bacterial_blight': {
      const copper = Math.round(landAcres * 500);
      const strepto = Math.round(landAcres * 20);
      return {
        text: `🌿 Bacterial Blight / Angular Leaf Spot Management:

• Recommended Chemical Formulation:
  - Copper Oxychloride 50% WP: ${copper}g total (for ${landAcres} acre(s))
  - Streptocycline: ${strepto}g total
• Spray Dilution Volume: Mix into ${waterVol} Litres of water.
• Pre-Harvest Interval (PHI): Observe a minimum 15-day waiting period.
• Preventive Measures: Avoid excessive nitrogenous fertilizers and ensure proper field drainage.`,
        suggestedActions: ['Grey Mildew Control', 'Leaf Curl Virus Spray', 'NPK Fertilizer Schedule']
      };
    }

    case 'grey_mildew': {
      const azoxy = Math.round(landAcres * 200);
      const carbendazim = Math.round(landAcres * 250);
      return {
        text: `🌿 Grey Mildew (Dahiya Disease) Control:

• Recommended Fungicides:
  - Azoxystrobin 18.2% + Difenoconazole 11.4% SC: ${azoxy} ml (for ${landAcres} acre(s))
  - OR Carbendazim 50% WP: ${carbendazim}g
• Spray Volume: Dissolve into ${waterVol} Litres clean water.
• Application Timing: Apply at the first onset of powdery whitish fungal growth on lower leaf surfaces.`,
        suggestedActions: ['Bacterial Blight Solution', 'Leaf Redding Solution', 'Safe Spray Weather Rules']
      };
    }

    case 'leaf_redding': {
      const mg = (landAcres * 1.0).toFixed(1);
      const npk = (landAcres * 1.0).toFixed(1);
      return {
        text: `🌿 Physiological Leaf Redding Management:

• Cause: Micronutrient deficiency (Magnesium/Nitrogen) compounded by cold night stress.
• Foliar Spray Recommendation:
  - Magnesium Sulphate (MgSO4): ${mg} kg (for ${landAcres} acre(s))
  - Water-Soluble NPK 19:19:19: ${npk} kg
• Spray Water Volume: Mix in ${waterVol} Litres clean water.
• Soil Care: Maintain consistent soil moisture during peak boll development.`,
        suggestedActions: ['Fertilizer Schedule', 'Sucking Pest Spray', 'Safe Spray Weather Rules']
      };
    }

    case 'pink_bollworm': {
      const emamectin = Math.round(landAcres * 100);
      const profenofos = Math.round(landAcres * 400);
      return {
        text: `🌿 Pink Bollworm (Pectinophora gossypiella) IPM Strategy (General Advisory Note: Not covered by leaf photo AI diagnosis):

• Pheromone Traps: Install 5-8 traps/acre (ETL: 8 moths/trap/night for 3 consecutive days).
• Curative Spray Options:
  - Emamectin Benzoate 5% SG: ${emamectin}g (for ${landAcres} acre(s))
  - OR Profenofos 50% EC: ${profenofos} ml
• Water Volume: Mix in ${waterVol} Litres water.
• Preventive Application: Apply Neem Oil 5% at early flowering stage.`,
        suggestedActions: ['Jassids & Aphids Spray', 'Leaf Redding Solution', 'Safe Spray Weather Rules']
      };
    }

    case 'sucking_pests': {
      const flonicamid = Math.round(landAcres * 80);
      const thiamethoxam = Math.round(landAcres * 40);
      return {
        text: `🌿 Sucking Pests (Jassids, Aphids, Thrips) Management:

• Chemical Solutions:
  - Flonicamid 50% WG: ${flonicamid}g (for ${landAcres} acre(s))
  - OR Thiamethoxam 25% WG: ${thiamethoxam}g
• Water Volume: Dilute in ${waterVol} Litres water.
• Bio-Organic Alternative: Spray Neem Oil (10,000 PPM) at 5ml per litre of water.`,
        suggestedActions: ['Leaf Curl Virus Spray', 'Bacterial Blight Solution', 'Leaf Hopper Jassids Control']
      };
    }

    case 'fertilizer': {
      return {
        text: `🌿 Cotton Crop Agronomic Fertilizer Guidelines:

• Basal Application (At Sowing): DAP or 10:26:26 + MOP (Muriate of Potash).
• 1st Top Dressing (30-35 DAS): Urea + Zinc Sulphate.
• 2nd Top Dressing (60-65 DAS - Peak Flowering): Urea + Potash + Magnesium Sulphate.
• Foliar Sprays: 0:52:34 and 13:0:45 during flowering and boll development phases.`,
        suggestedActions: ['Leaf Redding Solution', 'Bacterial Blight Solution', 'Safe Spray Weather Rules']
      };
    }

    case 'weather': {
      return {
        text: `🌿 Safe Spraying & Weather Precautions:

• Wind Speed: Do not spray if wind exceeds 15 km/h to prevent chemical drift.
• Temperature: Optimal range is 25°C–35°C; avoid high-noon heat.
• Rainfastness: Ensure a clear rain-free window of at least 2–3 hours post-application.
• Adjuvants: Mix a non-ionic silicone spreader/sticker during monsoon spraying.`,
        suggestedActions: ['Leaf Curl Virus Chemical Spray', 'Bacterial Blight Solution', 'Leaf Hopper Jassids Control']
      };
    }

    default: {
      return {
        text: `Namaste! I am AgriLens AI Agronomist 🌾.

I can assist with cotton pathology diagnostics, chemical dilution calculations for your ${landAcres} acre(s), bio-organic remedies, and weather spraying rules.

Try selecting any topic below:`,
        suggestedActions: [
          'Curative spray for Leaf Curl Virus',
          'Bacterial Blight dosage & water volume',
          'Physiological Leaf Redding solution',
          'Leaf Hopper Jassids & sucking pests IPM'
        ]
      };
    }
  }
}
