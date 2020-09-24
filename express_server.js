const express = require("express");
const app = express();
const path = require("path");

app.set("views", __dirname + "/views"); //ejs를 사용하기 위한 디렉토리 설정
app.set("view engine", "ejs"); // ejs를 사용하기 위한 뷰 엔진 설정

app.use(express.json()); // JSON타입의 데이터를 받기 위한 설정
app.use(express.urlencoded({ extended: false })); //urlencoded의 데이터를 받기위한 설정
app.use(express.static(path.join(__dirname, "public"))); //to use static asset

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/ejsTest", (req, res) => {
    res.render("test");
});

app.get("/designTest", (req, res) => {
    // 디자인을 테스트 하기 위한 라우터
    res.render("designTest"); //designTest라는 ejs를 렌더링하여 응답으로 보내준다.
});

//Todo: 데이터를 받기 위한 라우터
app.post("/getDataTest", (req, res) => {
    var userText = req.body.userText;
    console.log(req.body);
    console.log(userText, req.body.sendTime);
    res.json("입력값은: " + userText); // 유저가 전송한 텍스트를 그대로 응답으로 보내준다.
});

app.listen(3000);
