// Run with: npm run seed
// Seeds a fixed set of tables for the single-restaurant assumption.
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './src/Config/db.js';
import Table from './src/Models/Table.js';

const TABLES = [
  { label: 'T1', capacity: 2 },
  { label: 'T2', capacity: 2 },
  { label: 'T3', capacity: 4 },
  { label: 'T4', capacity: 4 },
  { label: 'T5', capacity: 6 },
  { label: 'T6', capacity: 8 },
];

const run = async () => {
  await connectDB();

  for (const t of TABLES) {
    await Table.findOneAndUpdate(
      { label: t.label },
      { $setOnInsert: t },
      { upsert: true, new: true }
    );
  }

  console.log(`[seed] Seeded/verified ${TABLES.length} tables.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});