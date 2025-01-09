"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const manager_1 = __importDefault(require("./Routes/manager"));
const user_1 = __importDefault(require("./Routes/user"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use(express_1.default.json()); // Middleware to parse JSON bodies
app.use('/manager', manager_1.default);
app.use('/users', user_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API');
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
