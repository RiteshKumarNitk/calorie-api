import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import foodRoutes from './routes/food';
import logRoutes from './routes/log';
import { authMiddleware } from './middleware/authMiddleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected successfully');
    const port = parseInt(process.env.PORT || '3000');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use('/auth', authRoutes);
app.use('/foods', foodRoutes); // Apply authMiddleware to specific routes in the router
app.use('/logs', logRoutes); // Apply authMiddleware to specific routes in the router
