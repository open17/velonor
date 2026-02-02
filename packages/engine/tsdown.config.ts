import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client.ts',
    loader: 'src/loader.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  shims: true,
});
