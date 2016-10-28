const express = require('express'),
      morgan = require('morgan'),
      app = express(),
      db = require('./database');
const router = require('./routes');

//logging
if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'));
}else{
  app.use(morgan('dev'));
}

//connect to database and start serving.
db.connect(process.env.MONGODB_URI, function (err) {
    if (err) {
        console.log('Unable to connect to ' + dbURI);
        process.exit(1);
    } else {
        console.log('Connected to ' + process.env.MONGODB_URI);
        var server = app.listen(process.env.PORT, function () {
          var port = server.address().port;
          console.log("App now running on port", port);
        });
    }
});

//router
app.use('/', router);

//error handler
app.use(function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(500).send({ error: err.message });
});
