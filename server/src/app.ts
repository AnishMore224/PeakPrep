import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import authRoutes from './routes/auth';
import getDetailsRoutes from './routes/details';
import adminRoutes from './routes/adminControls';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/getDetails", getDetailsRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript!');
});

mongoose.connect(process.env.DBURI as string)
  .then(() => {
    console.log('Connected to Database !')
    app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT}/`);
    });
  })
  .catch(err => console.error(err));