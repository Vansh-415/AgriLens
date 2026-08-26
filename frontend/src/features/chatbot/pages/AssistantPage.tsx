import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState, useRef, useEffect, useCallback } from 'react';
import { generateAgronomistResponse, cleanTextForSpeech, getBestVoiceForLanguage } from '../services/agriChatService';
import type { ChatMessage } from '../services/agriChatService';
import { useLanguage } from '../../../context/LanguageContext';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';
import {
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Leaf,
  Droplets,
  CloudSun,
  Copy,
  Check,
  Info,
  Layers
} from 'lucide-react';

export default function AssistantPage() {
  useDocumentTitle('AI Agronomist Crop Advisory');
  const { language, t } = useLanguage();
  const a = t.assistant;

  const [input, setInput] = useState('');
  const [landAcres, setLandAcres] = useState<number>(1.0);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const toast = useToast();

  const getInitialGreeting = useCallback((): { text: string; actions: string[] } => {
    const res = generateAgronomistResponse('', landAcres, language);
    return {
      text: res.text,
      actions: res.suggestedActions,
    };
  }, [landAcres, language]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initial = generateAgronomistResponse('', 1.0, language);
    return [
      {
        id: 'msg-init',
        sender: 'bot',
        text: initial.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: initial.suggestedActions,
      },
    ];
  });

  // When language changes, update greeting if chat is at initial state
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'bot') {
      const g = getInitialGreeting();
      setMessages([
        {
          id: 'msg-init',
          sender: 'bot',
          text: g.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: g.actions,
        },
      ]);
    }
  }, [language, getInitialGreeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Clean up speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Stop current active speech
  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingMsgId(null);
  };

  // Multilingual Speech Synthesis Play / Stop Toggle
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Voice Playback Not Supported', 'Your browser does not support Web Speech Synthesis.');
      return;
    }

    // If this message is already speaking, stop it
    if (playingMsgId === msgId) {
      handleStopSpeech();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    const { voice, langCode } = getBestVoiceForLanguage(language);
    utterance.lang = langCode;
    if (voice) {
      utterance.voice = voice;
    }

    // Clear and natural cadence: 0.88 for Marathi & Hindi Devanagari syllables, 0.95 for English
    utterance.rate = language === 'en' ? 0.95 : 0.88;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setPlayingMsgId(msgId);
    };

    utterance.onend = () => {
      setPlayingMsgId(null);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e);
      }
      setPlayingMsgId(null);
    };

    setPlayingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy message text to clipboard
  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch {
      toast.error('Copy Failed', 'Could not copy message to clipboard.');
    }
  };

  // Speech Recognition (Voice Input) in EN, HI, MR
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Voice Input Not Supported', 'Web Speech Recognition is not supported on this browser.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info(
          t.common.listening,
          `Speak clearly in ${language === 'hi' ? 'Hindi (हिंदी)' : language === 'mr' ? 'Marathi (मराठी)' : 'English'}.`
        );
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript, true);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast.error('Voice Recognition Error', event.error || 'Could not recognize audio.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      toast.error('Voice Error', 'Could not access microphone permissions.');
    }
  };

  // Send message
  const handleSend = (textToSend?: string, wasVoice: boolean = false) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Stop speaking when user sends a new message
    handleStopSpeech();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: wasVoice,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const res = generateAgronomistResponse(query, landAcres, language);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (wasVoice) {
        setTimeout(() => {
          handleToggleSpeak(botMsg.id, botMsg.text);
        }, 100);
      }
    }, 450);
  };

  // Reset conversation
  const handleReset = () => {
    handleStopSpeech();
    const g = getInitialGreeting();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: g.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: g.actions,
      },
    ]);
  };

  // Quick topics by language
  const commonTopics = [
    {
      label:
        language === 'hi'
          ? 'पत्ती मरोड़िया (Leaf Curl Virus) स्प्रे'
          : language === 'mr'
          ? 'पर्णमोड (Leaf Curl) औषध'
          : 'Leaf Curl Virus Chemical Spray',
      icon: Droplets,
      color: 'text-primary-600 dark:text-primary-400',
    },
    {
      label:
        language === 'hi'
          ? 'जीवाणु ब्लाइट दवा एवं PHI अवधि'
          : language === 'mr'
          ? 'जिवाणू करपा औषध व PHI'
          : 'Bacterial Blight Solution & PHI',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label:
        language === 'hi'
          ? 'पत्ती लाल होना (लाल्या) समाधान'
          : language === 'mr'
          ? 'लाल्या रोगावर फवारणी उपाय'
          : 'Physiological Leaf Redding Solution',
      icon: Leaf,
      color: 'text-teal-600 dark:text-teal-400',
    },
    {
      label:
        language === 'hi'
          ? 'गुलाबी सुंडी (Pink Bollworm) नियंत्रण'
          : language === 'mr'
          ? 'गुलाबी बोंडअळी नियंत्रण उपाय'
          : 'Pink Bollworm IPM Strategy',
      icon: Layers,
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      label:
        language === 'hi'
          ? 'सुरक्षित छिड़काव मौसम नियम'
          : language === 'mr'
          ? 'फवारणी हवामान सुरक्षा नियम'
          : 'Safe Spray Weather Conditions',
      icon: CloudSun,
      color: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={a.title}
        description={a.subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-earth-800 p-2 rounded-2xl border border-earth-200 dark:border-earth-700 shadow-xs">
            <span className="text-xs font-bold text-earth-700 dark:text-earth-200 flex items-center gap-1.5 pl-1">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t.common.landAcres}:
            </span>
            <input
              type="number"
              min="0.1"
              max="100"
              step="0.5"
              value={landAcres}
              onChange={(e) => setLandAcres(Math.max(0.1, parseFloat(e.target.value) || 1.0))}
              className="w-16 px-2 py-1.5 text-center font-extrabold text-xs bg-earth-50 dark:bg-earth-900 border border-earth-300 dark:border-earth-700 rounded-lg text-earth-900 dark:text-white min-h-[36px]"
            />
            <div className="flex flex-wrap gap-1">
              {[0.5, 1.0, 2.5, 5.0].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLandAcres(preset)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors font-bold min-h-[36px] cursor-pointer ${
                    landAcres === preset
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-earth-100 dark:bg-earth-700 text-earth-700 dark:text-earth-300 hover:bg-earth-200 dark:hover:bg-earth-600'
                  }`}
                >
                  {preset}A
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assistant Overview & Quick Topics */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-900 via-teal-950 to-earth-950 text-white rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <span>AgriLens Advisor</span>
                      <span className="text-[10px] bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase">
                        {language.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-200/80 font-light">{a.liveBadge}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-emerald-100/90 pt-3 border-t border-white/15">
                <div className="flex items-start gap-2.5">
                  <Mic className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{a.voiceInputHelp}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{a.audioReadoutHelp}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sliders className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{a.dosageScaleHelp}</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                <span>{a.resetChat}</span>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Query Cards */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-earth-700 dark:text-earth-300 uppercase tracking-wider block px-1">
              {a.askTopics}
            </span>
            <div className="grid grid-cols-1 gap-2">
              {commonTopics.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.label)}
                  className="p-3 bg-white dark:bg-earth-800 hover:bg-emerald-50/70 dark:hover:bg-earth-700/60 rounded-2xl border border-earth-200 dark:border-earth-700 text-left transition-all flex items-center justify-between group shadow-xs cursor-pointer"
                >
                  <span className="text-xs font-bold text-earth-900 dark:text-white flex items-center gap-2.5 pr-2 leading-snug">
                    <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                    <span>{item.label}</span>
                  </span>
                  <span className="text-xs text-earth-400 dark:text-earth-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                    &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Main Conversation Studio */}
        <div className="lg:col-span-8">
          <Card className="border-earth-200 dark:border-earth-700 shadow-md h-[620px] flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-earth-850">
            
            {/* Header */}
            <div className="bg-earth-100/60 dark:bg-earth-800/80 backdrop-blur-md px-5 py-3.5 border-b border-earth-200 dark:border-earth-700 flex justify-between items-center z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-extrabold text-xs text-earth-900 dark:text-white uppercase tracking-wider">
                  Live Consultation ({landAcres} {t.common.acres})
                </span>
              </div>

              {/* Global Audio Indicator & Stop Button */}
              {playingMsgId && (
                <button
                  onClick={handleStopSpeech}
                  className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-full animate-pulse flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{a.stopMsg}</span>
                </button>
              )}
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs bg-earth-50/30 dark:bg-earth-900/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 bg-emerald-800 dark:bg-emerald-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[88%] sm:max-w-[82%] space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-4 rounded-2xl leading-relaxed whitespace-pre-line text-xs sm:text-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-none shadow-md font-medium'
                          : 'bg-white dark:bg-earth-800 text-earth-900 dark:text-earth-100 border border-earth-200 dark:border-earth-700 rounded-tl-none shadow-xs font-normal'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Action Bar Below Each Message */}
                    <div className="flex items-center gap-2 text-[11px] text-earth-400 dark:text-earth-500 px-1 pt-0.5 flex-wrap">
                      <span>{msg.timestamp}</span>

                      {msg.sender === 'bot' && (
                        <>
                          <span className="text-earth-300 dark:text-earth-700">•</span>

                          {/* Per-Message Play/Stop Audio Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleSpeak(msg.id, msg.text)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shadow-2xs ${
                              playingMsgId === msg.id
                                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                                : 'bg-emerald-50 dark:bg-earth-700 hover:bg-emerald-100 dark:hover:bg-earth-600 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-earth-600'
                            }`}
                            title={playingMsgId === msg.id ? a.stopMsg : a.speakMsg}
                          >
                            {playingMsgId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>{a.stopMsg}</span>
                                <span className="flex items-center gap-0.5 ml-0.5">
                                  <span className="w-0.5 h-2 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                                  <span className="w-0.5 h-3 bg-white rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s]" />
                                  <span className="w-0.5 h-1.5 bg-white rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.2s]" />
                                </span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>{a.speakMsg}</span>
                              </>
                            )}
                          </button>

                          <span className="text-earth-300 dark:text-earth-700">•</span>

                          {/* Copy Response Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-earth-500 dark:text-earth-400 hover:text-earth-800 dark:hover:text-white hover:bg-earth-100 dark:hover:bg-earth-700 transition-colors cursor-pointer"
                            title={a.copyText}
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{a.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{a.copyText}</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Follow-up Question Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(action)}
                            className="px-3 py-1 bg-emerald-50 dark:bg-earth-800 text-emerald-900 dark:text-emerald-300 rounded-full text-[11px] font-semibold border border-emerald-200 dark:border-earth-700 hover:bg-emerald-100 dark:hover:bg-earth-700 transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-earth-800 dark:bg-earth-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Bot Typing / Thinking Indicator */}
              {isTyping && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 bg-emerald-800 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 bg-white dark:bg-earth-800 rounded-2xl rounded-tl-none border border-earth-200 dark:border-earth-700 shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Controls & Academic Disclaimer */}
            <div className="p-4 bg-white dark:bg-earth-900 border-t border-earth-200 dark:border-earth-800 space-y-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2.5"
              >
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`p-3 rounded-2xl transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse shadow-md'
                      : 'bg-emerald-50 dark:bg-earth-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-earth-700 border border-emerald-200 dark:border-earth-700'
                  }`}
                  title={isListening ? 'Stop listening' : t.common.voiceInput}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>

                {/* Text Query Input */}
                <input
                  type="text"
                  placeholder={isListening ? t.common.listening : t.common.typeOrSpeak}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-earth-50/70 dark:bg-earth-800 text-earth-900 dark:text-white border border-earth-300 dark:border-earth-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.common.send}</span>
                </Button>
              </form>

              {/* General Disclaimer */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-earth-500 dark:text-earth-400 text-center font-light pt-0.5">
                <Info className="w-3 h-3 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{a.disclaimer}</span>
              </div>
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
}
