import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authTokenMiddleware, signJwt } from './middleWare/authenticatorMiddleWare';

const router = express.Router();
const prisma = new PrismaClient();

// interface Manager {
//   username: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;
// }


router.get('/', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const data = await prisma.manager.findUnique({
      where: { username },
      select: { username: true, email: true, firstName: true, lastName: true },
    });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch manager data.', details: error.message });
  }
});
router.post('/signin', async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
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
    const token = signJwt({ username: data.username, email: data.email, firstName: data.firstName, lastName: data.lastName });
    res.json({ username: data.username, email: data.email, firstName: data.firstName, lastName: data.lastName, token });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to sign in.', details: error.message });
  }
});

router.post('/signup', async (req: any, res: any) => {
  try {
    const { username, email, firstName, lastName, password } = req.body;
    const data = await prisma.manager.create({
      data: { username, email, firstName, lastName, password },
      select: { username: true, email: true, firstName: true, lastName: true },
    });
    const token = signJwt({ username: data.username, email: data.email, firstName: data.firstName, lastName: data.lastName });
    res.json({ ...data, token });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create manager.', details: error.message });
  }
});

router.get('/allUsers', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const name: string = req.body.name;
    const data = await prisma.manager.findMany({
      where: { username: { startsWith: name }, role: 'USER' },
      select: { username: true },
    });
    res.json(data);
  } catch (error: any) {
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
        });
        
        if(!user){
            return res.status(401).json({ error: 'Invalid password.' });
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
router.put('/update', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const email: string = req.user.email;
    const managerNewDetails = req.body;
    const data: any = {};

    if (managerNewDetails.username) {
      data.username = managerNewDetails.username;
    }
    if (managerNewDetails.firstName) {
      data.firstName = managerNewDetails.firstName;
    }
    if (managerNewDetails.lastName) {
      data.lastName = managerNewDetails.lastName;
    }

    const manager = await prisma.manager.update({
      where: { email },
      data,
    });
    res.json(manager);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update manager.', details: error.message });
  }
});

router.get('/projects', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const data = await prisma.manager.findUnique({
      where: { username },
      include: { managedProjects: { select: { id: true, name: true , description : true } } },
    });
    res.json(data ? data.managedProjects : []);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch projects.', details: error.message });
  }
});


router.get('/tasks', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const data = await prisma.manager.findUnique({
      where: { username },
      include: { managedProjects: { include: { tasks: true } } },
    });
    res.json(data ? data : []);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
  }
});

router.get('/project/:projectId/tasks', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const projectId: number = parseInt(req.params.projectId);
    const data = await prisma.manager.findUnique({
      where: { username },
      include: {
        managedProjects: {
          where: { id: projectId },
          include: { tasks: true },
        },
      },
    });
    res.json(data ? data : []);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch tasks.', details: error.message });
  }
});

router.post('/project/create', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const { projectName, projectDesc, endDate } = req.body;
    const proj = await prisma.project.create({
      data: {
        name: projectName,
        end: new Date(endDate).toISOString(),
        managerUsername: username,
        description: projectDesc,
      },
    });
    res.json(proj);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create project.', details: error.message });
  }
});
router.post('/project/:projectId/addUser', authTokenMiddleware, async (req: any, res: any) => {
  const username: string = req.user.username;
  const projectId: number = parseInt(req.params.projectId);
  const present = await prisma.manager.findUnique({
    where: { username },
    include: {
      managedProjects: {
        where: { id: projectId},
      },
    },
  });
  if(!present){
    return res.status(404).json({ error: 'Project not found by the given manager.' });
  }
  const { user } = req.body;
  const userPresent = await prisma.user.findUnique({
    where: { username: user },
  });
  if (!userPresent) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      users: { connect: { username: user } },
    },
  });
  res.json(project);

});
router.get('/project/:projectId/users', authTokenMiddleware, async (req: any, res: any) => {
  const username: string = req.user.username;
  const projectId: number = parseInt(req.params.projectId);
  const present = await prisma.manager.findUnique({
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
});


router.delete('/project/:projectId/delete', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const present = await prisma.manager.findUnique({
      where: { username },
      include: {
        managedProjects: {
          where: { id: parseInt(req.params.projectId) },
        },
      },
    });
    const projectId: number = parseInt(req.params.projectId);
    const proj = await prisma.project.delete({
      where: { id: projectId },
    });
    res.json(proj);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete project.', details: error.message });
  }
});

router.post('/project/:projectId/task/create', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const username: string = req.user.username;
    const { title, priority, taskDesc, endDate } = req.body;
    const projectId: number = parseInt(req.params.projectId);
    const task = await prisma.task.create({
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
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create task.', details: error.message });
  }
});

router.delete('/project/:projectId/task/:taskId/delete', authTokenMiddleware, async (req: any, res: any) => {
  try {
    const projectId: number = parseInt(req.params.projectId);
    const present = await prisma.manager.findUnique({
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
    const taskId: number = parseInt(req.params.taskId);
    const task = await prisma.task.delete({
      where: { id: taskId },
    });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete task.', details: error.message });
  }
});

router.put('project/:projectId/task/:id/update', authTokenMiddleware, async (req: any, res: any) => {
    try {
        const username: string = req.user.username;
        const projectId: number = parseInt(req.params.projectId);
        const taskId: number = parseInt(req.params.id);
        const projectPresnt = await prisma.manager.findUnique({
            where: { username },
            include: {
                managedProjects: {
                    where: { id: projectId },
                },
            },
        });
        if(!projectPresnt){
            return res.status(404).json({ error: 'Project not found by the given manager.' });
        }
        const data : any = {};
        if(req.body.title){
            data.title = req.body.title;
        }
        if(req.body.priority){
            data.priority = req.body.priority;
        }
        if(req.body.taskDesc){
            data.description = req.body.taskDesc;
        }
        if(req.body.endDate){
            data.deadline = new Date(req.body.endDate).toISOString();
        }
        const task = await prisma.task.update({
            where: { id: taskId },
            data,
        });
        res.json(task);

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update task.', details: error.message });
    }
    });

export default router;
