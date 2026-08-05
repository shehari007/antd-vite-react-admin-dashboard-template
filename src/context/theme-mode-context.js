import { createContext } from 'react';

export const ThemeModeContext = createContext(null);

export const FONT_FAMILY =
  "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

/* ---------------------------------------------------------------------------
 * Sidebar geometry
 *
 * The whole rail hangs off one number: the icon centre sits at 40px in BOTH
 * the expanded and the collapsed state, so collapsing is pure clipping with no
 * horizontal travel.
 *
 * antd puts a collapsed icon at exactly `collapsedWidth / 2` (menu/style/
 * vertical.js emits `padding-inline: calc(50% - collapsedIconSize/2 -
 * itemMarginInline)`, which self-centres for any width). Expanded, rc-menu
 * writes an inline `padding-left: level * inlineIndent`, putting the icon at
 * `itemMarginInline + inlineIndent + iconSize/2`.
 *
 * Equating the two gives the identity this file exists to hold:
 *
 *     itemMarginInline + inlineIndent + iconSize / 2  ===  collapsedWidth / 2
 *                    8 +           24 +           8  ===  80 / 2  ===  40
 *
 * Change any one of those four and the icons will jump on collapse unless you
 * re-solve it. Note inlineIndent is a Menu *prop*, not a token: the inline
 * style rc-menu writes beats every class rule, so itemPaddingInline cannot
 * move the expanded icon.
 * ------------------------------------------------------------------------- */
export const SIDER_WIDTH = 248;
export const SIDER_COLLAPSED_WIDTH = 80;
export const SIDER_INLINE_INDENT = 24;

export const SIDER_BG = '#101B34';
/** Collapsed flyout surface, reads as elevated against SIDER_BG. */
export const SIDER_BG_ELEVATED = '#1B2A49';

/* ---------------------------------------------------------------------------
 * Theme customizer options
 *
 * These feed the drawer behind the paintbrush button in the header. Add a
 * colour here and it shows up as a swatch with no other change needed.
 * ------------------------------------------------------------------------- */
export const PRIMARY_PRESETS = [
  { key: 'blue', color: '#1677ff', name: 'Blue' },
  { key: 'violet', color: '#722ed1', name: 'Violet' },
  { key: 'green', color: '#0e9f6e', name: 'Green' },
  { key: 'cyan', color: '#0d9aa1', name: 'Cyan' },
  { key: 'sunset', color: '#e8590c', name: 'Sunset' },
  { key: 'magenta', color: '#c9268f', name: 'Magenta' },
];

export const RADIUS_PRESETS = [0, 4, 8, 12, 16];

export const DEFAULT_THEME = {
  primaryColor: '#1677ff',
  borderRadius: 8,
  compact: false,
};

/**
 * Tint a hex colour for use as a translucent background.
 *
 * The selected menu pill uses this instead of a solid fill: measured against
 * the dark rail a solid primary put pastel group icons at 1.8:1, while the
 * 16% tint resolves to a surface where the dimmest accent still clears 7:1.
 */
export const hexToRgba = (hex, alpha) => {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value;
  const int = Number.parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
