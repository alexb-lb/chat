// modules
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// config files
const config = require('../config');

// controllers
const authController = require('./controllers/auth_controller');

// connect to the database and load models
const db = require('./db');
db.connect(config.dbUri);

// variables
const app = express();
const publicPath = path.join(__dirname, '..', 'public');

// secure headers
app.use(helmet());

// tell the app to parse HTTP body messages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

// tell the app to look for static files in these directories
app.use(express.static(publicPath));

app.post('/login', authController.login);
app.post('/register', authController.register);

/**
 * Send index.html file
 * check if user has auth token in cookie
 * if user hasn't token (new user for example), send cookie "user = false"
 * or send user info in cookie as "user = json'ed user params"
 */
app.get('*', authController.authenticate, (req, res) => {
  res.sendFile(path.join(publicPath, 'app.html'));
});

// Set Port, hosting services will look for process.env.PORT
app.set('port', (process.env.PORT || 3000));

// start the server
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});