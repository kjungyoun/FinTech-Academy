var cars = [];
var car01 = {
    name: "sonata",
    ph: "500ph",
    start: function () {
        console.log("engine is starting");
    },
    stop: function () {
        console.log("engine is stoped");
    },
};
var car02 = {
    name: "BMW",
    ph: "600ph",
    start: function () {
        console.log("engine is starting");
    },
    stop: function () {
        console.log("engine is stoped");
    },
};
cars[0] = car01;
cars[1] = car02; //cars라는 배열에 car01, car02의 객체를 담음
console.log(cars[0].name);

var cars = [car01, car02];
console.log(cars);

//? work2 두번째 요소의 이름을 출력하세요
console.log(cars[1].name);
