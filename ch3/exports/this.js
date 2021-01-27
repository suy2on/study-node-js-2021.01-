console.log(this); // {}

function a(){
    console.log(this === global);
}
a(); // true
//전역스코프에서 this는 빈객체
//함수내에서는 this는 global
