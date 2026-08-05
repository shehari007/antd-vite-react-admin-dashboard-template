import { PRODUCTS, PRODUCT_CATEGORIES } from '@/data/products';

/**
 * Product catalogue, served from a local array.
 *
 * Filtering, sorting, and paging happen here rather than in the component on
 * purpose. That is where a real backend does them, so when you replace the body
 * of getProducts with a fetch call the page above it does not change:
 *
 *   export const getProducts = (params) =>
 *     apiClient.get(`/products?${new URLSearchParams(params)}`);
 */

const FAKE_LATENCY_MS = 500;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCategories = async () => {
  await delay(120);
  return PRODUCT_CATEGORIES;
};

export const getProducts = async ({
  search = '',
  category = null,
  page = 1,
  pageSize = 6,
  sortBy = null,
  sortOrder = 'ascend',
  simulateError = false,
} = {}) => {
  await delay(FAKE_LATENCY_MS);

  // Lets the Products page show what a failed request looks like without
  // unplugging your network cable.
  if (simulateError) {
    throw new Error('The catalogue service is unavailable. This failure is simulated on purpose.');
  }

  const term = search.trim().toLowerCase();
  let items = PRODUCTS.filter((product) => {
    const matchesTerm =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term);
    const matchesCategory = !category || product.category === category;
    return matchesTerm && matchesCategory;
  });

  if (sortBy) {
    const direction = sortOrder === 'descend' ? -1 : 1;
    items = [...items].sort((a, b) => {
      if (typeof a[sortBy] === 'number') return (a[sortBy] - b[sortBy]) * direction;
      return String(a[sortBy]).localeCompare(String(b[sortBy])) * direction;
    });
  }

  const total = items.length;
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  };
};

export const getCatalogSummary = async () => {
  await delay(200);
  const inStock = PRODUCTS.filter((product) => product.stock > 0);
  const value = PRODUCTS.reduce((sum, product) => sum + product.price * product.stock, 0);
  return {
    totalProducts: PRODUCTS.length,
    outOfStock: PRODUCTS.length - inStock.length,
    inventoryValue: value,
    averageRating: (
      PRODUCTS.reduce((sum, product) => sum + product.rating, 0) / PRODUCTS.length
    ).toFixed(2),
  };
};
