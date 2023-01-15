const fetch = require('node-fetch');

const url = 'http://localhost:80/api/get';
const res = fetch(url).then(res => {
    // console.log(res);
    res.text().then(txt => {
        console.log(txt);
    })
})
