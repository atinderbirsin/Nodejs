import mongoose from 'mongoose';
import https from 'https';
import fs from 'fs';
import app from './app.js';

const PORT = process.env.PORT || 3000;

// mongoose.set('runValidators', true);

// npm Scripts
// 1. npm run start :- to start app
// 2. npm run import :- to import users collection to db
// 3. npm run delete :- to clear users collection from db
// 4. npm run debugger :- to start debuggger

const options = {
  key: fs.readFileSync('./ssl/etinventory-ssl.pem', 'utf8'),
  cert: fs.readFileSync('./ssl/etinventory-ssl.crt', 'utf8'),
  ca: fs.readFileSync('./ssl/etinventory-ssl-bundle.crt', 'utf8'),
};

const server = https.createServer(options, app);

mongoose
  .connect(process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD))
  .then(() =>
    server.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
