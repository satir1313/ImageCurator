const {Client} = require('pg');
//import pkg from 'pg';
//const {Client} = pkg;

//const client = new Client();

     //export default  class DBConnection extends Client{

            
        //client.connect();

        //setClientCredential(){
            const client =  new Client({
                host:"localhost",
                port: 5432,
                user: 'sha13',
                password: "ShieldTec2021",
                database: "shieldtec"
            });
       // }

        //connectToDB(){
            //client.connect();
       // }
        
     //}

     //export default {setClientCredential, connect };
    /*client.query('SELECT * FROM IMAGE', (err, res) =>{
        if(!err){
            console.log(res.rows);
        }else{
            console.log(err.message);
        }
        client.end;
    });*/
    module.exports = client;