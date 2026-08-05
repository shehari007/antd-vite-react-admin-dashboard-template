import { describe, expect, it } from 'vitest';
import {
  DEFAULT_THEME,
  PRIMARY_PRESETS,
  SIDER_COLLAPSED_WIDTH,
  SIDER_INLINE_INDENT,
  hexToRgba,
} from './theme-mode-context';

describe('hexToRgba', () => {
  it('converts a six digit hex', () => {
    expect(hexToRgba('#1677ff', 0.16)).toBe('rgba(22, 119, 255, 0.16)');
  });

  it('expands a three digit hex', () => {
    expect(hexToRgba('#fff', 1)).toBe('rgba(255, 255, 255, 1)');
  });

  it('works without the leading hash', () => {
    expect(hexToRgba('000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
  });
});

describe('sidebar geometry', () => {
  it('keeps the icon axis identical in both states', () => {
    // The identity the whole rail depends on. If this fails the icons will
    // jump sideways when the sidebar collapses.
    const itemMarginInline = 8;
    const iconSize = 16;
    const expanded = itemMarginInline + SIDER_INLINE_INDENT + iconSize / 2;
    const collapsed = SIDER_COLLAPSED_WIDTH / 2;

    expect(expanded).toBe(40);
    expect(collapsed).toBe(40);
  });
});

describe('theme presets', () => {
  it('ships the default primary colour as one of the swatches', () => {
    expect(PRIMARY_PRESETS.map((preset) => preset.color)).toContain(DEFAULT_THEME.primaryColor);
  });

  it('gives every preset a unique key', () => {
    const keys = PRIMARY_PRESETS.map((preset) => preset.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
