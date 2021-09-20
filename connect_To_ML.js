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

const startTraining = function (req, res, next) {

    var imageAsBase64 = fs.readFileSync('./public/images/ball.png', 'base64');
    var output = {image: imageAsBase64 };
    var jsonToUpload = JSON.stringify(output);


    const options = {
        url: 'http://127.0.0.1:9000/detect',
        method: 'POST',
        body: jsonToUpload,
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'json': true,
        }
    }

    request(options, function (reqe, response) {
        req.body = response.body;
        next();
    });

}



module.exports = { getStatus, getProgress, startTraining };