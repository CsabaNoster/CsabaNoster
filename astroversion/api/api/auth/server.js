import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './index.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
