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
router.get('/allUsers', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const data = yield prisma.manager.findMany({
            where: {
                username: { startsWith: name },
                role: 'USER',
            },
            select: {
                username: true,
            },
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.', details: error.message });
    }
}));
router.get('/', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const data = yield prisma.manager.findUnique({
            where: { username },
            select: {
                username: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch manager data.', details: error.message });
    }
}));
router.get('/projects', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const data = yield prisma.manager.findUnique({
            where: { username },
            include: {
                managedProjects: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (data)
            res.json(data.managedProjects);
        else
            res.json([]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects.', details: error.message });
    }
}));
router.get('/tasks', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const data = yield prisma.manager.findUnique({
            where: { username },
            include: {
                managedProjects: {
                    select: {
                        tasks: true,
                    },
                },
            },
        });
        if (data)
            res.json(data.managedProjects[0].tasks);
        else
            res.json([]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
}));
router.post('/signIn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const data = yield prisma.manager.findUnique({
            where: { username },
            select: {
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                password: true,
            },
        });
        if (!data) {
            return res.status(404).json({ error: 'Manager not found.' });
        }
        if (data.password !== password) {
            return res.status(401).json({ error: 'Invalid password.' });
        }
        const token = (0, authenticatorMiddleWare_1.signJwt)({ username: data.username, email: data.email, firstName: data.firstName, lastName: data.lastName });
        res.json({
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to sign in.', details: error.message });
    }
}));
router.post('/signUp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const data = yield prisma.manager.create({
            data: {
                username,
                email,
                firstName,
                lastName,
                password,
            },
            select: {
                username: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });
        const token = (0, authenticatorMiddleWare_1.signJwt)({ username: data.username, email: data.email, firstName: data.firstName, lastName: data.lastName });
        res.json(Object.assign(Object.assign({}, data), { token }));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create manager.', details: error.message });
    }
}));
router.post('/project', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const project = req.body.projectName;
        const projectDesc = req.body.projectDesc;
        const endDate = new Date(req.body.endDate).toISOString(); // Ensure ISO-8601 format
        const proj = yield prisma.project.create({
            data: {
                name: project,
                end: endDate,
                managerUsername: username,
                description: projectDesc,
            },
        });
        res.json(proj);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create project.', details: error.message });
    }
}));
router.delete('/project', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const projectId = req.body.projectId;
        const proj = yield prisma.project.delete({
            where: {
                id: projectId,
            },
        });
        res.json(proj);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete project.', details: error.message });
    }
}));
router.post('/task', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const username: string = req.body.username;
        const username = req.body.username; // this is user username not manager manager will going to come from authenticator
        const projectId = req.body.projectId;
        const title = req.body.title;
        const priority = req.body.priority;
        const taskDesc = req.body.taskDesc;
        const deadline = new Date(req.body.endDate).toISOString(); // Ensure ISO-8601 format
        const task = yield prisma.task.create({
            data: {
                title,
                deadline,
                priority,
                username,
                projectId,
                description: taskDesc,
            },
        });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create task.', details: error.message });
    }
}));
router.delete('/task/:id', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const task = yield prisma.task.delete({
            where: {
                id,
            },
        });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task.', details: error.message });
    }
}));
router.put('/task/:id', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const taskNewDetails = req.body;
        const data = {};
        if (taskNewDetails.title) {
            data.title = taskNewDetails.title;
        }
        if (taskNewDetails.taskDesc) {
            data.description = taskNewDetails.taskDesc;
        }
        if (taskNewDetails.endDate) {
            const endDate = new Date(taskNewDetails.endDate).toISOString();
            data.deadline = endDate;
        }
        if (taskNewDetails.priority !== undefined) {
            data.priority = taskNewDetails.priority;
        }
        const task = yield prisma.task.update({
            where: {
                id,
            },
            data: Object.assign({}, data),
        });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update task.', details: error.message });
    }
}));
exports.default = router;
