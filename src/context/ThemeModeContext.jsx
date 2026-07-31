import { useEffect, useMemo, useState } from 'react';
import { App as AntApp, ConfigProvider, theme as antdTheme } from 'antd';
import {
  FONT_FAMILY,
  SIDER_BG,
  SIDER_BG_ELEVATED,
  ThemeModeContext,
} from './theme-mode-context';

const STORAGE_KEY = 'dashboard-theme-mode';

const getSystemPreference = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getInitialMode = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : getSystemPreference();
};

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    // Drives the app-level scrollbar colours in index.css. The dashboard's dark
    // mode is explicit state, so it cannot be keyed off prefers-color-scheme.
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  // CSS alone cannot stop antd's JS-driven rc-motion animations (drawer slide,
  // submenu expand) — the `motion` seed token is what disables those.
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const contextValue = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      setMode,
      toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ConfigProvider
        card={{ variant: 'borderless' }}
        theme={{
          algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
            fontFamily: FONT_FAMILY,
            motion: !reducedMotion,
            boxShadowTertiary: mode === 'dark'
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
                 states; see the identity in theme-mode-context.js. The fifth
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
              // Tinted rather than solid #1677ff: on the solid pill a pastel
              // glyph measured 1.8:1. This resolves to #112A54, where the
              // dimmest accent still clears 7:1 and white text clears 14:1.
              darkItemSelectedBg: 'rgba(22, 119, 255, 0.16)',
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
