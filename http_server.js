var http = require("http");

http.createServer(function (req, res) {
    var body = "<html><h1>Hi MR.Youn</h1></html>";
    console.log("요청이 들어왔습니다.");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(body); // 요청에 대한 응답으로 body를 보내준다.
}).listen(3000); //3000번 포트를 사용하는 것을 의미

//* 127.0.0.1:3000 = nodejs http server의 포트 번호
//* 127.0.0.1:3306 = mysql이 사용하는 포트 번호
