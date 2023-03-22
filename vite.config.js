import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    mainFields: [],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.js"],
    testMatch: ["./src/tests/**/*.test.js"],
    globals: true,
  },
});
