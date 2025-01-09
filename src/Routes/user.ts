import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authTokenMiddleware , signJwt } from './middleWare/authenticatorMiddleWare';
const router = express.Router();
const prisma = new PrismaClient();

router.get('/',authTokenMiddleware ,  async (req: any, res: any) => {
    try {
        const username = req.body.username || req.user.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }

        const data = await prisma.user.findMany({
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
    } catch (error: any) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users.', details: error.message });
    }
});
router.post('/signin', async (req: any, res: any) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const data = await prisma.user.findUnique({
            where: { username  , password},
            select: { id: true, username: true, email: true , firstName : true , lastName : true},
        });
        if (!data) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const token = signJwt(data);
        res.json({ ...data, token });
    } catch (error: any) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login.', details: error.message });
    }
});
router.post('/signup' ,async (req: any, res: any) => {
    try {
        const { username, email, firstName, lastName, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        const data = await prisma.user.create({
            data: { username, email, firstName, lastName, password },
            select: { id: true, username: true, email: true  , firstName : true , lastName : true  },
        });
        const token = signJwt(data);
        res.json({ ...data, token });
    } catch (error: any) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user.', details: error.message });
    }
});

router.get('/tasks', authTokenMiddleware , async (req: any, res: any) => {
    try {
        const username = req.body.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }

        const data = await prisma.task.findMany({
            where: { username },
        });
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
});

router.get('/task/:id', authTokenMiddleware , async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task ID.' });
        }

        const task = await prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.json(task);
    } catch (error: any) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task.', details: error.message });
    }
});
router.get('./project' , authTokenMiddleware , async (req: any, res: any) => {
    try {
        const username = req.body.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }

        const data = await prisma.user.findMany({
            where: { username },
            select: {
                projects: true
            },
        });
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects.', details: error.message });
    }
});
router.post('/task', authTokenMiddleware , async (req: any, res: any) => {
    try {
        const { username, title, taskDesc, endDate , priority } = req.body;
        if (!username || !title || !endDate) {
            return res.status(400).json({ error: 'Username, title, and endDate are required.' });
        }

        const deadline = new Date(endDate);
        if (isNaN(deadline.getTime())) {
            return res.status(400).json({ error: 'Invalid endDate format.' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                deadline: deadline.toISOString(),
                username,
                priority,
                description: taskDesc || null,
            },
        });
        res.json(task);
    } catch (error: any) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task.', details: error.message });
    }
});
router.put('/task/:id', authTokenMiddleware , async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task ID.' });
        }
        const status = req.body.status;

        const task = await prisma.task.update({
            where: { id },
            data: {
                status,
               
            },
        });
        res.json(task);
    } catch (error: any) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task.', details: error.message });
    }
});

export default router;
