import { defineConfig } from 'vite'

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
      external: [/^node:/, 'fs', 'path', 'string-natural-compare'],
      output: {
          globals: {
            'string-natural-compare': 'naturalSort',
          },
      }
    },
  },
})