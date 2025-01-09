import express from 'express';
import cors from 'cors';
import managerRoutes from './Routes/manager';
import userRoutes from './Routes/user';
require('dotenv').config();
const app = express();


app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/manager', managerRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API');
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});