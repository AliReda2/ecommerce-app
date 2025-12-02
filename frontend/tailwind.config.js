// tailwind.config.js
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [
        'bg-blue-100',
        'bg-green-100',
        'bg-orange-100',
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
