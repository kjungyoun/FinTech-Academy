//? loop 안에 if문 활용 예제

var car1 = {
    name: "sonata",
    ph: "500ph",
    start: function () {
        console.log("engine is starting");
    },
    stop: function () {
        console.log("engine is stoped");
    },
};

var car2 = {
    name: "bmw",
    ph: "380ph",
    start: function () {
        console.log("engine is starting");
    },
    stop: function () {
        console.log("engine is stoped");
    },
};

var car3 = {
    name: "smart",
    ph: "400ph",
    start: function () {
        console.log("engine is starting");
    },
    stop: function () {
        console.log("engine is stoped");
    },
};

var cars = [car1, car2, car3];

//? work3 자동차 배열을 순회하여 이름이 smart인 자동차를 찾으면 "find" 라고 출력하고 마력(ph) 출력하기

//Todo: es6표현의 loop
cars.map((car) => {
    if (car.name == "smart") {
        console.log("find\n 자동차의 마력은 " + car.ph);
    }
});

//Todo: 일반적인 형태의 loop
for (var i = 0; i < cars.length; i++) {
    if (cars[i].name == "smart") {
        console.log("find\n 자동차의 마력은 " + cars[i].ph);
    }
}
