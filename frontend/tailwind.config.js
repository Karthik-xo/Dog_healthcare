/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                },
                dark: '#1e293b',
            },
            animation: {
                'ken-burns': 'kenBurns 25s ease-in-out infinite alternate',
            },
            keyframes: {
                kenBurns: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.15) translate(-1%, -1%)' },
                }
            }
        },
    },
    plugins: [],
}
