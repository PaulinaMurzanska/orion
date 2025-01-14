import Unfonts from 'unplugin-fonts/vite';
/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/frontend',

  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/assets': {
        target:
          'https://td2893635.app.netsuite.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/assets/, ''),
      },
      '/netsuite': {
        target:
          'https://td2893635.extforms.netsuite.com/app/site/hosting/scriptlet.nl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/netsuite/, ''),
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    Unfonts({
      google: {
        families: [{ name: 'Raleway', defer: true }],
      },
    }),
  ],

  // Uncomment this if you are using workers.
  worker: {
    plugins: [nxViteTsPaths()],
  },

  build: {
    outDir: '../../dist/apps/frontend',
    reportCompressedSize: true,
    rollupOptions: {
      external: ['N/currentRecord'],
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/frontend',
      provider: 'v8',
    },
  },
});
