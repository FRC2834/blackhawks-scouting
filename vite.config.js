/* eslint-env node */

import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import { liveReload } from "vite-plugin-live-reload";
import postcssNested from "postcss-nested";
import ReactivityTransform from "@vue-macros/reactivity-transform/vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer, postcssNested]
    }
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  plugins: [
    ReactivityTransform(),
    vue(),
    VitePWA({
      includeAssets: ["assets/*", "icons/*"],
      manifest: {
        name: "Rockway Robotics Scouting",
        short_name: "Scouting",
        description: "A scouting app by FRC Team 2834",
        theme_color: "#C70039",
        background_color: "#1B1212",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    liveReload([
      "public/"
    ])
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    minify: "terser",
    target: "safari12"
  }
});
