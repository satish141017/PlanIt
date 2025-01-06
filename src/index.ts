import express from 'express';
import managerRoutes from './Routes/manager';
import userRoutes from './Routes/user';
import taskRoutes from './Routes/task';
import projectRoutes from './Routes/project';
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/managers', managerRoutes);

app.use('/users', userRoutes);

app.use('/tasks', taskRoutes);

app.use('/projects', projectRoutes);

app.get('/', (req : any, res : any) => {
  res.send('Welcome to the Task Manager API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});