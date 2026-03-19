import app from "./app.js"
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/db.js';

const port = process.env.PORT || '5000';

app.listen(port, () => {
  console.log("Server is listning on the PORT : ", port)
});

connectDB();