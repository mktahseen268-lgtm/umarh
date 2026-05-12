import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function KaabaIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <rect x="4" y="8" width="16" height="13" rx="1" stroke="currentColor" />
      <path d="M4 8 L12 3 L20 8" stroke="currentColor" />
      <rect x="9" y="13" width="6" height="8" stroke="currentColor" />
      <path d="M4 11 Q12 13 20 11" stroke="currentColor" strokeDasharray="2 2" />
    </svg>
  );
}

export function MosqueIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <path d="M12 2C9 2 7 5 7 7v1H3v12h18V8h-4V7c0-2-2-5-5-5z" stroke="currentColor" />
      <path d="M10 13 Q12 11 14 13" stroke="currentColor" />
      <line x1="12" y1="2" x2="12" y2="1" stroke="currentColor" />
      <circle cx="12" cy="0.5" r="0.5" fill="currentColor" />
      <path d="M7 8 Q12 6 17 8" stroke="currentColor" />
    </svg>
  );
}

export function CrescentIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
}

export function PrayerMatIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" />
      <path d="M3 10 Q12 8 21 10" stroke="currentColor" />
      <path d="M3 16 Q12 18 21 16" stroke="currentColor" />
      <path d="M12 10 L12 16" stroke="currentColor" strokeDasharray="1 2" />
      <path d="M9 13 Q12 11 15 13" stroke="currentColor" />
    </svg>
  );
}

export function ZamzamIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <path d="M9 3h6l1 4H8L9 3z" stroke="currentColor" />
      <path d="M8 7v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" stroke="currentColor" />
      <path d="M10 12 Q12 14 14 12" stroke="currentColor" />
    </svg>
  );
}

export function IhramIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <path d="M12 3 C10 3 9 5 9 7 L7 20 H17 L15 7 C15 5 14 3 12 3Z" stroke="currentColor" />
      <path d="M9 9 Q12 11 15 9" stroke="currentColor" />
    </svg>
  );
}

export function TasbihIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <circle cx="12" cy="5" r="2" stroke="currentColor" />
      <path d="M12 7 Q18 10 18 14 Q18 19 12 20 Q6 19 6 14 Q6 10 12 7" stroke="currentColor" />
      <circle cx="18" cy="14" r="1.5" stroke="currentColor" />
      <circle cx="6"  cy="14" r="1.5" stroke="currentColor" />
      <circle cx="12" cy="20" r="1.5" stroke="currentColor" />
    </svg>
  );
}

export function DuaHandsIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <path d="M6 14 L6 8 M8 14 L8 6 M10 14 L10 7 M12 14 L12 8" stroke="currentColor" />
      <path d="M18 14 L18 8 M16 14 L16 6 M14 14 L14 7" stroke="currentColor" />
      <path d="M4 14 Q12 17 20 14" stroke="currentColor" />
    </svg>
  );
}

export function AirplaneIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <path
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function AirplaneTakeoffIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <path
        d="M2.5 19h19v2h-19zm7.18-1.73l4.35 1.16 5.31-1.42c.8-.21 1.29-1.03 1.08-1.83-.21-.8-1.03-1.29-1.83-1.08l-3.22.86L12.46 8H9.93L8.1 13.81 5.15 13l-.93-2.74-1.93.52 1.28 4.36 5.11 2.13z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function AirplaneLandingIcon({ size, className, ...rest }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} {...rest}>
      <path
        d="M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77.33 13.7-3.66c.81-.22 1.28-1.05 1.07-1.86z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
