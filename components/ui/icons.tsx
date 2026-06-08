import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...props,
});

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const Check = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Plus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Minus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const Menu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Globe = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </svg>
);

export const Quote = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 0, fill: "currentColor" })}>
    <path d="M9.5 6C6.5 7.3 5 9.8 5 13.5V18h5v-5H7.6c0-2.2 1-3.7 2.9-4.6L9.5 6Zm9 0c-3 1.3-4.5 3.8-4.5 7.5V18h5v-5h-2.4c0-2.2 1-3.7 2.9-4.6L18.5 6Z" />
  </svg>
);

export const Asterisk = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v16M5 7l14 10M19 7 5 17" />
  </svg>
);

export const Target = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </svg>
);

export const Practice = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 18V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11" />
    <path d="M3 18h18M9 9l2 2-2 2M13 13h3" />
  </svg>
);

export const Results = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

export const Clock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const Compass = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </svg>
);

export const Spark = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3c.6 4.5 1.5 5.4 6 6-4.5.6-5.4 1.5-6 6-.6-4.5-1.5-5.4-6-6 4.5-.6 5.4-1.5 6-6Z" />
  </svg>
);

export const Play = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 0, fill: "currentColor" })}>
    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
  </svg>
);

export const Star = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 0, fill: "currentColor" })}>
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 2.5Z" />
  </svg>
);

export const WhatsApp = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 0, fill: "currentColor" })}>
    <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.9 9.9 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.8 9.8 0 0 0 12.04 2Zm0 1.8c2.16 0 4.18.84 5.71 2.37a8.03 8.03 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.06.8.82-2.98-.2-.31a8.05 8.05 0 0 1-1.24-4.3c0-4.46 3.63-8.08 8.1-8.08Zm-2.6 3.9c-.2 0-.5.07-.77.36-.27.29-1.02 1-1.02 2.43 0 1.44 1.05 2.83 1.2 3.02.14.2 2.04 3.1 4.95 4.35.69.3 1.23.48 1.65.6.7.23 1.33.2 1.83.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34-.29-.14-1.72-.85-1.99-.94-.27-.1-.46-.14-.66.15-.2.29-.76.94-.93 1.13-.17.2-.34.22-.63.08-.29-.15-1.23-.46-2.34-1.45-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.15-.17.2-.29.29-.48.1-.2.05-.37-.02-.51-.07-.15-.65-1.58-.9-2.16-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01Z" />
  </svg>
);

export const Telegram = (p: IconProps) => (
  <svg {...base({ ...p, strokeWidth: 0, fill: "currentColor" })}>
    <path d="M21.94 4.6 18.6 20.3c-.25 1.1-.9 1.38-1.83.86l-5.04-3.72-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.13 9.34-8.44c.4-.36-.09-.56-.63-.2L4.93 13.1l-4.97-1.56c-1.08-.34-1.1-1.08.23-1.6L20.54 2.4c.9-.34 1.69.2 1.4 2.2Z" />
  </svg>
);

export const Sun = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const Moon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);
