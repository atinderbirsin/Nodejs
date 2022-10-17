import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 4000;

mongoose
  .connect(
    process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  )
  .then(() => console.log(`DATABASE connection established`))
  .catch((err) => console.log(err.message));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
