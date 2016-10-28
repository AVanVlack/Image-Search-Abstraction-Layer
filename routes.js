const express = require('express');
const path = require('path')
const router = express.Router();
const database = require('./database');
const shortid = require('shortid');
const url = require('url');
const flickr = require('./flickr');


router
  //details page
  .get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
  })
  //get history
  .get('/history', (req, res, next) => {
    //get db object
    let db = database.get();
    let page = req.query.page - 1 || 0;
    //insert url to db
    db.collection('history').find({}, {_id: 0}).limit(10).skip(page * 10).toArray((err, doc) => {
      if(err){return next(err);}
      if(!doc){return next(new Error('No history'))}

      res.json(doc);
    });
  })
  //search images
  .get('/:search', (req, res, next) => {
    //get db object
    let db = database.get();
    //search images from flikr
    flickr.searchImages(req.params.search, req.query.page).then(data => {
      res.json(data);
    }).catch(e =>{
      return next(e);
    })

    //Add search request to history
    newEntry = {
      term: req.params.search,
      timestamp: new Date()
    }
    db.collection('history').insertOne(newEntry, (err, doc) => {
      if(err){console.error(err);}
      if(!doc){console.error("new history was not entered")}
    })
  });

module.exports = router;
