import { createContext } from 'react';

export const ThemeModeContext = createContext(null);

export const FONT_FAMILY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

/* ---------------------------------------------------------------------------
 * Sidebar geometry
 *
 * The whole rail hangs off one number: the icon centre sits at 40px in BOTH
 * the expanded and the collapsed state, so collapsing is pure clipping with no
 * horizontal travel.
 *
 * antd puts a collapsed icon at exactly `collapsedWidth / 2` — menu/style/
 * vertical.js emits `padding-inline: calc(50% - collapsedIconSize/2 -
 * itemMarginInline)`, which self-centres for any width. Expanded, rc-menu
 * writes an inline `padding-left: level * inlineIndent`, putting the icon at
 * `itemMarginInline + inlineIndent + iconSize/2`.
 *
 * Equating the two gives the identity this file exists to hold:
 *
 *     itemMarginInline + inlineIndent + iconSize / 2  ===  collapsedWidth / 2
 *                    8 +           24 +           8  ===  80 / 2  ===  40
 *
 * Change any one of those four and the icons will jump on collapse unless you
 * re-solve it. Note inlineIndent is a Menu *prop*, not a token — the inline
 * style rc-menu writes beats every class rule, so itemPaddingInline cannot
 * move the expanded icon.
 * ------------------------------------------------------------------------- */
export const SIDER_WIDTH = 248;
export const SIDER_COLLAPSED_WIDTH = 80;
export const SIDER_INLINE_INDENT = 24;

export const SIDER_BG = '#101B34';
/** Collapsed flyout surface — reads as elevated against SIDER_BG. */
export const SIDER_BG_ELEVATED = '#1B2A49';
