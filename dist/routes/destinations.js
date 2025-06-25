"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/destinations.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.json([
        { id: 1, name: 'Kyoto' },
        { id: 2, name: 'Zurich' }
    ]);
});
exports.default = router;
