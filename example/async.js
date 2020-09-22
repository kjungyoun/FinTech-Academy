//? 비동기 예제 코드

var fs = require("fs");
console.log("first func");

fs.readFile("exam/test.txt", "utf8", function (err, result) {
    if (err) {
        console.error(err);
        throw err;
    } else {
        console.error("second func");
        console.log(result);
    }
});

console.log("third func");
