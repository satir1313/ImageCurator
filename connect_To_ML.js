const mlApp = require('./index');
const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const { nextTick } = require('process');
const app = express();

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
    const result = "";
    // make a request from ml server
    request('http://localhost:9000/status', function (reqe, response) {
        if (response.statusCode == 200) {
            req.body = response.body;
        }
        next();
    });

}

const getProgress = function (req, res, next) {
    const result = "";
    // make a request from ml server
    request('http://localhost:9000/progress', function (reqe, response) {
        if (response.statusCode == 200) {
            req.body = response.body;
        }
        next();
    });

}

module.exports = { getStatus, getProgress };