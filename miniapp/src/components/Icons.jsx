/**
 * Yengil chiziqli ikonkalar to'plami.
 * Emoji o'rniga SVG — ekran zichligidan qat'i nazar toza va bir xil ko'rinadi.
 */
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconMenu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);

export const IconDish = (p) => (
  <svg {...base} {...p}>
    <path d="M3 11h18" />
    <path d="M12 4a8 8 0 0 1 8 7H4a8 8 0 0 1 8-7Z" />
    <path d="M5 15h14a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z" />
  </svg>
);

export const IconReceipt = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3h12v18l-3-1.6-3 1.6-3-1.6L6 21V3Z" />
    <path d="M9.5 8h5M9.5 12h5" />
  </svg>
);

export const IconBag = (p) => (
  <svg {...base} {...p}>
    <path d="M5.5 8h13l-1 12.5H6.5L5.5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const IconSpark = (p) => (
  <svg {...base} {...p}>
    <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
  </svg>
);

export const IconFlame = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.6.7-3 1.6-4.1.4 1 1.1 1.8 1.9 2.1.3-2.9 1-5.3 1.5-7Z" />
  </svg>
);

export const IconUser = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const IconSearch = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const IconPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconChevron = (p) => (
  <svg {...base} {...p}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const IconBack = (p) => (
  <svg {...base} {...p}>
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const IconClose = (p) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const IconTicket = (p) => (
  <svg {...base} {...p}>
    <path d="M3 8.5A2 2 0 0 1 5 6.5h14a2 2 0 0 1 2 2V10a2 2 0 0 0 0 4v1.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V14a2 2 0 0 0 0-4V8.5Z" />
    <path d="M14 7v2M14 11.5v1M14 15v2" strokeDasharray="0.1 3" />
  </svg>
);

export const IconCopy = (p) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-6A3.5 3.5 0 0 0 3 6.5v6A2.5 2.5 0 0 0 5.5 15" />
  </svg>
);

export const IconCheck = (p) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const IconWallet = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="3" />
    <path d="M3 10h18" />
    <circle cx="16.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconScooter = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="17.5" r="2.6" />
    <circle cx="18" cy="17.5" r="2.6" />
    <path d="M8.6 17.5h6.8M4 8h4l3.6 9.5M14 7h3l1.6 10.5" />
  </svg>
);

export const IconStore = (p) => (
  <svg {...base} {...p}>
    <path d="M4 10v9h16v-9" />
    <path d="M3 5.5h18L20 10H4L3 5.5Z" />
    <path d="M10 19v-4.5h4V19" />
  </svg>
);

export const IconPhone = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5Z" />
  </svg>
);

export const IconInfo = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5M12 7.8v.4" />
  </svg>
);

export default {
  IconMenu,
  IconFlame,
  IconDish,
  IconReceipt,
  IconBag,
  IconSpark,
  IconUser,
  IconSearch,
  IconPin,
  IconChevron,
  IconBack,
  IconPlus,
  IconMinus,
  IconClose,
  IconClock,
  IconTicket,
  IconCopy,
  IconCheck,
  IconWallet,
  IconScooter,
  IconStore,
  IconPhone,
  IconInfo,
};
