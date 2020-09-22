//? for 구문 연습

var cars = ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi"];
var text = "";
var i;
for (i = 0; i < cars.length; i++) {
    text += cars[i] + "\n";
}

//위 코드를 es6로 표현하는 방법
cars.map((car) => {
    console.log(car);
});

console.log(text);
