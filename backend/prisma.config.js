import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

// Load the .env file manually
config();

export default defineConfig({
    migrations: {
        seed: 'node prisma/seed.js',
    },
});
