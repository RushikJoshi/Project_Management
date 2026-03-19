import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js"
import connectDB from './src/config/db.js';
import { ensureDevSeed } from './src/config/seed.js';

const port = process.env.PORT || '5000';

async function startServer() {
  await connectDB();
  await ensureDevSeed();

  app.listen(port, () => {
    console.log('Server is listening on PORT:', port);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});
