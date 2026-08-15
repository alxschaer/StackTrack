import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base: './' makes the build portable across GitHub Pages, Netlify, and
// Vercel without hardcoding a repo name or domain.
export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/recharts'))
                        return 'charts';
                    if (id.includes('node_modules/react'))
                        return 'react';
                },
            },
        },
    },
});
