import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://bryanbraun.com/lets-get-creative", // Used for constructing absolute URLs.
  base: "/lets-get-creative",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react()
  ]
});
