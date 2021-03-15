const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

/* Route Imports Start*/
const indexRoutes = require('./routes/index.routes');
//const indexRoutes = require('./routes/index.routes');
//const usersRoutes = require('./routes/users.routes');

/* Route Imports End */

const app = express();

const corsOptions = { 
  origin : 'http://localhost:5000'
}

app.use(cors(corsOptions));

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  // Allow cross origin requests for service
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  next();
});



/* App Routes Start */
app.use('/', indexRoutes);
//app.use('/api/users', usersRoutes);

/* App Routes End */

module.exports = app;