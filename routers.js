const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
//const router = express();
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
const { expressCspHeader, INLINE, NONE, SELF, UNSAFE_INLINE, ALLOW_SCRIPTS, UNSAFE_URL, DATA } = require('express-csp-header');
const cors = require('cors');
const path = require('path');
const dbClient = require('./dbconnection');
const alert = require('alert');
const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const bs = bookshelf(knexDB);
const imageServer = require('./connect_To_Image_server');
const mlServer = require('./connect_To_ML');
var fs = require('fs');


bs.plugin(securePassword);

const User = bs.Model.extend({
    tableName: 'login_user',
    hasSecurePassword: true,
});

const { response } = require('express');

dbClient.connect;

/*router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });*/

router.use(expressCspHeader({
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



router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());


// let express to access to static folders to be served in the static files like index.html
router.use(express.static('static'));
router.use(express.static('view'));
router.use(express.static('public'));
router.use(express.static('public/images'));
router.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
router.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect js bootstrap
router.use('/dist', express.static(__dirname + '/node_modules/jquery/dist/')); // redirect CSS jquery
router.use(express.static('bundle'));
router.use(express.static('dist'));
router.use(express.static('src'));
//router.use(favicon(path.join(__dirname,'/public/images/favicon.ico')));


router.get('/api/images', db.getImages);
router.get('/api/image/:id', db.getImageById);
router.get('/api/users', db.getUsers);
router.get('/api/user/:id', db.getUserById);
router.post('/users', db.createUser);
router.put('/users/:id', db.updateUser);
router.delete('/users/:id', db.deleteUser);

//router.listen(port, () => {
//console.log(`router is running on port ${port}.`);
//});


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});


router.get('/api', (req, res) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});

// sign up user
router.get('/siugnup', (req, res) => {
    res.send('User Logged in successfully');
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

router.post('/signup', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(401).redirect('/signup');
    }
    const curator = new User({
        email: req.body.email,
        password: req.body.password,
        login_time: new Date().toISOString()
    });
    //curator.save().then(()=>{res.send('OK')});
    curator.save().then(() => {
        res.redirect('/');
    }).catch(err => {
        alert(`${req.body.email} alreay exists!`);
        res.redirect('/');
    });
});


router.post('/login', (req, res, next) => {
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
            const login_time = new Date().toISOString();
            db.updateUserByID(req.body.email, login_time, user.id);
            res.append('setTimeout', 1200);
            res.header("Authorization", token).sendFile(path.join(__dirname + '/view/annotate.html'));

        }).catch(err => {
            return res.status(401).send({ err: err });
        });
    });
});

const authenticateJWT = (req, res, next) => {
    alert("in auth");
    let token = req.header('Authorization');
    if (token) {
        const token = authHeader.split(' ')[1];

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


router.get('/annotate', authenticateJWT, (req, res) => {
    res.sendFile(path.join(__dirname + '/view/annotate.html'));
});




// login user
router.get('/login', authenticateJWT, (req, res) => {
    alert(" in get logged in in in in ");
    const token = req.headers.token;

    if (!token) {
        let content =
            `<body style="margin: 0px;">
             <div style="width: -webkit-fill-available; height: -webkit-fill-available;">
               <div class="col-sm-12 " style="padding-top: 1em; padding-left: 1em;">
                 <h3 style="color:#666666;">Direct navigation via the browser's URL-bar forbidden!</h3>
                 <p style="color:#666666;">Please use the navigation provided by the routerlication only.</p>
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


router.get('/ml_connection', (req, res) => {
    res.send(`<h2> To check status of ML <h2>
                <h3> /ml_connection/status <h3>
                <br />
                <h2> To retrieve the progress of the API's training <h2>
                <h3> /ml_connection/progress<h3>
                <br />
            `);
});

router.get('/ml_connection/status', mlServer.getStatus, (req, res) => {
    res.send(`<h2> Connected To ML Server <h2>
                the body of message is ${req.body}
            `);
});

router.get('/ml_connection/progress', mlServer.getProgress, (req, res) => {
    res.send(`<h2> Connected To ML Server <h2>
                the body of message is ${req.body}
            `);
});

router.get('/ml_connection/detect', mlServer.startTraining, (req, res) => {

    // Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ...
    const buffer = Buffer.from(req.body, "base64");

    const image = fs.writeFileSync('./public/images/new.jpg', buffer);

    router.use(express.static('./public/images/new.jpg'));

    var imgPath = './public/images/Image.jpg'

    res.send(`<h2> Connected To ML Server <h2> <p>${req.body}</p>`);
});


router.get('/image_server/upload', imageServer.uploadImage, (req, res) => {

    res.send(`<h2> Connected To ML Server <h2>  <p>${req.body}</p>`);
});

router.get('/image_server/get_image', imageServer.getImage, (req, res) => {

    res.send(`<h2> Connected To ML Server <h2>  <p>${req.body}</p>`);
});


/*router.get('/protected', passport.authenticate('jwt', {session: false, }),  (req, res) =>{
    res.send("protected");
})*/


module.exports = router;