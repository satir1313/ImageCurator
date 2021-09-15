const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
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
const db = require('./queries');
const port = process.env.PORT || process.env.APP_PORT;
const { expressCspHeader, INLINE, NONE, SELF, UNSAFE_INLINE, ALLOW_SCRIPTS, UNSAFE_URL, DATA } = require('express-csp-header');
const cors = require('cors');
const path = require('path');
const dbClient = require('./dbconnection');

const alert = require('alert');

//const User = require('./model/user');
const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const bs = bookshelf(knexDB);
bs.plugin(securePassword);

const User = bs.Model.extend({
    tableName: 'login_user',
    hasSecurePassword: true,
});





const lg = require('./login');
const { response } = require('express');
//const register = require('./register');

dbClient.connect;

//app.use((lg.passport).initialize());

app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
        'script-src': [SELF, INLINE, UNSAFE_INLINE, ALLOW_SCRIPTS],
        'style-src': [SELF],
        'img-src': [SELF, DATA],
        'worker-src': [NONE],
        'block-all-mixed-content': true,
        'base-uri': [SELF]
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
//app.use(favicon(path.join(__dirname,'/public/images/favicon.ico')));


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


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});


app.get('/api', (req, res) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});

// sign up user
app.get('/siugnup', (req, res) => {
    res.send('User Logged in successfully');
});

app.post('/signup', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(401).redirect('/signup');
    }
    register.signup(req, res);
});


app.post('/login', (req, res, next) => {
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
            res.append('setTimeout', 1200);
            res.header("Authorization", token).sendFile(path.join(__dirname + '/view/annotate.html'));

        }).catch(err => {
            return res.status(401).send({ err: err });
        });
    });
});

const authenticateJWT = (req, res, next) => {
    alert("in auth");
    console.log(req);
    let token = req.header('Authorization');
    console.log(token);
    if (token) {
        const token = authHeader.split(' ')[1];
        console.log(token);
        jwt.verify(token, process.env.SECRET_OR_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


app.get('/annotate', authenticateJWT, (req, res) => {
    res.sendFile(path.join(__dirname + '/view/annotate.html'));
});




// login user
app.get('/login', authenticateJWT, (req, res) => {
    alert(" in get logged in in in in ");
    const token = req.headers.token;
    console.log("************************************" + token);
    if (!token) {
        let content =
            `<body style="margin: 0px;">
             <div style="width: -webkit-fill-available; height: -webkit-fill-available;">
               <div class="col-sm-12 " style="padding-top: 1em; padding-left: 1em;">
                 <h3 style="color:#666666;">Direct navigation via the browser's URL-bar forbidden!</h3>
                 <p style="color:#666666;">Please use the navigation provided by the application only.</p>
                 <a style="color:#800101; text-decoration:none; font-weight:bold;" href="#" target="_self">Back to Login</a>
               </div>
             </div>
             </body>`;
        res.send(content);
    }
    else {
        jwt.verify(token, process.env.SECRET_OR_KEY, (err, decoded) => {
            if (err) {
                res.json({ success: false, message: 'Token invalid: ' + err });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
});


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

/*app.get('/protected', passport.authenticate('jwt', {session: false, }),  (req, res) =>{
    res.send("protected");
})*/

