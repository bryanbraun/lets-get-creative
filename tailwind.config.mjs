/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			sans: ['Comic Neue', 'Comic Sans', 'sans-serif'],
			cursive: ['Gaegu', 'cursive'],
		},
		colors: {
			white: '#fff',
			dark:	'#1d1d1d',
			black: '#000',
		},
		lineHeight: {
			"leading-normal": 1.625
		},
		zIndex: {
			// 'carousel': '1', // This is found in the carousel component
			'title': '10',
		},
		extend: {
		},
	},
	plugins: [],
};
