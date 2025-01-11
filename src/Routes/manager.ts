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
router.put('/updatepassword',authTokenMiddleware , async (req: any, res: any) => {
    try {
        const username = req.user.email;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Old password and new password are required.' });
        }

        const user = await prisma.user.findUnique({
            where: { username , password: oldPassword },
            select: { password: true },
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        await prisma.user.update({
            where: { username },
            data: { password: newPassword },
        });
        res.json({ message: 'Password updated successfully.' });
    } catch (error: any) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Failed to update password.', details: error.message });
    }
}); 

router.put('/update',authTokenMiddleware , async (req: any, res: any) => {
    try {
        const username = req.user.email;
        const userNewDetails = req.body;
        const data: any = {};

        if (userNewDetails.username) {
            data.username = userNewDetails.username;
        }
        if (userNewDetails.firstName) {
            data.firstName = userNewDetails.firstName;
        }
        if (userNewDetails.lastName) {
            data.lastName = userNewDetails.lastName;
        }


        const user = await prisma.user.update({
            where: { username },
            data,
        });
        res.json(user);
    } catch (error: any) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user.', details: error.message });
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

        const data = await prisma.user.findUnique({
            where: { username  },
            include: { tasks: true },
        });
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
});

router.get('/task/:id', authTokenMiddleware , async (req: any, res: any) => {
    try {
        const username = req.user.username;
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid task ID.' });
        }

        const task = await prisma.user.findUnique({
            where: { username },
            include: { tasks: { where: { id } } },
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
router.get('/project' , authTokenMiddleware , async (req: any, res: any) => {
    try {
        const username = req.body.username;
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }

        const data = await prisma.user.findMany({
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
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects.', details: error.message });
    }
});
router.put('project/:projectId/task/:id/update', authTokenMiddleware, async (req: any, res: any) => {
    try {
       const username = req.user.username;
        const projectId = parseInt(req.params.projectId);
        const id = parseInt(req.params.id);
        const isProjectpresent = await prisma.project.findUnique({

            where: { id: projectId  , manager : req.user.username},
        });
        if(!isProjectpresent){
            return res.status(404).json({ error: 'Project not found. with the given user' });
        }
        const data : any = {};
        if (isNaN(projectId) || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid project or task ID.' });
        }
        if(req.body.title){
            data.title = req.body.title;
        }
        if(req.body.taskDesc){
            data.description = req.body.taskDesc;
        }
        if(req.body.endDate){
            data.deadline = new Date(req.body.endDate).toISOString();
        }
        if(req.body.priority){
            data.priority = req.body.priority;
        }
        if(req.body.assignedUser){
            data.username = req.body.assignedUser;
        }
        const task = await prisma.task.update({
            where: { id  },
            data,
        });
    } catch (error: any) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task.', details: error.message });
    }

   
});
router.post('/project/:projectId/task/create', authTokenMiddleware, async (req: any, res: any) => {
    try {
        const projectId = parseInt(req.params.projectId);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID.' });
        }

        const { title, taskDesc, endDate, priority , assignedUser } = req.body;
        if (!title || !taskDesc || !endDate || !priority) {
            return res.status(400).json({ error: 'Title, description, end date, and priority are required.' });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description: taskDesc,
                deadline: new Date(endDate).toISOString(),
                priority,
                projectId,
                username : assignedUser
            },
        });

        res.json(newTask);
    } catch (error: any) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task.', details: error.message });
    }
});
router.get('/project/:projectId', authTokenMiddleware, async (req: any, res: any) => {
    try {
        const projectId = parseInt(req.params.projectId);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID.' });
        }
        const data = await prisma.user.findUnique({
            where: { username: req.user.username },
            include : {
                projects : {
                    where : {
                        id : projectId,
                    }
                }
            }
        });
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
});
router.get('/project/:projectId/tasks', authTokenMiddleware, async (req: any, res: any) => {
    try {
        const projectId = parseInt(req.params.projectId);
        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID.' });
        }
        const data = await prisma.user.findUnique({
            where: { username: req.user.username },
            include : {
                tasks : {
                    where : {
                        projectId 
                    }
                }
            }
        });
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
    }
});
router.delete('/project/:projectId/task/:id/delete', authTokenMiddleware, async (req: any, res: any) => {
    try {
        const projectId = parseInt(req.params.projectId);
        const id = parseInt(req.params.id);
        if (isNaN(projectId) || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid project or task ID.' });
        }
        const isProjectpresent = await prisma.project.findUnique({

            where: { id: projectId  , manager : req.user.username},
        });
        if(!isProjectpresent){
            return res.status(404).json({ error: 'Project not found. with the given user' });
        }
        const task = await prisma.task.delete({
            where: { id },
        });
        res.json(task);
    } catch (error: any) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task.', details: error.message });
    }
});



export default router;
