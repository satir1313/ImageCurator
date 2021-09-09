const alert = require('alert');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const knex = require('knex');
const jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';

const config = require('./config.js')[env];
const knexDB = knex({
    client: config.client, 
    connection: {
        database: config.database,
        user: config.user,
        host: config.host,
        password: config.password,
        port: config.port,
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const { JsonWebTokenError } = require('jsonwebtoken');
const { join } = require('path/posix');
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

function signup(req, res){
    const curator = new User({
        email: req.body.email,
        password: req.body.password
    });
    //curator.save().then(()=>{res.send('OK')});
    curator.save().then(() => {
        res.redirect('/');
    }).catch(err => {
        alert(`${req.body.email} alreay exists!`);
        res.redirect('/');
    });
}


module.exports = {passport, login, signup } ;