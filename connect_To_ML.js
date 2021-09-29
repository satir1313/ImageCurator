const bodyParser = require('body-parser');
const request = require('request');
var fs = require('fs');
const imageServer = require('./connect_To_Image_server');

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
        else{
            req.send('<h2> Connection cannot be stablished<h2>');
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

    var imageAsBase64 = fs.readFileSync('./public/images/2.jpeg', 'base64');
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



const training = function( req, res, next) {

   //var imagePath = imageServer.getImage(req.body.filePicker);
    //console.log(req.body.filePicker);
    //req.body = imageServer.getImage(req);
    //console.log(req.body);

    //var imageAsBase64 = fs.readFileSync(req.body, 'base64');
    //var output = {image: imageAsBase64 };
    var output = req.body.filePicker;
    console.log(output);
    //imageServer.uploadImage();
    //var jsonToUpload = JSON.stringify(output);

var sending = 
    {
        image_server: "http://127.0.0.1:8000/images/",
        epochs: 10,
        finetune: false,
        images:
        [
          {
            filename: output,
            annotations:
            [
              {
                label: "moon",
                bounding_box: "0.6202205882 0.556875 0.027205882352941 0.04375"
              }
            ]
          }
        ]
      }

      var jsonToUpload = JSON.stringify(sending);

    const options = {
        url: 'http://127.0.0.1:9000/train',
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
        //console.log(response);
        next();
    });
}



module.exports = { getStatus, getProgress, startTraining, training };