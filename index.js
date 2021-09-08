const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const port = process.env.PORT || 4056;
const { expressCspHeader, INLINE, NONE, SELF, UNSAFE_INLINE, ALLOW_SCRIPTS, UNSAFE_URL, DATA } = require('express-csp-header');
const cors = require('cors');
const path = require('path');
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
const alert = require('alert');
//require('../MyImageAnnotator-1/static/js/annotate');

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
app.use(passport.initialize());

app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
        'script-src': [SELF, INLINE, UNSAFE_INLINE, ALLOW_SCRIPTS,'https://unpkg.com'],
        'style-src': [SELF],
        'img-src': [SELF, DATA],
        'worker-src': [NONE],
        'block-all-mixed-content': true,
        'base-uri': [SELF, 'https://unpkg.com']
    }
}));



app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


// let express to access to static folders to be served in the static files like index.html
app.use(express.static('static'));
app.use(express.static('view'));
app.use(express.static('public'));
app.use(express.static('public/images'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect js bootstrap
app.use('/dist', express.static(__dirname + '/node_modules/jquery/dist/')); // redirect CSS jquery
//app.use('/markerjs2' , express.static(__dirname + '/node_module/markerjs2/'));
app.use(express.static('bundle'));
app.use(express.static('dist'));



app.get('/', (request, response) => {
    response.render('index.html');
});

// TODO remove to let loggedin user see the page
app.get('/annotate', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/annotate.html'));
});
/*app.get('/dashboard', (req, res) =>{
    res.sendFile(path.join(__dirname + '/view/index.html'));
    //res.send("this is working!");
});*/

app.get('/api', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/api/images', db.getImages);
app.get('/api/image/:id', db.getImageById);
app.get('/api/users', db.getUsers);
app.get('/api/user/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

app.listen(port, () => {
    console.log(`App is running on port ${port}.`);
});

// sign up user
app.get('/siugnup', (req, res) => {
    res.send('User Logged in successfully');
});

app.post('/signup', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(401).redirect('/signup');
    }
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
});

// login user
app.get('/login', (req, res) => {
    res.send('User Logged in successfully');
});

app.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(401).send('password failed');
    }

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
});

/*app.get('/protected', passport.authenticate('jwt', {session: false, }),  (req, res) =>{
    res.send("protected");
})*/

