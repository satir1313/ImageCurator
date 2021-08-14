const express = require("express");
const path = require("path");

const app = express();
app.use('/public/images/', express.static('./public/images'));
app.use("/static", express.static(path.resolve(__dirname, "js", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "static/js", "index.html"))

});

app.listen(process.env.PORT || 4051, () => console.log("Server running ..."));