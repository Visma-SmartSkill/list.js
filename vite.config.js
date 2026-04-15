import { defineConfig } from 'vite'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'List',
      formats: ['umd', 'esm', 'cjs'],
      fileName: (format) => (format === 'umd' ? 'list.js' : `list.${format}.js`),
    },
    sourcemap: true,
    rollupOptions: {
      plugins: [commonjs()],
      external: ['string-natural-compare'],
      output: {
        globals: {
          'string-natural-compare': 'naturalSort',
        },
        plugins: [
          terser({
            format: {
              comments: /^! List.js v.*/,
            },
            mangle: true,
          }),
        ],
      },
    },
  },
})