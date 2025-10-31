"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = (0, config_1.defineConfig)({
    migrations: {
        seed: 'ts-node prisma/seed.ts',
    },
});
//# sourceMappingURL=prisma.config.js.map