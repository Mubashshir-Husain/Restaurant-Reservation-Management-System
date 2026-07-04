
import 'dotenv/config';
import app from './app.js';
import connectDB from './Config/db.js';
import { startEmailScheduler } from './services/email.service.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`server Listening on port ${PORT}`);
    // Start the periodic scan (e.g. check every 5 minutes)
    startEmailScheduler(5);
  });
};

start();

process.on('unhandledRejection', (err) => {
  console.error(`server Unhandled Rejection: ${err.message}`);
  process.exit(1);
});