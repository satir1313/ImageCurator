const request = require('request');
const bodyParser = require('body-parser');
var fs = require('fs');
const qs = require('querystring');


const uploadImage = (req, res, next) => {

    console.log('./public/images/' + req.body.filePicker);
    var imageAsBase64 = fs.readFileSync('./public/images/' + req.body.filePicker, 'base64');

    var output = { filename: req.body.filePicker, image: imageAsBase64 };
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
        //req.body = response.body;
        console.log(response.body);
        next();
    });

}

const getImage = function (req, res, next){
    request('http://127.0.0.1:8000/images/2.jpeg', function (reqe, response) {
        if (response.statusCode == 200) {
            req.body = response.body;
            next();
        }else{
            next();
        }

    });
}




module.exports = { uploadImage, getImage };