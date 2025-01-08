import express from 'express';
import managerRoutes from './Routes/manager';
import userRoutes from './Routes/user';
import taskRoutes from './Routes/task';
import projectRoutes from './Routes/project';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/manager', managerRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API');
});
// Global error handler
app.use((err: any, req : any, res : any, next : any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});