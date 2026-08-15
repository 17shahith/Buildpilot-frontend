import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '../routes/auth';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/portal', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
