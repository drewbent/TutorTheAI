const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRouter = require('./routers/api.js');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const rateLimit = require("express-rate-limit");

const app = express();
const port = process.env.PORT || 5000;

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

// Because of https://www.npmjs.com/package/express-rate-limit
// TODO(drew): Make sure this works on AWS eb
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to X requests per windowMs
});
app.use(limiter);

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
app.use(express.static(path.join(__dirname, 'build')))

app.use('/api/v1', apiRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
 
app.listen(port, () => {
  console.log(`Server is running on port: ${ port }`)
})