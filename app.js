import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
dotenv.config();
const __dirname = path.resolve();
const publicDirectoryPath = path.join(__dirname, './public');

// for accessing public folder
app.use(express.static(publicDirectoryPath));

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/admin', adminRoutes);

export default app;
