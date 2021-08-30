
const express = require ('express');
const bodyParser = require ('body-parser')
const app = express();

app.use(bodyParser.json());

var latestRes;


//app.listen(4056, () => {
    //console.log("Server is now listening at port 3300");
//})


//get all images
    function getQuery(getQuery){
        app.get('/api', (req, res) => {
            client.query(getQuery, (err, result) =>{
                if(!err){
                    res.send(result.rows);
                    latestRes = result.rows;
                }
            });
            client.end;
        })
    }
    function getPersons() {
        var xmlHttpRequest = new XMLHttpRequest();
    
        xmlHttpRequest.onreadystatechange = function() {
            if ( xmlHttpRequest.readyState == XMLHttpRequest.DONE && xmlHttpRequest.status == 200 ) {
                document.getElementById("persons").innerHTML = xmlHttpRequest.responseText;
            }
        };
        xmlHttpRequest.open('GET', 'http://localhost/api', true);
        xmlHttpRequest.send();
    }


    //get image by id
    app.get('/api/:id', (req, res) => {
        client.query('SELECT * FROM image where id=${req.param.id}', (err, result) =>{
            if(!err){
                res.send(result.rows);
                latestRes = result.rows;
            }
        });
        client.end;
    })

    
    // add new image
    app.post('/api', (req, res) => {
        const img = req.body;
        let insertQuery = 'insert into image(imagename, imageformat, picture, ismodified, modifiedpicture) values ($(img.imagename), $(img.imageformat), $(img.picture), $(img.ismodified), $(img.modifiedpicture)';

        client.query(insertQuery, (err ,result) => {
            if(!err){
                res.send('New image has been added to database');
            }
            else{
                console.log(err.message);
            }
        })
        client.end;
    })
