import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Treat .js files as JSX so files using JSX but named .js are handled
  esbuild: {
    // Use 'jsx' loader for JS/JSX/TS/TSX files in the src directory so .js files with JSX compile
    loader: 'jsx',
    include: /src\/.*\.(js|jsx|ts|tsx)$/
  }
})
