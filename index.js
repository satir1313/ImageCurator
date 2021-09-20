var express = require('express');
var app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.POT || process.env.APP_PORT;

app.use(express.static('public'));

//Routes
app.use(require('./routers'));  //http://127.0.0.1:8000/    http://127.0.0.1:8000/about

//app.use("/user",require('./routes'));  //http://127.0.0.1:8000/user  http://127.0.0.1:8000/user/about

var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Annotating app listening at http://%s:%s", host, port)

});