import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initializeDatabase } from './db/database';
import flashcardRoutes from './routes/flashcardRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// Routes
app.use('/api/flashcards', flashcardRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
