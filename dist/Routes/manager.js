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
// interface Manager {
//   username: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;
// }
router.get('/', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const data = yield prisma.manager.findUnique({
            where: { username },
            select: { username: true, email: true, firstName: true, lastName: true },
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch manager data.', details: error.message });
    }
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
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
        res.json({ username: data.username, email: data.email, firstName: data.firstName, lastName: data.lastName, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to sign in.', details: error.message });
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, firstName, lastName, password } = req.body;
        const data = yield prisma.manager.create({
            data: { username, email, firstName, lastName, password },
            select: { username: true, email: true, firstName: true, lastName: true },
        });
        const token = (0, authenticatorMiddleWare_1.signJwt)({ username: data.username, email: data.email, firstName: data.firstName, lastName: data.lastName });
        res.json(Object.assign(Object.assign({}, data), { token }));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create manager.', details: error.message });
    }
}));
router.get('/allUsers', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const data = yield prisma.manager.findMany({
            where: { username: { startsWith: name }, role: 'USER' },
            select: { username: true },
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.', details: error.message });
    }
}));
router.put('/updatepassword', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.email;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Old password and new password are required.' });
        }
        const user = yield prisma.user.findUnique({
            where: { username, password: oldPassword },
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid password.' });
        }
        yield prisma.user.update({
            where: { username },
            data: { password: newPassword },
        });
        res.json({ message: 'Password updated successfully.' });
    }
    catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Failed to update password.', details: error.message });
    }
}));
router.put('/update', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.user.email;
        const managerNewDetails = req.body;
        const data = {};
        if (managerNewDetails.username) {
            data.username = managerNewDetails.username;
        }
        if (managerNewDetails.firstName) {
            data.firstName = managerNewDetails.firstName;
        }
        if (managerNewDetails.lastName) {
            data.lastName = managerNewDetails.lastName;
        }
        const manager = yield prisma.manager.update({
            where: { email },
            data,
        });
        res.json(manager);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update manager.', details: error.message });
    }
}));
router.get('/projects', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const data = yield prisma.manager.findUnique({
            where: { username },
            include: { managedProjects: { select: { id: true, name: true, description: true } } },
        });
        res.json(data ? data.managedProjects : []);
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
            include: { managedProjects: { include: { tasks: true } } },
        });
        res.json(data ? data : []);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
}));
router.get('/project/:projectId/tasks', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const projectId = parseInt(req.params.projectId);
        const data = yield prisma.manager.findUnique({
            where: { username },
            include: {
                managedProjects: {
                    where: { id: projectId },
                    include: { tasks: true },
                },
            },
        });
        res.json(data ? data : []);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
}));
router.post('/project/create', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const { projectName, projectDesc, endDate } = req.body;
        const proj = yield prisma.project.create({
            data: {
                name: projectName,
                end: new Date(endDate).toISOString(),
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
router.post('/project/:projectId/addUser', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.user.username;
    const projectId = parseInt(req.params.projectId);
    const present = yield prisma.manager.findUnique({
        where: { username },
        include: {
            managedProjects: {
                where: { id: projectId },
            },
        },
    });
    if (!present) {
        return res.status(404).json({ error: 'Project not found by the given manager.' });
    }
    const { user } = req.body;
    const userPresent = yield prisma.user.findUnique({
        where: { username: user },
    });
    if (!userPresent) {
        return res.status(404).json({ error: 'User not found.' });
    }
    const project = yield prisma.project.update({
        where: { id: projectId },
        data: {
            users: { connect: { username: user } },
        },
    });
    res.json(project);
}));
router.get('/project/:projectId/users', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.user.username;
    const projectId = parseInt(req.params.projectId);
    const present = yield prisma.manager.findUnique({
        where: { username },
        include: {
            managedProjects: {
                where: { id: projectId },
                include: { users: true },
            },
        },
    });
    if (!present) {
        return res.status(404).json({ error: 'Project not found by the given manager.' });
    }
    res.json(present.managedProjects[0].users);
}));
router.delete('/project/:projectId/delete', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const present = yield prisma.manager.findUnique({
            where: { username },
            include: {
                managedProjects: {
                    where: { id: parseInt(req.params.projectId) },
                },
            },
        });
        const projectId = parseInt(req.params.projectId);
        const proj = yield prisma.project.delete({
            where: { id: projectId },
        });
        res.json(proj);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete project.', details: error.message });
    }
}));
router.post('/project/:projectId/task/create', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const { title, priority, taskDesc, endDate } = req.body;
        const projectId = parseInt(req.params.projectId);
        const task = yield prisma.task.create({
            data: {
                title,
                deadline: new Date(endDate).toISOString(),
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
router.delete('/project/:projectId/task/:taskId/delete', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = parseInt(req.params.projectId);
        const present = yield prisma.manager.findUnique({
            where: { username: req.user.username },
            include: {
                managedProjects: {
                    where: { id: projectId },
                },
            },
        });
        if (!present) {
            return res.status(404).json({ error: 'Project not found by the given manager.' });
        }
        const taskId = parseInt(req.params.taskId);
        const task = yield prisma.task.delete({
            where: { id: taskId },
        });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task.', details: error.message });
    }
}));
router.put('project/:projectId/task/:id/update', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const projectId = parseInt(req.params.projectId);
        const taskId = parseInt(req.params.id);
        const projectPresnt = yield prisma.manager.findUnique({
            where: { username },
            include: {
                managedProjects: {
                    where: { id: projectId },
                },
            },
        });
        if (!projectPresnt) {
            return res.status(404).json({ error: 'Project not found by the given manager.' });
        }
        const data = {};
        if (req.body.title) {
            data.title = req.body.title;
        }
        if (req.body.priority) {
            data.priority = req.body.priority;
        }
        if (req.body.taskDesc) {
            data.description = req.body.taskDesc;
        }
        if (req.body.endDate) {
            data.deadline = new Date(req.body.endDate).toISOString();
        }
        const task = yield prisma.task.update({
            where: { id: taskId },
            data,
        });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update task.', details: error.message });
    }
}));
exports.default = router;
