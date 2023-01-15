const express = require('express');

const app = express(); 

app.use(express.json());

app.get("/api/get", (req, res) => {
    console.log(req);
    res.statusCode = 200;
    res.type('text/plain')
    res.write("Smallest Get Server");
    res.end();
});

app.listen(80, () => console.log('Server running on port 80'));