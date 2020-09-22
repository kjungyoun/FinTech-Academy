const express = require("express");
const app = express();

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/hello", (req, res) => {
    // hello router 를 만듬
    res.send("Hello router");
});

app.get("/user", (req, res) => {
    // user router를 만듬
    res.send("user router");
});

app.listen(3000);
