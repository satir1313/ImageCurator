const request = require('request');
const bodyParser = require('body-parser');
var fs = require('fs');
const qs = require('querystring');


const uploadImage = (req, res, next) => {

    var imageAsBase64 = fs.readFileSync('./public/images/2.jpeg', 'base64');

    var output = { filename: "2.jpeg", image: imageAsBase64 };
    var jsonToUpload = JSON.stringify(output);

    const options = {
        url: 'http://127.0.0.1:8000/upload',
        method: 'POST',
        body: jsonToUpload,
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'json': true,
        }
    }


    request(options, function (err, response, body) {
        req.body = response.body;
        next();
    });

}

const getImage = function (req, res){
    request('http://localhost:8000/test.jpg', function (reqe, response, next) {
        if (response.statusCode == 200) {
            req.body = response.body;
            next();
        }
    });
}




module.exports = { uploadImage, getImage };