//5초후에
setTimeout(()=>console.log('hi'),5000);
//5초마다
const hello = setInterval(()=>console.log('hi'),5000);
clearInterval(hello);//취소
//바로
const immediate = setImmediate(() => {console.log('hi');});
