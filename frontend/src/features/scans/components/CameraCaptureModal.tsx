import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../../components/ui/Button';
import {
  Camera,
  X,
  RefreshCw,
  AlertCircle,
  Upload,
  Focus,
  Sparkles
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function CameraCaptureModal({ isOpen, onClose, onCapture }: CameraCaptureModalProps) {
  const { t } = useLanguage();
  const d = t.detect;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Stop current active media stream tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Check if multiple camera devices are present (front + rear)
  const checkMultipleCameras = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }
    } catch {
      setHasMultipleCameras(false);
    }
  }, []);

  // Start live camera stream
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setIsLoading(true);
    setCameraError(null);
    stopStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsLoading(false);
      checkMultipleCameras();
    } catch (err: any) {
      console.warn('Camera stream failed with ideal constraint, trying fallback:', err);
      // Fallback try with simple video: true
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play();
        }
        setIsLoading(false);
        checkMultipleCameras();
      } catch (finalErr: any) {
        console.error('Camera access permanently failed:', finalErr);
        setIsLoading(false);
        setCameraError(d.cameraUnavailable || 'Camera access was denied or not supported.');
      }
    }
  }, [stopStream, checkMultipleCameras, d.cameraUnavailable]);

  // Handle open / close lifecycle
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, startCamera, stopStream]);

  // Switch facing mode (Front / Back)
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Capture video frame snapshot
  const handleCapture = () => {
    if (!videoRef.current || isFlashing) return;

    const video = videoRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror image for natural selfie orientation
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    // Trigger visual shutter flash
    setIsFlashing(true);

    canvas.toBlob(
      (blob) => {
        setTimeout(() => {
          setIsFlashing(false);
          if (blob) {
            const file = new File([blob], `cotton_leaf_scan_${Date.now()}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            stopStream();
            onCapture(file);
            onClose();
          }
        }, 150);
      },
      'image/jpeg',
      0.95
    );
  };

  // Mobile OS Native Camera fallback picker handler
  const handleFallbackFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopStream();
      onCapture(file);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Visual Shutter Flash Effect */}
      {isFlashing && <div className="fixed inset-0 z-60 bg-white pointer-events-none transition-opacity duration-150" />}

      <div className="relative w-full max-w-2xl bg-earth-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-earth-800 flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 bg-earth-900/90 backdrop-blur-md border-b border-earth-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{d.openCamera}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                  LIVE
                </span>
              </h3>
              <p className="text-[11px] text-earth-400">{d.cameraGuide}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasMultipleCameras && !cameraError && (
              <button
                onClick={toggleFacingMode}
                disabled={isLoading}
                title={d.switchCamera}
                className="p-2 rounded-xl bg-earth-800 hover:bg-earth-700 text-earth-200 hover:text-white transition-colors border border-earth-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-earth-800 hover:bg-earth-700 text-earth-300 hover:text-white transition-colors border border-earth-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Camera Viewfinder Area */}
        <div className="relative flex-1 bg-black min-h-[320px] sm:min-h-[420px] flex items-center justify-center overflow-hidden select-none">
          {isLoading && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-earth-950 z-20">
              <div className="w-12 h-12 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
              <p className="text-xs font-semibold text-emerald-400 tracking-wide">Starting Camera Viewfinder...</p>
            </div>
          )}

          {cameraError ? (
            <div className="p-6 text-center space-y-4 max-w-md z-20">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Camera Access Notice</h4>
                <p className="text-xs text-earth-400 leading-relaxed">{cameraError}</p>
              </div>

              {/* Native Mobile Camera fallback input */}
              <input
                ref={fallbackInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFallbackFile}
              />
              <Button
                onClick={() => fallbackInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{d.useFileFallback}</span>
              </Button>
            </div>
          ) : (
            <>
              {/* Live Video Feed */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover max-h-[550px] ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* HUD Holographic Targeting Reticle Overlay */}
              <div className="absolute inset-6 sm:inset-10 pointer-events-none z-10 flex flex-col items-center justify-center">
                {/* Targeting Frame Box */}
                <div className="relative w-full h-full max-w-sm max-h-72 border-2 border-emerald-400/40 rounded-3xl overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                  
                  {/* Glowing Corner Brackets */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />

                  {/* Leaf Focus Guide Silhouette */}
                  <div className="opacity-30 text-emerald-300 flex flex-col items-center gap-2 animate-pulse">
                    <Focus className="w-12 h-12" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Leaf Scan Zone</span>
                  </div>

                  {/* Subtle animated scanline */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-[pulse_2s_infinite] opacity-60" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Shutter & Controls Bar */}
        <div className="p-4 sm:p-5 bg-earth-900/95 backdrop-blur-md border-t border-earth-800 flex items-center justify-between z-20">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-earth-400 hover:text-white px-3 py-2 rounded-lg hover:bg-earth-800 transition-colors"
          >
            {t.common.clear || 'Cancel'}
          </button>

          {/* Big Tactile Shutter Button */}
          {!cameraError && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCapture}
                disabled={isLoading}
                aria-label={d.capturePhoto}
                className="group relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-emerald-500 hover:bg-emerald-400 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <div className="w-full h-full rounded-full border-2 border-white/80 flex items-center justify-center bg-emerald-600 group-hover:bg-emerald-500 transition-colors">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                {/* Pulsing ring on hover */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-0 group-hover:opacity-40 pointer-events-none" />
              </button>
            </div>
          )}

          {/* Right helper info */}
          <div className="text-right">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
              <Sparkles className="w-3 h-3" />
              Auto High-Res
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
