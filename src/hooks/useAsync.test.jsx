import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('starts loading, then exposes the data', async () => {
    const load = vi.fn().mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useAsync(load));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ ok: true });
    expect(result.current.error).toBeNull();
  });

  it('captures a rejection instead of letting it escape', async () => {
    const load = vi.fn().mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useAsync(load));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error?.message).toBe('boom');
    expect(result.current.data).toBeNull();
  });

  it('does not run on mount when immediate is false', () => {
    const load = vi.fn().mockResolvedValue(1);
    const { result } = renderHook(() => useAsync(load, { immediate: false }));

    expect(load).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('ignores a slow response that lost the race to a newer one', async () => {
    // The whole point of the requestId guard: a stale result must not overwrite
    // a fresher one just because it arrived later.
    let resolveSlow;
    const slow = new Promise((resolve) => {
      resolveSlow = resolve;
    });

    const load = vi.fn().mockReturnValueOnce(slow).mockResolvedValueOnce('fresh');

    const { result } = renderHook(() => useAsync(load, { immediate: false }));

    result.current.run();
    await result.current.run();
    resolveSlow('stale');

    await waitFor(() => expect(result.current.data).toBe('fresh'));
    expect(result.current.data).not.toBe('stale');
  });
});
