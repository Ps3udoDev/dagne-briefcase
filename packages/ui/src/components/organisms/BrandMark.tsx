import { cn } from '../../lib/cn';

export interface BrandMarkProps {
  size?: number;
  showWordmark?: boolean;
  subtitle?: string;
  idPrefix?: string;
  className?: string;
}

export function BrandMark({
  size = 36,
  showWordmark = true,
  subtitle = 'Psicología Clínica',
  idPrefix = 'psicoiris-mark',
  className,
}: BrandMarkProps) {
  const bgGradId = `${idPrefix}-bg`;
  const archGradId = `${idPrefix}-arch`;

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        role="img"
        aria-label="Psicoiris Isotipo"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id={bgGradId}
            x1="64"
            y1="48"
            x2="448"
            y2="464"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F4E6E5" />
            <stop offset="100%" stopColor="#E8D3EC" />
          </linearGradient>
          <linearGradient
            id={archGradId}
            x1="156"
            y1="120"
            x2="356"
            y2="380"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#9F73AB" />
            <stop offset="100%" stopColor="#D4B2D8" />
          </linearGradient>
        </defs>
        <rect
          x="24"
          y="24"
          width="464"
          height="464"
          rx="128"
          fill={`url(#${bgGradId})`}
          stroke="#D4B2D8"
          strokeWidth="8"
        />
        <circle
          cx="256"
          cy="256"
          r="144"
          fill="#FFFFFF"
          fillOpacity="0.72"
          stroke="#E8D3EC"
          strokeWidth="6"
        />
        <path
          d="M148 318C148 216 196 152 256 152C316 152 364 216 364 318"
          stroke="#D4B2D8"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M184 326C184 244 216 192 256 192C296 192 328 244 328 326"
          stroke={`url(#${archGradId})`}
          strokeWidth="18"
          strokeLinecap="round"
        />
        <circle cx="256" cy="264" r="36" fill="#9F73AB" />
        <circle cx="256" cy="264" r="14" fill="#FFFFFF" />
        <path
          d="M168 344H344"
          stroke="#9F73AB"
          strokeWidth="12"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />
      </svg>

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-xl font-medium tracking-tight text-plum-ink">
            Psicoiris
          </span>
          {subtitle && (
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
