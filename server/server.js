import app from "./app.js"
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/db.js';
import { ensureDevSeed } from './src/config/seed.js';

const port = process.env.PORT || '5000';

app.listen(port, () => {
  console.log("Server is listning on the PORT : ", port)
});

await connectDB();
await ensureDevSeed();