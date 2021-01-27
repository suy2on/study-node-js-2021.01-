//hoisting: var, function declaration

console.log('1');
setTimeout(function(){
    console.log('2');
}, 1000);
console.log('3');

// synchronous callback 동기
 
function printImmediately(print){ //print가 콜백함수
    print();
}
printImmediately(()=> console.log('hello'));


// asynchronous callback 비동기

function printWithDelay(print, timeout){
    setTimeout(print, timeout)
}

printWithDelay(() => console.log('async'), 2000);

