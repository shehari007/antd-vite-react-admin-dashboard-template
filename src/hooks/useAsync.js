import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Run an async function and get back the three states every screen needs.
 *
 * Wrap the function you pass in with useCallback so it only changes when its
 * inputs do, otherwise this refetches on every render:
 *
 *   const load = useCallback(() => fetchProducts({ search }), [search]);
 *   const { data, loading, error, refresh } = useAsync(load);
 *
 * The requestId guard is the part worth keeping when you rewrite this. Without
 * it, a slow response for "sh" can land after a fast one for "shoes" and
 * overwrite the newer results with the older ones.
 */
export const useAsync = (asyncFunction, { immediate = true } = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const requestId = useRef(0);

  const run = useCallback(async () => {
    const id = requestId.current + 1;
    requestId.current = id;
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      if (id === requestId.current) setData(result);
      return result;
    } catch (caught) {
      if (id === requestId.current) {
        setError(caught);
        setData(null);
      }
      return undefined;
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [asyncFunction]);

  /* react-hooks/set-state-in-effect fires here because run() flips `loading`
     synchronously. Fetching when the inputs change is the one thing effects are
     genuinely for, and deferring the flag would show stale data with no spinner
     for a frame, so the rule is switched off for this line rather than worked
     around. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (immediate) run();
  }, [immediate, run]);

  return { data, error, loading, run, refresh: run };
};
