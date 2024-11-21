import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    assetsInlineLimit: 100000000, // Adjust this value as needed
    chunkSizeWarningLimit: 1000, // Adjust this value as needed
    // other build options...
  },
});
