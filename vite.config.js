import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server:{
		port:3000,
		strictPort:false,
	},
	preview:{
		port:3000,
		strictPort:false,
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
