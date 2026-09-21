import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import fs from "fs";
import path from "path";

function copyRootFaviconPlugin() {
  return {
    name: "copy-root-favicon",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist/build/h5");
      const staticDir = path.resolve(__dirname, "src/static");
      if (fs.existsSync(distDir) && fs.existsSync(staticDir)) {
        const filesToCopy = ["favicon.ico", "favicon.svg", "logo.svg", "logo.png"];
        for (const file of filesToCopy) {
          const srcFile = path.join(staticDir, file);
          const destFile = path.join(distDir, file);
          if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, destFile);
          }
        }
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [uni(), copyRootFaviconPlugin()],
  build: {
    target: "es2020",
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    }
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : []
  }
});
