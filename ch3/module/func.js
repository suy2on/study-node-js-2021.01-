//const value = require('./var');
const { odd, even } = require('./var');


function checkOddOrEven(number){
    if(number % 2){
        return odd;
    }
    else{
        return even;
    }
}

console.log(checkOddOrEven(3));

// 또 넘겨주기
module.exports = checkOddOrEven;
