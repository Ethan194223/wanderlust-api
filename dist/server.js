"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
// src/server.ts
const express_1 = __importDefault(require("express"));
const health_js_1 = __importDefault(require("./routes/health.js")); // note “.js”
const destinations_js_1 = __importDefault(require("./routes/destinations.js")); // note “.js”
const app = (0, express_1.default)();
app.use(express_1.default.json());
// wire the sub-routers
app.use('/health', health_js_1.default);
app.use('/destinations', destinations_js_1.default);
// fallback
app.get('/', (_req, res) => {
    res.send('Welcome to Wanderlust API 🎉');
});
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
