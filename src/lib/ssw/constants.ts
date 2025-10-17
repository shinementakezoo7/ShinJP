export const SSW_CONSTANTS = {
  // Animation durations and delays
  ANIMATION: {
    DURATION: {
      FAST: 0.2,
      DEFAULT: 0.3,
      SLOW: 0.5,
      VERY_SLOW: 0.8,
    },
    DELAY: {
      BASE: 0.1,
      STAGGER: 0.1,
      NAVIGATION: 0.5,
    },
  },

  // Form validation
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 100,
    },
    CHAPTERS: {
      MIN: 3,
      MAX: 20,
      DEFAULT: 10,
    },
  },

  // Breakpoints for responsive design
  BREAKPOINTS: {
    MOBILE: '640px',
    TABLET: '768px',
    DESKTOP: '1024px',
    LARGE: '1280px',
  },

  // Grid configurations
  GRID: {
    SECTORS: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 3,
      LARGE: 4,
    },
    PROGRAMS: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 3,
    },
    FEATURES: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 4,
    },
  },

  // Touch target sizes
  TOUCH_TARGETS: {
    MIN_SIZE: 48, // 48px minimum touch target size
    BUTTON_PADDING: 12,
  },

  // Loading states
  LOADING: {
    ESTIMATED_TIME_PER_CHAPTER: {
      MIN: 1,
      MAX: 2,
    },
  },

  // Color palette standardization
  COLORS: {
    PRIMARY: {
      BLUE: 'from-blue-500 to-cyan-600',
      PURPLE: 'from-purple-500 to-indigo-600',
      GREEN: 'from-green-500 to-emerald-600',
      PINK: 'from-pink-500 to-rose-600',
      GRAY: 'from-gray-500 to-slate-600',
      ORANGE: 'from-orange-500 to-amber-600',
      YELLOW: 'from-yellow-500 to-orange-600',
      STONE: 'from-stone-500 to-zinc-600',
      CYAN: 'from-cyan-500 to-blue-600',
      RED: 'from-red-500 to-orange-600',
      SKY: 'from-sky-500 to-indigo-600',
      TEAL: 'from-teal-500 to-cyan-600',
      AMBER: 'from-amber-500 to-orange-600',
      ROSE: 'from-rose-500 to-pink-600',
    },
    STATUS: {
      SUCCESS: 'from-green-500 to-emerald-600',
      ERROR: 'from-red-500 to-orange-600',
      WARNING: 'from-amber-500 to-orange-600',
      INFO: 'from-blue-500 to-cyan-600',
    },
  },

  // Typography
  TYPOGRAPHY: {
    HEADINGS: {
      H1: 'text-4xl md:text-5xl',
      H2: 'text-3xl md:text-4xl',
      H3: 'text-2xl md:text-3xl',
      H4: 'text-xl md:text-2xl',
    },
    TEXT: {
      LARGE: 'text-lg',
      BASE: 'text-base',
      SMALL: 'text-sm',
      XS: 'text-xs',
    },
    WEIGHTS: {
      LIGHT: 'font-light',
      NORMAL: 'font-normal',
      MEDIUM: 'font-medium',
      SEMI_BOLD: 'font-semibold',
      BOLD: 'font-bold',
      BLACK: 'font-black',
    },
  },

  // Spacing system
  SPACING: {
    XS: '0.25rem', // 4px
    SM: '0.5rem', // 8px
    BASE: '1rem', // 16px
    LG: '1.5rem', // 24px
    XL: '2rem', // 32px
    '2XL': '3rem', // 48px
    '3XL': '4rem', // 64px
  },

  // Z-index values
  Z_INDEX: {
    BASE: 0,
    CARD: 10,
    OVERLAY: 20,
    MODAL: 50,
    TOOLTIP: 60,
    NAVBAR: 100,
  },
} as const
