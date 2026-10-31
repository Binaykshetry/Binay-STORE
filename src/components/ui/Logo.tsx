import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Authentic SVG Shopping Bag with Himalayan Mountain Peaks inside */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shopping bag handles */}
          <path
            d="M36 28 C36 14, 64 14, 64 28"
            stroke="#C8102E"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Main shopping bag body */}
          <rect
            x="12"
            y="26"
            width="76"
            height="66"
            rx="12"
            fill="url(#nepalGrad)"
          />
          {/* Himalayan mountain peaks inside the bag */}
          {/* Back peak (Everest / Lhotse) */}
          <polygon
            points="50,42 66,74 34,74"
            fill="#F5B301"
            opacity="0.9"
          />
          {/* Front peak (Ama Dablam) with snow crest */}
          <polygon
            points="38,48 54,78 22,78"
            fill="#FFFFFF"
          />
          {/* Second foreground peak */}
          <polygon
            points="62,52 76,78 48,78"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/* Sun / Moon celestial symbol */}
          <circle cx="50" cy="37" r="4.5" fill="#FFFFFF" />

          {/* Gradients */}
          <defs>
            <linearGradient id="nepalGrad" x1="12" y1="26" x2="88" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C8102E" />
              <stop offset="1" stopColor="#003893" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className={`font-extrabold tracking-tight flex items-baseline ${textSizes[size]}`}>
          <span className="text-primary-600">Nepalese</span>
          <span className="text-secondary-600">Store</span>
          <span className="text-gold-500 text-xs ml-1 font-bold">.np</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-gray-500 font-medium tracking-wider mt-0.5">
            नेपालको विश्वसनीय बजार
          </span>
        )}
      </div>
    </div>
  );
};
