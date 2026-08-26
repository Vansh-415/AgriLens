import { useState, useRef, useEffect, useCallback } from 'react';
import { generateAgronomistResponse, cleanTextForSpeech, getBestVoiceForLanguage } from '../services/agriChatService';
import type { ChatMessage } from '../services/agriChatService';
import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  RotateCcw,
  Sliders,
  Copy,
  Check,
  Info
} from 'lucide-react';

export function AgriChatbotWidget() {
  const { language, t } = useLanguage();
  const a = t.assistant;

  const [isOpen, setIsOpen] = useState(false);
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
        id: 'widget-init',
        sender: 'bot',
        text: initial.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: initial.suggestedActions,
      },
    ];
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

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

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingMsgId(null);
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Voice Playback Not Supported', 'Your browser does not support Web Speech Synthesis.');
      return;
    }

    if (playingMsgId === msgId) {
      handleStopSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    const { voice, langCode } = getBestVoiceForLanguage(language);
    utterance.lang = langCode;
    if (voice) {
      utterance.voice = voice;
    }

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

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch {
      toast.error('Copy Failed', 'Could not copy message.');
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
          `Speak in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.`
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
          toast.error('Voice Recognition Error', event.error || 'Could not process audio.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      toast.error('Voice Error', 'Could not access microphone.');
    }
  };

  const handleSend = (textToSend?: string, wasVoice: boolean = false) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    handleStopSpeech();

    const userMsg: ChatMessage = {
      id: `widget-user-${Date.now()}`,
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
        id: `widget-bot-${Date.now()}`,
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
    }, 400);
  };

  const handleResetChat = () => {
    handleStopSpeech();
    const g = getInitialGreeting();
    setMessages([
      {
        id: `widget-init-${Date.now()}`,
        sender: 'bot',
        text: g.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: g.actions,
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))', right: 'calc(1rem + env(safe-area-inset-right, 0px))' }}
          className="fixed z-40 p-3 sm:p-3.5 min-w-[48px] min-h-[48px] bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group border-2 border-white/20 cursor-pointer"
          aria-label="Open AI Agronomist Chatbot"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-extrabold pr-1 hidden sm:inline">{t.nav.assistant}</span>
        </button>
      )}

      {/* Floating Chatbot Dialog */}
      {isOpen && (
        <div
          style={{ bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
          className="fixed inset-x-2 sm:inset-auto sm:right-6 z-50 w-auto sm:w-[420px] max-w-[calc(100vw-16px)] sm:max-w-md bg-white dark:bg-earth-900 rounded-3xl shadow-2xl border border-earth-200 dark:border-earth-700 flex flex-col h-[85vh] sm:h-[580px] max-h-[640px] overflow-hidden font-sans transition-all"
        >
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-earth-950 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>AgriLens {t.nav.assistant}</span>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold uppercase">
                    {language.toUpperCase()}
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-200/90 font-light">
                  {a.liveBadge}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {playingMsgId && (
                <button
                  onClick={handleStopSpeech}
                  className="px-2 py-1 text-xs text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors animate-pulse flex items-center gap-1 font-bold cursor-pointer"
                  title={a.stopMsg}
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{a.stopMsg}</span>
                </button>
              )}
              <button
                onClick={handleResetChat}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title={a.resetChat}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  handleStopSpeech();
                  setIsOpen(false);
                }}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Acreage Context Selector */}
          <div className="px-4 py-2 bg-earth-50 dark:bg-earth-850 border-b border-earth-200 dark:border-earth-800 flex items-center justify-between text-xs">
            <span className="text-earth-700 dark:text-earth-300 font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {t.common.landAcres}:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0.1"
                max="50"
                step="0.5"
                value={landAcres}
                onChange={(e) => setLandAcres(Math.max(0.1, parseFloat(e.target.value) || 1.0))}
                className="w-12 px-1.5 py-0.5 text-center text-xs font-bold bg-white dark:bg-earth-800 border border-earth-300 dark:border-earth-700 rounded text-earth-900 dark:text-white"
              />
              <span className="text-earth-600 dark:text-earth-400 text-[11px] font-semibold">{t.common.acres}</span>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-earth-50/40 dark:bg-earth-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 bg-emerald-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line text-xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-none shadow-xs font-medium'
                        : 'bg-white dark:bg-earth-800 text-earth-900 dark:text-earth-100 border border-earth-200 dark:border-earth-700 rounded-tl-none shadow-xs font-normal'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Actions & Timestamps */}
                  <div className="flex items-center gap-2 text-[10px] text-earth-400 dark:text-earth-500 px-1 pt-0.5 flex-wrap">
                    <span>{msg.timestamp}</span>

                    {msg.sender === 'bot' && (
                      <>
                        <span className="text-earth-300 dark:text-earth-700">•</span>
                        
                        {/* Interactive Listen/Stop Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.id, msg.text)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                            playingMsgId === msg.id
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-emerald-50 dark:bg-earth-700 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-earth-600'
                          }`}
                          title={playingMsgId === msg.id ? a.stopMsg : a.speakMsg}
                        >
                          {playingMsgId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3" />
                              <span>{a.stopMsg}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{a.speakMsg}</span>
                            </>
                          )}
                        </button>

                        <span className="text-earth-300 dark:text-earth-700">•</span>

                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="inline-flex items-center gap-1 text-earth-400 hover:text-earth-700 dark:hover:text-white transition-colors cursor-pointer"
                          title={a.copyText}
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(action)}
                          className="px-2.5 py-0.5 bg-emerald-50 dark:bg-earth-800 text-emerald-900 dark:text-emerald-300 rounded-full text-[10px] font-semibold border border-emerald-200 dark:border-earth-700 hover:bg-emerald-100 dark:hover:bg-earth-700 transition-colors cursor-pointer"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 bg-earth-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-7 h-7 bg-emerald-800 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-2.5 bg-white dark:bg-earth-800 rounded-2xl rounded-tl-none border border-earth-200 dark:border-earth-700 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Controls */}
          <div className="p-3 bg-white dark:bg-earth-900 border-t border-earth-200 dark:border-earth-800 space-y-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                    : 'bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 hover:bg-earth-200 dark:hover:bg-earth-700'
                }`}
                title={isListening ? 'Stop listening' : t.common.voiceInput}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>

              <input
                type="text"
                placeholder={isListening ? t.common.listening : t.common.typeOrSpeak}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-earth-50 dark:bg-earth-800 text-earth-900 dark:text-white border border-earth-300 dark:border-earth-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />

              <Button
                type="submit"
                disabled={!input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl font-bold text-xs flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>

            <div className="flex items-center justify-center gap-1 text-[9px] text-earth-500 dark:text-earth-400 text-center font-light">
              <Info className="w-2.5 h-2.5 text-emerald-600" />
              <span>Educational agronomic advisory reference</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
