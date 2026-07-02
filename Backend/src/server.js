import 'dotenv/config';
import app from './app.js';
import connectDB from './Config/db.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`server Listening on port ${PORT}`);
  });
};

start();

process.on('unhandledRejection', (err) => {
  console.error(`[server] Unhandled Rejection: ${err.message}`);
  process.exit(1);
});