import express from "express";
import './src/dotenv';
import auth from './src';

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON in request bodies
app.use(express.json());
app.use('/auth', auth);

app.listen(port, () => {
  console.log(`Auth server running on port ${port}.`);
});
