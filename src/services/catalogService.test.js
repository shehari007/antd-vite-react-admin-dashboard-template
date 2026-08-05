import { describe, expect, it } from 'vitest';
import { getCatalogSummary, getProducts } from './catalogService';
import { PRODUCTS } from '@/data/products';

describe('getProducts', () => {
  it('pages the results and reports the unfiltered total', async () => {
    const result = await getProducts({ page: 1, pageSize: 4 });
    expect(result.items).toHaveLength(4);
    expect(result.total).toBe(PRODUCTS.length);
  });

  it('returns the second page', async () => {
    const first = await getProducts({ page: 1, pageSize: 4 });
    const second = await getProducts({ page: 2, pageSize: 4 });
    expect(second.items[0].id).not.toBe(first.items[0].id);
  });

  it('searches by name and by SKU', async () => {
    const byName = await getProducts({ search: 'keyboard' });
    expect(byName.items.every((item) => item.name.toLowerCase().includes('keyboard'))).toBe(true);

    const bySku = await getProducts({ search: 'AUD-1001' });
    expect(bySku.items).toHaveLength(1);
  });

  it('filters by category', async () => {
    const result = await getProducts({ category: 'Audio', pageSize: 50 });
    expect(result.items.every((item) => item.category === 'Audio')).toBe(true);
  });

  it('sorts descending when asked', async () => {
    const result = await getProducts({ sortBy: 'price', sortOrder: 'descend', pageSize: 50 });
    const prices = result.items.map((item) => item.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('returns an empty page rather than throwing when nothing matches', async () => {
    const result = await getProducts({ search: 'definitely-not-a-product' });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('throws when error simulation is on, so the failure state is reachable', async () => {
    await expect(getProducts({ simulateError: true })).rejects.toThrow(/unavailable/i);
  });
});

describe('getCatalogSummary', () => {
  it('counts the out of stock products', async () => {
    const summary = await getCatalogSummary();
    const expected = PRODUCTS.filter((product) => product.stock === 0).length;
    expect(summary.outOfStock).toBe(expected);
    expect(summary.totalProducts).toBe(PRODUCTS.length);
  });
});
