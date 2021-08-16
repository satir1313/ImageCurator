
//import { createRequire } from "module";
//const require = createRequire(import.meta.url);

const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve("frontend", "static")));
//app.use("/connection", express.static(path.resolve(__dirname + "frontend", "connection")));
app.use(express.static("connection"));

app.get('/login', function (req, res) {
    //login user
});

app.get('/register', function (req, res) {
    //register user
});

app.get("/*", (req, res) => {
    res.sendFile(path.resolve("frontend", "index.html"));
});
app.get("/api", (req, res) => {
    res.sendFile(path.resolve(".", "api.js"));
});


app.listen(process.env.PORT || 4056, () => console.log("Server running..."));