//State: pending -> fulfilling or rejeted



// 1. Producer
// when new Promise is created, the executor runs automatically
const promise = new Promise((resolve, reject)=>{
	//doing some heavy work (network, read file)
	console.log('doing something...');
	setTimeout(()=>{
		//reject(new Error('no network')) 실패시
		//resolve('성공') 성공시
	},2000);
});

// 2. Consumers : then, catch, finally
promise
.then((value) => { //이때 value는 resolve안에 있는 매개변수
	console.log(value);
})
.catch((error) =>{
	console.log(error);
})
.finally(()=> {  //무조건 실행되는 함수
	console.log('finally');
});

// 3. Promise chain
const fetchNumber = new Promise((resolve, reject)=>{
	setTimeout(()=> resolve(1),1000);
});

fetchNumber
.then(num => num * 2)
.then(num => num * 3)
.then(num => {
	 return new Promise((resolve, reject)=> {
		setTimeout(() => resolve(num-1),1000);
	}); //promise 전달가능

})
.then(num => console.log(num));


// 4. Error Handling
//.then
//.catch
//.then  가능
