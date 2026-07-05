import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://libro-go.dev',
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
});
