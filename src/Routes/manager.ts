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

router.post('/' , async (req: any, res: any) => {
  try {
    const username : string = req.body.username;
    const email : string = req.body.email;
    const firstName : string= req.body.username;
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

router.post('/projects', authTokenMiddleware , async (req: any, res: any) => {
  try {
    const username: string = req.body.username;
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

router.post('/task', authTokenMiddleware , async (req: any, res: any) => {
  try {
    // const username: string = req.body.username;
    const username:string = req.body.username; // this is user username not manager manager will going to come from authenticator
    const projectId: number = req.body.projectId;
    const title: string = req.body.title;
    const taskDesc: string | null = req.body.taskDesc;
    const deadline: string = new Date(req.body.endDate).toISOString(); // Ensure ISO-8601 format
    const task = await prisma.task.create({
      data: {
        title,
        deadline,
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

export default router;
