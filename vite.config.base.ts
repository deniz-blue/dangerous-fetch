import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { ManifestV3Export } from '@crxjs/vite-plugin';
import { defineConfig, BuildOptions } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './manifest.json';
import devManifest from './manifest.dev.json';
import pkg from './package.json';


const isDev = process.env.__DEV__ === 'true';

export const baseManifest = {
  ...manifest,
  version: pkg.version,
  ...(isDev ? devManifest : {} as ManifestV3Export),
} as ManifestV3Export

export const baseBuildOptions: BuildOptions = {
  sourcemap: isDev,
  emptyOutDir: !isDev
}

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
  ],
  publicDir: resolve(__dirname, 'public'),
});
