const alert = require('alert');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const knex = require('knex');
const jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';
const configure = require('./config.js')[env];
const knexDB = knex({
    client: configure.client, 
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


const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const bs = bookshelf(knexDB);
bs.plugin(securePassword);

const User = bs.Model.extend({
    tableName: 'login_user',
    hasSecurePassword: true,
});

const ops = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY
}

const strategy = new JwtStrategy(ops, (payload, next) => {
    const user = User.forge({ id: payload.id }).fetch().then(res => {
        next(null, res);
    });
});

passport.use(strategy);

function login(req, res){
    User.forge({ email: req.body.email }).fetch().then(result => {
        if (!result) {
            return res.status(401).send('user not found');
        }
        result.authenticate(req.body.password).then(user => {
            const payload = { id: user.id };
            const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
            //res.send(token);
            res.redirect('/annotate');
        }).catch(err => {
            return res.status(401).send({ err: err });
        });
    });
}


module.exports = {passport, login } ;