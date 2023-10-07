/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			sans: ['Comic Neue', 'Comic Sans', 'sans-serif'],
			cursive: ['Gaegu', 'cursive'],
		},
		colors: {
			"white": '#fff',
			"selected": "#f1f1f1",
			"border-gray": "#d0d0d0",
			"marker-purple": "#673AB7",
			"dark":	'#1d1d1d',
			"black": '#000',
			"whiteboard": "#f8f9fa",
			"transparent": "transparent",
		},
		lineHeight: {
			"leading-normal": 1.625
		},
		zIndex: {
			'whiteboard': '1',
			'whiteboard-overlay': '5',
			'title': '10',
			'edit-button': '20',
		},
		extend: {
			height: {
				"whiteboard": "var(--whiteboard-height)",
			},
			borderWidth: {
				"20": "20px",
			}
		},
	},
	plugins: [],
};
