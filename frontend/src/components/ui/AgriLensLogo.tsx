interface AgriLensLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export function AgriLensLogo({
  className = '',
  size = 'md',
  showText = true,
  textClassName = ''
}: AgriLensLogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Camera Lens + Leaf Vector Emblem */}
      <svg
        className={`${iconSizes[size]} flex-shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Emerald-Teal Lens Gradient */}
          <linearGradient id="agl-lens-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          {/* Leaf Glow Gradient */}
          <linearGradient id="agl-leaf-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>

          {/* Lens Ring Accent */}
          <linearGradient id="agl-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>

        {/* Outer Focus Aperture Ring */}
        <circle cx="50" cy="50" r="44" stroke="url(#agl-lens-grad)" strokeWidth="7" fill="none" opacity="0.95" />
        
        {/* Optical Lens Tick Marks */}
        <circle cx="50" cy="50" r="37" stroke="url(#agl-ring-grad)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.8" />

        {/* Core Lens Dark Backdrop */}
        <circle cx="50" cy="50" r="32" fill="#062e19" opacity="0.9" />

        {/* Leaf Sprout Vector Inside Optics */}
        <path
          d="M50 20 C68 28 72 50 54 68 C44 78 30 76 26 66 C22 54 32 30 50 20 Z"
          fill="url(#agl-leaf-grad)"
        />
        
        {/* Secondary Leaf Leaflet */}
        <path
          d="M50 48 C36 40 28 48 30 58 C32 64 42 66 50 48 Z"
          fill="#4ade80"
          opacity="0.9"
        />

        {/* Central Leaf Vein & Focus Reticle */}
        <path
          d="M50 24 Q48 50 36 64"
          stroke="#052e16"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* AI Scanner Center Dot */}
        <circle cx="50" cy="36" r="3" fill="#ffffff" opacity="0.9" />
      </svg>

      {/* Brand Wordmark */}
      {showText && (
        <span className={`font-black tracking-tight font-heading ${textSizes[size]} ${textClassName}`}>
          <span className="text-emerald-600 dark:text-emerald-400">Agri</span>
          <span className="text-earth-900 dark:text-white">Lens</span>
        </span>
      )}
    </div>
  );
}
