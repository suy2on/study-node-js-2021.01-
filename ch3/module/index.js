//구조분해할당시 변수명 속성명 같아야함
const { odd, even } = require('./var');
//아닐땐 변수명 마음대로
const checkNumber = require('./func');

function checkStrOddOrEven(str){
    if (str.length % 2){
        return odd;
    }
    else{
        return even;
    }
}

console.log(checkNumber(10));
console.log(checkStrOddOrEven('hello'));
