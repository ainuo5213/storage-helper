import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    server: {
        port: 3001,
        strictPort: true,
        cors: true,
        https: false,
        open: true
    }
})