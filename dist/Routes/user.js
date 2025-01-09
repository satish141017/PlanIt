"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const authenticatorMiddleWare_1 = require("./middleWare/authenticatorMiddleWare");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username || req.user.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }
        const data = yield prisma.user.findMany({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users.', details: error.message });
    }
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        const data = yield prisma.user.findUnique({
            where: { username, password },
            select: { id: true, username: true, email: true, firstName: true, lastName: true },
        });
        if (!data) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const token = (0, authenticatorMiddleWare_1.signJwt)(data);
        res.json(Object.assign(Object.assign({}, data), { token }));
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login.', details: error.message });
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, firstName, lastName, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }
        const data = yield prisma.user.create({
            data: { username, email, firstName, lastName, password },
            select: { id: true, username: true, email: true, firstName: true, lastName: true },
        });
        const token = (0, authenticatorMiddleWare_1.signJwt)(data);
        res.json(Object.assign(Object.assign({}, data), { token }));
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user.', details: error.message });
    }
}));
router.get('/tasks', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }
        const data = yield prisma.task.findMany({
            where: { username },
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
}));
router.get('/task/:id', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task ID.' });
        }
        const task = yield prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found.' });
        }
        res.json(task);
    }
    catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task.', details: error.message });
    }
}));
router.get('./project', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }
        const data = yield prisma.user.findMany({
            where: { username },
            select: {
                projects: true
            },
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects.', details: error.message });
    }
}));
router.post('/task', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, title, taskDesc, endDate, priority } = req.body;
        if (!username || !title || !endDate) {
            return res.status(400).json({ error: 'Username, title, and endDate are required.' });
        }
        const deadline = new Date(endDate);
        if (isNaN(deadline.getTime())) {
            return res.status(400).json({ error: 'Invalid endDate format.' });
        }
        const task = yield prisma.task.create({
            data: {
                title,
                deadline: deadline.toISOString(),
                username,
                priority,
                description: taskDesc || null,
            },
        });
        res.json(task);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task.', details: error.message });
    }
}));
router.put('/task/:id', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task ID.' });
        }
        const status = req.body.status;
        const task = yield prisma.task.update({
            where: { id },
            data: {
                status,
            },
        });
        res.json(task);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task.', details: error.message });
    }
}));
exports.default = router;
