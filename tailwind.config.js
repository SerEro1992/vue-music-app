/** @type {import('tailwindcss').Config} */
module.exports = {
	purge: ['./index.html', './src/**/*.{vue,js,ts}'],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,vue}",
	],

	theme: {
		extend: {},
	},

	variants: {
		extend: {},
	},
	plugins: [],
}
