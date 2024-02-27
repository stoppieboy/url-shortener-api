const express = require("express")
const app = express()
app.use(express.json())

const map = new Map()

app.get('/:short_url', (req, res) => {
    const {short_url} = req.params;
    console.log(short_url);
    res.redirect(map.get(short_url))
    // res.send(url).status(200);
})

app.post('/create-url', (req, res) => {
    const { url } = req.body;
    const key = `tiny${url.substring(url.length-7)}`;
    map.set(key,url);
    console.log(key);
    res.send(`This is your key: ${key}`);
})

app.get('/test/flush-map', (req, res) => {
    console.log(map);
    map.forEach((key, value) => {
        console.log(key, value);

    })
    res.send({map: [...map]});
})

app.listen(3000, ()=>console.log('server listening'));