import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { adminRoutes, officeRoutes } from './routes/index.js';

const app = express();
dotenv.config();
const __dirname = path.resolve();
const publicDirectoryPath = path.join(__dirname, './public');

// for accessing public folder
app.use(express.static(publicDirectoryPath));

// For allow cors
const corsOrigin = {
  origin: '*',
};

app.use(cors(corsOrigin));

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/admin', adminRoutes);
app.use('/office', officeRoutes);

app.all('*', (req, res) => {
  res.status(404).json({
    status: 0,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
