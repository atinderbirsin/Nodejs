import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 4000;

// mongoose.set('runValidators', true);

// npm Scripts
// 1. npm run start :- to start app
// 2. npm run import :- to import users collection to db
// 3. npm run delete :- to clear users collection from db
// 4. npm run debugger :- to start debuggger

mongoose
  .connect(process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD))
  .then(() => console.log(`DATABASE connection established`))
  .catch((err) => console.log(err.message));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
