var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kjw15915!@",
    database: "fintech", // 데이터베이스 (스키마)
});

connection.connect();
connection.query("SELECT * FROM user", function (error, results, fields) {
    if (error) throw error;
    console.log("The solution is: ", results[0].solution);
});

connection.end();
