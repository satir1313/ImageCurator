/*import Dashboard from "./views/Dashboard.js";
import Settings from "./views/Settings.js";
import Annotate from "./views/Annotate.js";
import AnnotateView from "./views/AnnotateView.js";

const db = require('./queries');

// @ts-ignore
//import { client } from '../../../node_modules/connection/index.js';
//const client = require ("connection");

//setClientCredential();
//connect();
//client.connect();

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}; 

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/annotate", view: Annotate },
        { path: "/annotate/:id", view: AnnotateView },
        { path: "/settings", view: Settings }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });    <script type="text/javascript" src="../api.js"></script>

    router();
});*/


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const port = process.env.PORT || 4056;
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const cors = require('cors');
//const path = require('path');


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
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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
