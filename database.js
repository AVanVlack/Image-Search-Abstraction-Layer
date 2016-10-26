const MongoClient = require('mongodb').MongoClient;

//db object
let state = {
  db: null
};

//connect to db
exports.connect = function (url, done) {
  if (state.db)
    return done();

  MongoClient.connect(url, function (err, db) {
    if (err)
      return done(err);
    state.db = db;
    done();
  })
}

//get db object
exports.get = function () {
  return state.db;
}

//close connection
exports.close = function (done) {
  console.log('db close');
  if (state.db) {
    state.db.close(function (err, result) {
      state.db = null;
      done(err);
    })
  }
}
