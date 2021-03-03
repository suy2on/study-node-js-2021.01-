const { userInfo } = require("os");

async function getRecord() {
    try{
        const res = await axios.get('/records');
        const records = res.data;
        const list = document.getElementById('list');
        list.innerHTML = '';
        
        Object.keys(records).map( function (key) {
            const recordDiv = document.createElement('div');
            const span = document.createElement('span');
            span.textContent = records[key];
            const edit = document.createElement('button');
            edit.textContent = '수정';
            edit.addEventListener('click', async () => {
                const record = prompt('기록을 다시 입력하세요');
                if (!record){
                    return alert('기록을 반드시 입력하셔야 합니다.');
                }
                try {
                    await axios.put('/records/' + key, { record });
                    getRecord();
                } catch (err){
                    console.log(err);
                }
            });
            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.addEventListener( 'click', async () => {
                try{
                    await axios.delete('/records/' + key);
                    getRecord();
                } catch (err){
                    console.log(err);
                }
            });
            recordDiv.appendChild(span);
            recordDiv.appendChild(edit);
            recordDiv.appendChild(remove);
            list.appendChild(recordDiv);
            console.log(res.data);
        });
    } catch (err){
        console.log(err);
    }
}

window.onload = getRecord;

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const record = e.target.record.value;
    if (!record){
        return alert('기록을 입력하세요');
    }
    try {
        await axios.post('./records', { record });
        getRecord();
    } catch(err){
        console.log(err);
    }
    e.target.record.value = ''; // 입력창 다시 빈칸으로 만들어주기
})