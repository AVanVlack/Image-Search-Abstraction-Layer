const express = require('express');
const path = require('path')
const router = express.Router();
const database = require('./database');
const shortid = require('shortid');
const url = require('url');


router
  //details page
  .get('/', (req, res) => {
    res.sendfile(path.join(__dirname + '/index.html'))
  })
  //retrieve requested url
  .get('/:id', (req, res, next) => {
    //get db object
    let db = database.get();
    //get db entry for id
    db.collection('urls').findOne({ _id: req.params.id }, function(err, doc) {
      if(err){return next(err);}
      if(!doc){return next(new Error("Could not find URL"));}
      //redirect browser to new url
      res.redirect(doc.url)
    });
  })

  //Add new url
  .get('/add/:newURL(*)', (req, res, next) => {
    //get db object
    let db = database.get();

    let partURL = url.parse

    if(partURL.protocol == null || partURL.hostname == null){
      return next(new Error('Please provide proper URL'))
    }
    //build new entry
    newUrl = {
      _id: shortid.generate(),
      url: res.params.newURL,
      dateAdded: new Date()
    }

    //insert url to db
    db.collection('urls').insertOne(newUrl, function(err, doc) {
      if(err){return next(err);}
      if(!doc){return next(new Error('Could not create entry'))}
      
      requestType = req.secure ? 'https://' : 'http://';
      res.json({url: requestType + req.headers.host + "/" + doc.insertedId});
    });
  });

module.exports = router;
