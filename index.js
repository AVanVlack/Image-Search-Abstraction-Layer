const express = require('express'),
      morgan = require('morgan'),
      app = express(),
      db = require('./database');
const router = require('./routes')

let dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/'

if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'));
}else{
  app.use(morgan('dev'));
}

db.connect(dbURI, function (err) {
    if (err) {
        console.log('Unable to connect to ' + dbURI);
        process.exit(1);
    } else {
        console.log('Connected to ' + dbURI);
        var server = app.listen(process.env.PORT || 3000, function () {
          var port = server.address().port;
          console.log("App now running on port", port);
        });
    }
});

app.use('/', router);

app.use(function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(500).send({ error: err.message });
})


// Initialize the app.
