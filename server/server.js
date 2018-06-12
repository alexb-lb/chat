// config
require('../config/config');

// modules
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// CORS settings
const cors = require('cors');
const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

// passport
const passport = require('passport');
const passportStrategies = require('./middleware/passportStrategies');

// controllers
const {AuthController} = require('./controllers/auth_controller');

// connect to the database and load models
const db = require('./db');
db.connect(process.env.MONGODB_URI);

// variables
const app = express();
const publicPath = path.join(__dirname, '..', 'public');

// dev logging
app.use(logger('dev'));

// secure headers and cross-origin policy
app.use(helmet());
app.use(cors(corsOptions));

// tell the app to parse HTTP body messages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// passport init
app.use(passport.initialize());
passport.use("jwt", passportStrategies.jwtStrategy());
passport.use("facebook-token", passportStrategies.facebookStrategy());

// tell the app to look for static files in these directories
app.use(express.static(publicPath));

// local authentication
app.post('/login', AuthController.login);
app.post('/register', AuthController.register);
app.post('/auth', AuthController.authenticate);

// authentication via social networks
app.post('/auth/facebook', AuthController.authenticateFacebookRequest);


app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'app.html'));
});

// Set Port, hosting services will look for process.env.PORT
app.set('port', (process.env.PORT));

const sslOptions = {
  key: fs.readFileSync('server/ssl/localhost.key'),
  cert: fs.readFileSync('server/ssl/localhost.crt')
};
const httpsServer = https.createServer(sslOptions, app);
const server = httpsServer.listen(app.get('port'), (req, res) => {
  console.log(`Server is running on port ${app.get('port')}`);
});

// app.listen(app.get('port'), () => {
//   console.log(`Server is running on port ${app.get('port')}`);
// });

module.exports = {app};