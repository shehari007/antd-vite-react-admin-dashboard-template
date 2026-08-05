import { useEffect, useState } from 'react';

/**
 * Delay a value until it stops changing.
 *
 * Typing "headphones" into a search box is eleven renders and, without this,
 * eleven requests. Debouncing the value rather than the handler keeps the input
 * responsive while the request waits for a pause in typing.
 *
 *   const debouncedSearch = useDebouncedValue(search, 300);
 */
export const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
