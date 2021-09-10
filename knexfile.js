// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'sha13',
      password : '123456',
      database : 'shieldtec',
      port: 5432
    }
   /* client: 'pg',
    connection: {
      database: 'd9uj7lopimf0ls',
      user: 'smvrnygrdfsrdt',
      host: 'ec2-18-214-238-28.compute-1.amazonaws.com',
      password: '37df29b180ddee63f855129c89d1546b3889f8602d2d6aa922482d024d4be0f4',
      port: 5432,
      ssl: {
        rejectUnauthorized: false
      }
    }*/
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'd9uj7lopimf0ls',
      user: 'smvrnygrdfsrdt',
      host: 'ec2-18-214-238-28.compute-1.amazonaws.com',
      password: '37df29b180ddee63f855129c89d1546b3889f8602d2d6aa922482d024d4be0f4',
      port: 5432
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
