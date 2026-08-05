import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // `npm run analyze` runs the build in "analyze" mode and writes a treemap to
    // stats.html, so a size regression is visible before it ships. Using the
    // mode flag rather than an env var keeps the script identical on Windows,
    // macOS, and Linux.
    mode === 'analyze' &&
      visualizer({ filename: 'stats.html', gzipSize: true, brotliSize: true, open: true }),
  ].filter(Boolean),

  resolve: {
    alias: {
      // Import as '@/components/PageHeader' from anywhere instead of counting
      // how many '../' it takes to climb out of src/pages/errors.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Baked in at build time so the footer can show a version without importing
  // the whole package.json into the bundle.
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },

  server: {
    port: 5173,
    open: true,
  },

  preview: {
    port: 4173,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 700,

    /* No manualChunks here, on purpose.
     *
     * The obvious move is to group node_modules by library ("all of antd in one
     * chunk"), and it is a trap. Forcing every antd module into one chunk makes
     * the whole thing eager the moment the app shell touches any part of it, so
     * the Table, the Kanban board's drag styles, and the Chat page's drawer all
     * load before the sign in screen paints. Measured on this app that grouping
     * costs 643 kB gzipped on first load. Letting the bundler decide, which is
     * what happens with no `output.manualChunks` at all, splits by actual usage
     * and brings it down to 324 kB.
     *
     * Run `npm run analyze` before you add one back. If the treemap shows a
     * genuinely shared dependency being duplicated across many chunks, group
     * that one library and measure again.
     */
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'src/**/*.test.{js,jsx}'],
    },
  },
}));
