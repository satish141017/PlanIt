import express from 'express';

import { PrismaClient } from '@prisma/client';
import { authTokenMiddleware , signJwt } from './middleWare/authenticatorMiddleWare';
const router = express.Router();
const prisma = new PrismaClient();

interface Manager {
  username: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
router.get('/allUsers',authTokenMiddleware,async (req: any, res: any) => {
  try {
    const name: string = req.body.name;
    const data = await prisma.manager.findMany({
      where: {
        username: { startsWith: name  },
        role: 'USER',
      },
      select: {
        username: true,
      },
    });
    res.json(data);
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to fetch users.', details: error.message });
  }
});
router.get('/',authTokenMiddleware,async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const data = await prisma.manager.findUnique({
      where: { username },
      select: {
        username: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    res.json(data);
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to fetch manager data.', details: error.message });
  }
});

router.get('/projects', authTokenMiddleware , async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const data = await prisma.manager.findUnique({
      where: { username },
      include: {
        managedProjects: {
          select: {
            name: true,
          },
        },
      },
    });
    
    if(data) res.json(data.managedProjects);
    else res.json([]);
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to fetch projects.', details: error.message });
  }
});

router.get('/tasks',authTokenMiddleware ,  async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const data = await prisma.manager.findUnique({
      where: { username },
  
      include: {
        managedProjects: {
          select: {
            tasks: true,
          },
        },
      },
    
      
    });
    if(data) res.json(data.managedProjects[0].tasks);
    else res.json([]);
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
  }
});
router.post('/signin', async (req: any, res: any) => {
  try {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const data = await prisma.manager.findUnique({
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
    const token = signJwt({ username: data.username , email : data.email , firstName : data.firstName , lastName : data.lastName });
    res.json({
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      token,
    });
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to sign in.', details: error.message });
  }
});
router.post('/signup' , async (req: any, res: any) => {
  try {
    const username : string = req.body.username;
    const email : string = req.body.email;
    const firstName : string= req.body.firstName;
    const lastName : string= req.body.lastName;
    const password : string = req.body.password;
    const data = await prisma.manager.create({
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
    const token = signJwt({ username: data.username  , email : data.email  , firstName : data.firstName , lastName : data.lastName });
    res.json({
      ...data,
      token,
    });

     
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to create manager.', details: error.message });
  }
});

router.post('/project', authTokenMiddleware , async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const project: string = req.body.projectName;
    const projectDesc: string | null = req.body.projectDesc;
    const endDate: string = new Date(req.body.endDate).toISOString(); // Ensure ISO-8601 format
    const proj = await prisma.project.create({
      data: {
        name: project,
        end: endDate,
        managerUsername: username,
        description: projectDesc,
      },
    });
    res.json(proj);
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to create project.', details: error.message });
  }
});
router.delete('/project', authTokenMiddleware , async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const projectId: number = req.body.projectId;
    const proj = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });
    res.json(proj);
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to delete project.', details: error.message });
  }
});

router.post('/task', authTokenMiddleware , async (req: any, res: any) => {
  try {
    // const username: string = req.body.username;
    const username:string = req.body.username; // this is user username not manager manager will going to come from authenticator
    const projectId: number = req.body.projectId;
    const title: string = req.body.title;
    const priority: number  = req.body.priority;
    const taskDesc: string | null = req.body.taskDesc;
    const deadline: string = new Date(req.body.endDate).toISOString(); // Ensure ISO-8601 format
    const task = await prisma.task.create({
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
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to create task.', details: error.message });
  }
});
router.delete('/task/:id', authTokenMiddleware , async (req: any, res: any) => {
  try {
    const id: number = parseInt(req.params.id);
    const task = await prisma.task.delete({
      where: {
        id,
      },
    });
    res.json(task);
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to delete task.', details: error.message });
  }
});
router.put('/task/:id', authTokenMiddleware , async (req: any, res: any) => {
  try {
    const id: number = parseInt(req.params.id);
    const taskNewDetails = req.body;
    const data: any = {};

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

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
    res.json(task);
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to update task.', details: error.message });
  }
});

export default router;
