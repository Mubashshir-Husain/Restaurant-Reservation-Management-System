import express from 'express';
import cors from 'cors';

import authRoutes from './Routes/auth.routes.js';
import tableRoutes from './Routes/table.routes.js';
import reservationRoutes from './Routes/reservation.routes.js';
import adminRoutes from './Routes/admin.routes.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: "https://bistroreserve.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;