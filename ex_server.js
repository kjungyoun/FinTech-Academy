const express = require("express");
const app = express();
const path = require("path");
const request = require("request");

//MYSQL 커넥터 추가
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kjw15915",
    database: "fintech", // 데이터베이스 (스키마)
});

connection.connect();

app.set("views", __dirname + "/views"); //ejs 를 사용하기위한 디렉토리 설정
app.set("view engine", "ejs"); //ejs 를 사용하기위한 뷰 엔진 설정

app.use(express.json()); // JSON 타입의 데이터를 받기위한 설정
app.use(express.urlencoded({ extended: false })); // urlencoded 타입의 데이터를 받기위한 설정

app.use(express.static(path.join(__dirname, "public")));
//to use static asset 디자인 파일 위치를 정의

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.get("/authResult", function (req, res) {
    var authCode = req.query.code;
    console.log(authCode);

    var option = {
        method: "POST",
        url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        form: {
            code: authCode,
            client_id: "H18thNyY8r0KNlfQdY1Q16LEJhSwX98N1BjvkGc4",
            client_secret: "OjrfnBwn2XtHzkAafYcyH8nXHCoYHZSQuWjWFa3h",
            redirect_uri: "http://localhost:3000/authResult",
            grant_type: "authorization_code",
            //본인 키로 시크릿 변경
        },
    };

    request(option, function (error, response, body) {
        var accessRequestResult = JSON.parse(body); //JSON 오브젝트를 JS 오브젝트로 변경
        console.log(accessRequestResult);
        res.render("resultChild", { data: accessRequestResult });
    });
});

app.post("/signup", function (req, res) {
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var userAccessToken = req.body.userAccessToken;
    var userRefreshToken = req.body.userRefreshToken;
    var userSeqNo = req.body.userSeqNo;
    console.log(userName, userEmail, userPassword);
    connection.query(
        "INSERT INTO `user`(`name`,`email`,`password`,`accesstoken`,`refreshtoken`,`userseqno`)VALUES(?,?,?,?,?,?);",
        [userName, userEmail, userPassword, userAccessToken, userRefreshToken, userSeqNo],
        function (error, results, fields) {
            if (error) throw error;
            else {
                res.json(1);
            }
        }
    );
});

app.listen(3000);
