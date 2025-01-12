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
        const username = req.user.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }
        const data = yield prisma.user.findUnique({
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
router.put('/updatepassword', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.email;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Old password and new password are required.' });
        }
        const user = yield prisma.user.findUnique({
            where: { username, password: oldPassword },
            select: { password: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
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
        const username = req.user.email;
        const userNewDetails = req.body;
        const data = {};
        if (userNewDetails.username) {
            data.username = userNewDetails.username;
        }
        if (userNewDetails.firstName) {
            data.firstName = userNewDetails.firstName;
        }
        if (userNewDetails.lastName) {
            data.lastName = userNewDetails.lastName;
        }
        const user = yield prisma.user.update({
            where: { username },
            data,
        });
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user.', details: error.message });
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
        const data = yield prisma.user.findUnique({
            where: { username },
            include: { tasks: true },
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
        const username = req.user.username;
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task ID.' });
        }
        const task = yield prisma.user.findUnique({
            where: { username },
            include: { tasks: { where: { id } } },
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
router.get('/project', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }
        const data = yield prisma.user.findMany({
            where: { username },
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        end: true,
                    },
                },
            },
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects.', details: error.message });
    }
}));
router.put('/task/:id/update', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task ID.' });
        }
        const existingTask = yield prisma.task.findUnique({
            where: { id },
            select: { projectId: true },
        });
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found.' });
        }
        let updateData = {};
        if (existingTask.projectId === null) {
            // If projectId is null, allow updating all fields
            if (req.body.status) {
                updateData.status = req.body.status;
            }
            if (req.body.priority) {
                updateData.priority = req.body.priority;
            }
            if (req.body.title) {
                updateData.title = req.body.title;
            }
            if (req.body.taskDesc) {
                updateData.description = req.body.taskDesc;
            }
            if (req.body.endDate) {
                updateData.deadline = new Date(req.body.endDate).toISOString();
            }
        }
        else {
            // If projectId is not null, allow updating only status and priority
            if (req.body.status) {
                updateData.status = req.body.status;
            }
            if (req.body.priority) {
                updateData.priority = req.body.priority;
            }
        }
        // Update the task
        const updatedTask = yield prisma.task.update({
            where: { id },
            data: updateData,
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            error: 'Failed to update task.',
            details: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error occurred.',
        });
    }
}));
router.get('/project/:projectId', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = parseInt(req.params.projectId);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID.' });
        }
        const data = yield prisma.user.findUnique({
            where: { username: req.user.username },
            include: {
                projects: {
                    where: {
                        id: projectId,
                    }
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
}));
router.get('/project/:projectId/tasks', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = parseInt(req.params.projectId);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID.' });
        }
        const data = yield prisma.user.findUnique({
            where: { username: req.user.username },
            include: {
                tasks: {
                    where: {
                        projectId
                    }
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
}));
router.post('/task/create', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.user.username;
        const { title, taskDesc, endDate, priority } = req.body;
        if (!title || !taskDesc || !endDate || !priority) {
            return res.status(400).json({ error: 'Title, description, end date, priority, and project ID are required.' });
        }
        const data = yield prisma.task.create({
            data: {
                title,
                description: taskDesc,
                deadline: new Date(endDate).toISOString(),
                priority,
                username,
            },
        });
        res.json(data);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task.', details: error.message });
    }
}));
router.delete('/task/:id/delete', authenticatorMiddleWare_1.authTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task ID.' });
        }
        const task = yield prisma.task.delete({
            where: { id, projectId: null, username: req.user.username },
        });
        res.json(task);
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task.', details: error.message });
    }
}));
exports.default = router;
