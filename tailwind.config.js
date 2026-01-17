/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Share Tech Mono"', 'monospace'], // Sci-fi font
            },
            colors: {
                cyan: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                    900: '#164e63',
                }
            },
            animation: {
                'breathe': 'breathe 3s ease-in-out infinite',
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
                    '50%': { transform: 'scale(1.05)', opacity: '0.8' },
                }
            }
        },
    },
    plugins: [],
}
