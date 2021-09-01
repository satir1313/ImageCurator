
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
 //const path = require('path');
const db = require('./queries');
const port = process.env.PORT || 4056;
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const knex = require('knex');
const jwt = require('jsonwebtoken');
const knexDB = knex({client: 'pg', connection: {host : 'localhost',
                                                user : 'sha13',
                                                password : '123456',
                                                database : 'shieldtec',
                                                port: 5432 }
});

const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const { JsonWebTokenError } = require('jsonwebtoken');
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

const strategy = new JwtStrategy(ops, (payload, next) =>{
    const user = User.forge({id: payload.id}).fetch().then(res=>{
        next(null, res);
    });
});

passport.use(strategy);
app.use(passport.initialize());

app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
        'script-src': [SELF, INLINE, 'somehost.com'],
        'style-src': [SELF, 'mystyles.net'],
        'img-src': ['data:', 'images.com'],
        'worker-src': [NONE],
        'block-all-mixed-content': true
    }
}));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


// let express to access to static folders to be served in the static files like index.html
app.use(express.static('static'));
app.use(express.static('view'));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.get('/', (request, response) => {
  response.render('index.html');
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

// login user
app.get('/login', (req, res) => {
    res.send('User Logged in successfully');
  });

app.post('/login', (req, res) =>{
    if(!req.body.email || !req.body.password){
        return res.status(401).send('no fields');
    }
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(()=>{res.send('OK')});
});


// sign up user
app.get('/siugnup', (req, res) => {
    res.send('User Logged in successfully');
  });

app.post('/signup', (req, res) =>{
    console.log(req.body.password);
    if(!req.body.email || !req.body.password){
        return res.status(401).send('fields empty');
    }
    const curator = new User({
        email: req.body.email,
        password: req.body.password
    });
    curator.save().then(()=>{res.send('OK')});
});


app.post('/getToken', (req, res) =>{
    console.log(req.body.email);
    if(!req.body.email || !req.body.password){
        return res.status(401).send('password failed');
    }

    User.forge({email: req.body.email}).fetch().then(result =>{
        if(!result){
            return res.status(401).send('user not found');
        }
        result.authenticate(req.body.password).then(user => {
             const payload = {id: user.id};
             const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
             res.send(token);
         }).catch(err => {
            return res.status(401).send({err: err});
         });
    });
});

app.get('/protected', passport.authenticate('jwt', {session: false, }),  (req, res) =>{
    res.send("protected");
})