const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routers/api.js');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

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

app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 20*60*1000 // 20 mins
  }
}));

app.use(cors({
  origin:[
    'http://localhost:3000',
    'https://tutortheai.com',
    'http://tutortheai.com'],
  methods:['GET','POST'],
  credentials: true
}));
app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
})
 
app.listen(port, () => {
  console.log(`Server is running on port: ${ port }`)
})