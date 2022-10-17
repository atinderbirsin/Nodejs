import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

mongoose
  .connect(
    process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  )
  .then(() => console.log(`DB connected Successfully`))
  .catch((err) => console.log(`Error : ${err.message}`));

const __dirname = path.resolve();
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/user.json`, 'utf-8')
);

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });

    console.log(`Data added successfully`);
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log(`Database cleared successfully`);
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
