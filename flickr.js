const https = require('https');

let key = process.env.FLICKR_KEY;
let secret = process.env.FLICKR_SECRET;

const endpoint = 'https://api.flickr.com/services/rest/'


exports.searchImages = function(search, page = 1){
  const method = 'flickr.photos.search',
        per_page = '10',
        format = 'json';

  //build url
  let fURL = endpoint + "?method=" + method + '&api_key=' + key + '&text=' + search + "&per_page=" + per_page + "&page=" + page + '&format=' + format;

  //returns a Promise
  return new Promise((resolve, reject) => {
    //call request
    https.get(fURL, (res) => {
      let data = '';
      res.on('data', (part) => {
        data += part;
      });

      res.on('end', () => {

        //remove function call from string
        data = data.replace(/^\n*jsonFlickrApi\(/,'').replace(/\}\)$/,'}');
        //to json
        data = JSON.parse(data);
        //build urls and transform to final array
        let builtData = data.photos.photo.map(o => {
          let photo = buildURL(o.farm, o.server, o.id, o.secret, o.owner);
          photo.text_tags = o.title;
          return photo;
        })
        //console.log(builtData);
        resolve(builtData);
      })
    }).on('error', (e) => {
      reject(e);
    });
  })
}

//build url from data
function buildURL(farmid, serverid, photoid, secret, userid){
  let photoURL = 'https://farm' + farmid +'.staticflickr.com/'+ serverid + '/' + photoid + '_' + secret + '.jpg'
  let pageURL = 'https://www.flickr.com/photos/' + userid + '/' + photoid

  return {url: photoURL, page: pageURL};
}
