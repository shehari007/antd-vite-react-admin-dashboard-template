import { useCallback, useEffect, useMemo, useState } from 'react';
import { App as AntApp, ConfigProvider, theme as antdTheme } from 'antd';
import { useTranslation } from 'react-i18next';
import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';
import arEG from 'antd/locale/ar_EG';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/ar';
import { getLanguageMeta } from '@/i18n';
import {
  DEFAULT_THEME,
  FONT_FAMILY,
  SIDER_BG,
  SIDER_BG_ELEVATED,
  ThemeModeContext,
  hexToRgba,
} from './theme-mode-context';

const MODE_KEY = 'dashboard-theme-mode';
const TOKENS_KEY = 'dashboard-theme-tokens';

const ANTD_LOCALES = { en: enUS, es: esES, ar: arEG };

const getSystemPreference = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getInitialMode = () => {
  try {
    const stored = localStorage.getItem(MODE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* private browsing, fall through to the OS preference */
  }
  return getSystemPreference();
};

const getInitialTokens = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(TOKENS_KEY) || 'null');
    if (stored && typeof stored === 'object') return { ...DEFAULT_THEME, ...stored };
  } catch {
    /* corrupt or unavailable, fall back to the defaults */
  }
  return DEFAULT_THEME;
};

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export const ThemeModeProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [mode, setMode] = useState(getInitialMode);
  const [tokens, setTokens] = useState(getInitialTokens);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  const language = i18n.resolvedLanguage || i18n.language || 'en';
  const direction = getLanguageMeta(language).dir;
  const { primaryColor, borderRadius, compact } = tokens;

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* the choice just will not survive a reload */
    }
    // Drives the app level scrollbar colours in index.css. The dashboard's dark
    // mode is explicit state, so it cannot be keyed off prefers-color-scheme.
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    } catch {
      /* same as above */
    }
    // The rail is painted from CSS custom properties rather than antd tokens,
    // so the accent bar and focus ring have to be told about a colour change.
    document.documentElement.style.setProperty('--rail-accent', tokens.primaryColor);
    document.documentElement.style.setProperty(
      '--rail-selected-bg',
      hexToRgba(tokens.primaryColor, 0.16)
    );
  }, [tokens]);

  // <html lang> and <html dir> are what make right to left work outside React:
  // the CSS logical properties in index.css, text selection, and screen reader
  // pronunciation all read them.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    dayjs.locale(language === 'en' ? 'en' : language);
  }, [language, direction]);

  // CSS alone cannot stop antd's JS driven rc-motion animations (drawer slide,
  // submenu expand). The `motion` seed token is what disables those.
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const updateTokens = useCallback((patch) => {
    setTokens((previous) => ({ ...previous, ...patch }));
  }, []);

  const contextValue = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      setMode,
      toggleMode: () => setMode((previous) => (previous === 'dark' ? 'light' : 'dark')),
      primaryColor,
      borderRadius,
      compact,
      direction,
      language,
      setPrimaryColor: (color) => updateTokens({ primaryColor: color }),
      setBorderRadius: (radius) => updateTokens({ borderRadius: radius }),
      setCompact: (value) => updateTokens({ compact: value }),
      setLanguage: (code) => i18n.changeLanguage(code),
      resetTheme: () => setTokens(DEFAULT_THEME),
    }),
    [mode, primaryColor, borderRadius, compact, direction, language, updateTokens, i18n]
  );

  const algorithm = useMemo(() => {
    const base = mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;
    return compact ? [base, antdTheme.compactAlgorithm] : base;
  }, [mode, compact]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ConfigProvider
        direction={direction}
        locale={ANTD_LOCALES[language] || enUS}
        card={{ variant: 'borderless' }}
        theme={{
          algorithm,
          token: {
            colorPrimary: primaryColor,
            borderRadius,
            fontFamily: FONT_FAMILY,
            motion: !reducedMotion,
            boxShadowTertiary:
              mode === 'dark'
                ? '0 2px 4px 0 rgba(0, 0, 0, 0.28), 0 4px 12px 0 rgba(0, 0, 0, 0.24)'
                : '0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 4px 12px 0 rgba(0, 0, 0, 0.06)',
          },
          components: {
            Layout: {
              headerPadding: '0 16px',
              headerHeight: 64,
              siderBg: SIDER_BG,
              // No triggerBg: <Sider trigger={null}> never renders a trigger
              // element, so the token had nothing to paint.
            },
            Menu: {
              /* -- Geometry. These four produce an icon centre of 40px in both
                 states, see the identity in theme-mode-context.js. The fifth
                 primitive is the Menu prop inlineIndent={24}. -------------- */
              itemMarginInline: 8,
              iconSize: 16,
              // Must stay >= iconSize: the collapsed rule only overrides the
              // icon's font-size, not its min-width, so a larger iconSize would
              // widen the glyph box past what the centring calc() assumes.
              collapsedIconSize: 16,
              itemHeight: 36,
              itemMarginBlock: 2,
              // Leave at 0. Any non-zero value flips antd's internal itemWidth
              // token to calc(100% + 1px), the item outgrows the rail, and the
              // collapsed centring breaks. The active bar is a ::before instead.
              activeBarWidth: 0,

              /* -- Spacing ---------------------------------------------------- */
              itemPaddingInline: 16,
              // 8 rather than antd's 10 so a parent label lands at x=56, exactly
              // where an icon-less child label lands (8 + 2*24). Keeps the two
              // text columns on one axis without overriding rc-menu.
              iconMarginInlineEnd: 8,
              itemBorderRadius: 8,
              subMenuItemBorderRadius: 6,
              dropdownWidth: 216,

              /* -- Dark rail. Stays dark in both app themes. ------------------ */
              darkItemBg: SIDER_BG, // must equal Layout.siderBg or a seam shows
              darkPopupBg: SIDER_BG_ELEVATED, // separate token from darkItemBg
              darkSubMenuItemBg: 'transparent',
              darkItemColor: 'rgba(255, 255, 255, 0.72)',
              darkItemHoverColor: '#ffffff',
              darkItemHoverBg: 'rgba(255, 255, 255, 0.06)',
              darkItemSelectedColor: '#ffffff',
              // Tinted rather than solid: on a solid pill a pastel glyph
              // measured 1.8:1. At 16% over #101B34 the dimmest accent still
              // clears 7:1 and white text clears 14:1.
              darkItemSelectedBg: hexToRgba(primaryColor, 0.16),
              darkGroupTitleColor: 'rgba(255, 255, 255, 0.48)',
              darkItemDisabledColor: 'rgba(255, 255, 255, 0.28)',
            },
            Card: {
              headerFontSize: 16,
            },
          },
        }}
      >
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
};
