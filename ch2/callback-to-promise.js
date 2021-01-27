 
 const loginUser = (id, password) => { return new Promise((resolve, reject)=>{
    setTimeout(() => {
        if(
            (id==='su'&& password ==='dream')||
            (id==='coder'&& password === 'academy')
        ){
            resolve(id);
        } else {
            reject(new Error('not found'));
        }

    }, 2000);
 })
}

 const getRoles = (user) => { return  new Promise((resolve,reject)=>{
    setTimeout(() => {
        if(user==='su'){
            resolve({name:'su', role: 'admin'});

        }else{
            reject(new Error('no access'));

            }
 }, 1000);


 })
}

const id = prompt('enter your id');
const password = prompt('enter your password');
loginUser(id, password)
.then(name => getRoles(name))
.then(user => alert(`Hello ${user.name}, you have a ${user.role} role`))
.catch(error => console.log(error))