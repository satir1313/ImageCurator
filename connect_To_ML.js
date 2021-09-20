const bodyParser = require('body-parser');
const request = require('request');
var fs = require('fs');

/*mlApp.listen(4058, () => {
    console.log(`App is running on port 4058.`);
});*/

/*request('http://localhost:9000/status', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(response.body) 
    //response.send(body);
    //app.get('/ml_connection', require('./routes'));
    console.log("in ml");
  }
});*/

const getStatus = function (req, res, next) {
    // make a request from ml server
    request('http://localhost:9000/status', function (reqe, response) {
        if (response.statusCode == 200) {
            req.body = response.body;
        }
        next();
    });

}

const getProgress = function (req, res, next) {
    // make a request from ml server
    request('http://localhost:9000/progress', function (reqe, response) {
        if (response.statusCode == 200) {
            req.body = response.body;
        }
        next();
    });
}

const trainingTest = function (req, res, next){

    // create base64 image for testing
    var imageAsBase64 = fs.readFileSync('./public/images/dog.jpg', 'base64');
    var output = `{ "${imageAsBase64} "}`;
    var jsonToUpload = JSON.stringify(output, null, "\t");

    req.body = jsonToUpload;

    next();
}


const startTraining = function (req, res, next) {

    const options = {
        method: 'POST',
        uri: 'http://localhost:9000',
        body: req.body,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    request('http://localhost:9000/progress', options,function (reqe, response) {
        if (response.statusCode == 200) {
            req.body = response.body;
        }
        next();
    });

}



module.exports = { getStatus, getProgress, startTraining, trainingTest};