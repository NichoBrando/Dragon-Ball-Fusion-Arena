import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // only if you use React

export default defineConfig({
  plugins: [react()],
  base: 'Dragon-Ball-Fusion-Arena', // 👈 replace with your repo name
})