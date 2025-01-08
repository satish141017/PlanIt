import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authTokenMiddleware , signJwt } from './middleWare/authenticatorMiddleWare';
const router = express.Router();
const prisma = new PrismaClient();

router.get('/',authTokenMiddleware ,  async (req: any, res: any) => {
    try {
        const username = req.body.username;
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

router.post('/' ,async (req: any, res: any) => {
    try {
        const { username, email, firstName, lastName, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        const data = await prisma.user.create({
            data: { username, email, firstName, lastName, password },
            select: { id: true, username: true, email: true },
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
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
            },
        });
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
});

router.post('/task', authTokenMiddleware , async (req: any, res: any) => {
    try {
        const { username, title, taskDesc, endDate } = req.body;
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
                description: taskDesc || null,
            },
        });
        res.json(task);
    } catch (error: any) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task.', details: error.message });
    }
});


export default router;
