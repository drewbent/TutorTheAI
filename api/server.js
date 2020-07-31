const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const apiRouter = require('./api.js');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
})
 
app.listen(port, () => {
  console.log(`Server is running on port: ${ port }`)
})