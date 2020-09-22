function multi(p1, p2) {
    return p1 * p2; //p1과 p2의 곱연산의 결과를 반환
}

//#work1 더하기, 나누기 , 빼기
const sum = (p1, p2) => {
    return p1 + p2; //p1과 p2의 덧셈의 결과를 반환
};

const minus = (p1, p2) => {
    return p1 - p2; //p1 과 p2의 뺄셈의 결과를 반환
};

const division = (p1, p2) => {
    return p1 / p2; //p1과 p2의 나눗셈의 결과를 반환
};

console.log(multi(5, 3));
console.log(sum(5, 3));
console.log(minus(5, 3));
console.log(division(5, 3));

//es6문법
const multiful = (p1, p2) => {
    return p1 * p2;
};
