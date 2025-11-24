// tailwind.config.js
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                nunito: 'var(--font-nunito)',
                geistMono: 'var(--font-geist-mono)',
            },
        },
    },
};
