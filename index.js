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

const alert = require('alert');

const lg = require('./login');
const register = require('./register');


app.use((lg.passport).initialize());

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


;

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
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

// TODO remove to let loggedin user see the page
/*app.get('/annotate', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/annotate.html'));
});*/


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

// login user
app.get('/login', (req, res) => {
    res.send('User Logged in successfully');
});

app.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(401).send('password failed');
    }

    lg.login(req, res);
});

/*app.get('/protected', passport.authenticate('jwt', {session: false, }),  (req, res) =>{
    res.send("protected");
})*/

