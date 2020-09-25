const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
var jwt = require("jsonwebtoken"); //암호화된 토큰을 사용하기 위한 모듈
var tokenKey = "1dksjf3324!#2wqjfajdf^$";
var auth = require("./lib/auth"); // auth 미들웨어 등록

//Todo: MYSQL 커넥터 추가
var mysql = require("mysql");
const { response } = require("express");
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

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/main", (req, res) => {
    res.render("main");
});

app.get("/balance", (req, res) => {
    res.render("balance");
});

app.get("/qrcode", (req, res) => {
    res.render("qrcode");
});

app.get("/qrreader", (req, res) => {
    res.render("qrreader");
});

app.get("/authText", auth, function (req, res) {
    res.json("당신은 콘텐츠 접근에 성공했습니다.");
});
//Todo: 회원 가입시 토큰을 생성해주는 페이지
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
//Todo: ajax에서 보낸 데이터를 데이터베이스에 저장
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
//Todo: 로그인 페이지 로직 구현
app.post("/login", (req, res) => {
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    console.log(userEmail, userPassword);
    connection.query("SELECT * FROM user WHERE email =?", [userEmail], (error, results, fields) => {
        if (error) throw error;
        else {
            if (results.length == 0) {
                // 이메일이 없으면
                res.json(2);
            } else {
                var storedPassword = results[0].password;
                if (storedPassword == userPassword) {
                    // 패스워드가 동일하면
                    //로그인 성공
                    //jwt 토큰 발행하기 -- jwt: 특정한 string을 특정한 규칙으로 암호화 해주는 기능이 있음
                    jwt.sign(
                        {
                            userId: results[0].id,
                            userEmail: results[0].email,
                        },
                        tokenKey,
                        {
                            expiresIn: "1d", //토큰이 유효한 시간
                            issuer: "fintech.admin",
                            subject: "user.login.info",
                        },
                        function (err, token) {
                            console.log("로그인 성공", token);
                            res.json(token);
                        }
                    );
                } else {
                    res.json("로그인 실패");
                }
            }
        }
    });
});
//Todo: 사용자 계좌정보 보내기
app.post("/list", auth, (req, res) => {
    //https://testapi.openbanking.or.kr/v2.0/user/me url에 Request 요청하기
    var userId = req.decoded.userId;
    //{ 토큰에 담겨있는 사용자 정보
    // "userId": 6,
    // "userEmail": "test@test.com",
    // "iat": 1600921603,
    // "exp": 1601008003,
    //"iss": "fintech.admin",
    //"sub": "user.login.info"
    //}

    connection.query("SELECT * FROM user WHERE id = ?", [userId], function (error, results) {
        if (error) throw error;
        else {
            var option = {
                method: "GET",
                url: "https://testapi.openbanking.or.kr/v2.0/user/me",
                headers: {
                    Authorization: "Bearer " + results[0].accesstoken,
                },
                //accesstoken 입력
                //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
                qs: {
                    user_seq_no: results[0].userseqno,
                    //#자기 키로 시크릿 변경
                },
            };
            request(option, function (err, response, body) {
                var resResult = JSON.parse(body);
                console.log(resResult);
                //json 문서를 파싱하여 javascript 오브젝트로 변환
                res.json(resResult);
            });
        }
    });
});

//Todo: 잔액 조회 페이지
app.post("/balance", auth, (req, res) => {
    var userId = req.decoded.userId; // decode를 사용하기 위해 auth 미들웨어를 사용해야한다.
    var countnum = Math.floor(Math.random() * 1000000000) + 1; // 은행 고유 이용 번호 로직
    var transId = "T991659630U" + countnum; //이용기관번호 본인 것 입력
    var finusenum = req.body.fin_use_num;
    //사용자 정보를 바탕으로 request 요청을 만들기 url https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num
    connection.query("SELECT * FROM user WHERE id = ?", [userId], function (error, results) {
        if (error) throw error;
        else {
            var option = {
                method: "GET",
                url: "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
                headers: {
                    Authorization: "Bearer " + results[0].accesstoken,
                },
                //accesstoken 입력
                //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
                qs: {
                    bank_tran_id: transId,
                    fintech_use_num: finusenum,
                    tran_dtime: "20200924143600",
                    //#자기 키로 시크릿 변경
                },
            };
            request(option, function (err, response, body) {
                var resResult = JSON.parse(body);
                console.log(resResult);
                //json 문서를 파싱하여 javascript 오브젝트로 변환
                res.json(resResult);
            });
        }
    });
});

//Todo: 계좌 잔액 조회 시 밑에 거래 내역 조회 정보를 보내주는 라우터 (balance 주소에 밑에 리스트로 나옴)
app.post("/transactionlist", auth, (req, res) => {
    var userId = req.decoded.userId;
    var countnum = Math.floor(Math.random() * 1000000000) + 1; // 은행 고유 이용 번호 로직
    var transId = "T991659630U" + countnum; //이용기관번호 본인 것 입력
    var finusenum = req.body.fin_use_num;

    connection.query("Select * from user where id = ?", [userId], (error, results) => {
        var option = {
            url: "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
            method: "GET",
            headers: {
                Authorization: "Bearer" + results[0].accesstoken,
            },
            qs: {
                bank_tran_id: transId,
                fintech_use_num: finusenum,
                inquiry_type: "A",
                inquiry_base: "D",
                from_date: "20200924",
                to_date: "20200924",
                sort_order: "D",
                tran_dtime: "20200924163500",
            },
        };

        request(option, (err, response, body) => {
            var resResult = JSON.parse(body);
            console.log(resResult);
            res.json(resResult);
        });
    });
});

//Todo: QR스캔을 이용한 출금 이체 기능
app.post("/withdraw", auth, (req, res) => {
    var userId = req.decoded.userId;
    var countnum = Math.floor(Math.random() * 1000000000) + 1; // 은행 고유 이용 번호 로직
    var countnum2 = Math.floor(Math.random() * 1000000000) + 1; // 은행 고유 이용 번호 로직
    var transId = "T991659630U" + countnum; //이용기관번호 본인 것 입력
    var transId2 = "T991659630U" + countnum2;
    var finusenum = req.body.fin_use_num;
    var reqFinusenum = req.body.to_fin_use_num;
    var amount = req.body.amount;
    connection.query("Select * from user where id = ?", [userId], (error, results) => {
        if (error) throw error;
        else {
            console.log("list에서 조회한 개인 값: ", results);
            var option = {
                url: "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
                method: "POST",
                headers: {
                    Authorization: "Bearer " + results[0].accesstoken,
                    "Content-Type": "application/json",
                },
                //Json 형태이므로 json 형식으로 데이터를 보낸다.
                json: {
                    bank_tran_id: transId,
                    cntr_account_type: "N",
                    cntr_account_num: "2982752854",
                    dps_print_content: "구매",
                    fintech_use_num: finusenum,
                    wd_print_content: "맥북 구매",
                    tran_amt: amount,
                    tran_dtime: "20200925112000",
                    req_client_name: "깜이",
                    req_client_fintech_use_num: reqFinusenum,
                    req_client_num: "1100763470",
                    transfer_purpose: "ST",
                    recv_client_name: "김정윤",
                    recv_client_bank_code: "097",
                    recv_client_account_num: "555555555555",
                },
            };
            request(option, (err, response, body) => {
                console.log(body);
            });
            /**
             * @description 입금 이체 기능 만들기
             */
            var option = {
                url: "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
                method: "POST",
                headers: {
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNjU5NjMwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNjA4Nzg2Nzg0LCJqdGkiOiJmZTM2YmY2ZC1hMDYxLTQ4NGQtOWMxNi0xMzBlYTJkMWUzMjYifQ.kZKg4xBABS-ZGpn8t1t6QwfKLdhOC4-aIHfGYPbW9Ns",
                    // 2-legged token으로 변경해야함
                    "Content-Type": "application/json",
                },
                json: {
                    cntr_account_type: "N",
                    cntr_account_num: "5639064053",
                    wd_pass_phrase: "NONE",
                    wd_print_content: "환불금액",
                    name_check_option: "on",
                    tran_dtime: "20200925150000",
                    req_cnt: "1",
                    req_list: [
                        {
                            tran_no: "1",
                            bank_tran_id: transId2,
                            fintech_use_num: reqFinusenum,
                            print_content: "쇼핑몰환불",
                            tran_amt: amount,
                            req_client_name: "홍길동",
                            req_client_fintech_use_num: finusenum,
                            req_client_num: "1100763470",
                            transfer_purpose: "ST",
                        },
                    ],
                },
            };
            request(option, (err, response, body) => {
                console.log(body);
                res.json(1);
            });
        }
    });
});

app.listen(3000);
