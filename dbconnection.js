const { Client } = require('pg');
//const config = require('./config');
var env = process.env.NODE_ENV || 'development';
const configure = require('./config.js')[env];
const Pool = require('pg').Pool;

function connect() {
    const client = new Client({
        connection: {
            database: configure.database,
            user: configure.user,
            host: configure.host,
            password: configure.password,
            port: configure.port,
            ssl: {
                rejectUnauthorized: false
            }
        }
    });
}


const createTable = async function () {
    const connectionString = process.env.CONNECTION_STRING;

    const pool = new Pool({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const client = await pool.connect();

    console.log("start creating tables");
    // drop databse if exist and create new database
    /* client.query('DROP DATABASE if exists shieldtec');
     client.query('CREATE DATABASE shieltec',
         (err, res) => {
             console.log(err, res);
         });*/



    // ******************* Dropping tables if exist **************************//


    client.query('DROP TABLE class',
        (err, res) => {
            console.log(err, res);
        });
    client.query('DROP TABLE layer',
        (err, res) => {
            console.log(err, res);
        });
    client.query('DROP TABLE image',
        (err, res) => {
            console.log(err, res);
        });


    // *******************  create tables **********************************//

    client.query('CREATE TABLE class(id SERIAL PRIMARY KEY, class_id int not null, class_name VARCHAR(40) not null unique);',
        (err, res) => {
            console.log(err, res);
        });

    client.query('CREATE TABLE image (id SERIAL PRIMARY KEY, image_id int not null unique, image_name VARCHAR(150) not null unique);',
        (err, res) => {
            console.log(err, res);
        });



    let createLayer = 'CREATE TABLE layer(id SERIAL, layer_id int not null PRIMARY KEY unique, image_id int not null unique, layer_name VARCHAR(40) NOT NULL, layer_x numeric(3,2), layer_y numeric(3,2)'
        + ',CONSTRAINT fk_layer FOREIGN KEY(image_id) REFERENCES image(image_id));';


    client.query(createLayer, (err, res) => {
        console.log(err, res);
    });


    console.log("finish creating tables");
}

module.exports = { connect, createTable };