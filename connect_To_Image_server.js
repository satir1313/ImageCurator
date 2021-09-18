const express = require('express');
const appImage = express();
const bodyParser = require('body-parser');
var fs = require('fs');

const port = process.env.PORT || process.env.IMAGE_SERVER_PORT;

appImage.listen(port, () => {
    console.log(`App is running on port ${port}.`);
});


const uploadimage = (req, res) => {

    var imageAsBase64 = fs.readFileSync('./public/images/dog.jpg', 'base64');

    //req.body.data = { filename: "dog.jpg", image: imageAsBase64 };
    //const filename = req.body.data.filename;
    //const image = req.body.data.image;

    //console.log( " in uploadImage" + filename);

    var output = `{"filename" : "dog.jpg", "image" : ${imageAsBase64} }`;

    var jsonToUpload = JSON.stringify(output, null, "\t");
    
    res.send(jsonToUpload);
}

module.exports = {uploadimage};