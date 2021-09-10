const dotenv = require('dotenv');
dotenv.config();

const configure = {
    development: {
        //url to be used in link generation
        //url: 'http://my.site.com',
        //mongodb connection settings

        client: 'pg',
        database: 'shieldtec',
        user: 'sha13',
        host: 'localhost',
        password: '123456',
        port: 5432,
        ssl: {
            rejectUnauthorized: false
        },
    //server details
    server: {
        host: '127.0.0.1',
        port: '3422'
    }

},
    production: {
        //url to be used in link generation
        //url: 'http://my.site.com',
        //mongodb connection settings
        client: 'pg',
        connection: {
            database: 'd9uj7lopimf0ls',
            user: 'smvrnygrdfsrdt',
            host: 'ec2-18-214-238-28.compute-1.amazonaws.com',
            password: '37df29b180ddee63f855129c89d1546b3889f8602d2d6aa922482d024d4be0f4',
            port: 5432,
            ssl: {
                rejectUnauthorized: false
            }
        },
        //server details
        server: {
            host: '127.0.0.1',
            port: '3421'
        }
    }
};

module.exports = configure;