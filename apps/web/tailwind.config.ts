import type { Config } from 'tailwindcss';
import { serenidadEditorialPreset } from '@psicoiris/ui/tailwind-preset';

const config: Config = {
  presets: [serenidadEditorialPreset as unknown as Partial<Config>],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
