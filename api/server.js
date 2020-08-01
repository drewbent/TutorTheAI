const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routers/api.js');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connction established successfully');
});

app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
})
 
app.listen(port, () => {
  console.log(`Server is running on port: ${ port }`)
})