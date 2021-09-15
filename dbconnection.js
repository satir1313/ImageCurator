const { Client } = require('pg');
const config = require('./config');

function connect(){
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
    client.connect();
}




module.exports = {connect};