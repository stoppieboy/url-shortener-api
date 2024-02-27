const express = require("express")
const app = express()
app.use(express.json())

const map = new Map()

app.get('/:short_url', (req, res) => {
    const {short_url} = req.params;
    console.log(short_url);
    const long_url = map.get(short_url)
    if(!long_url){
        res.status(404).send("URL not found");
    }
    res.redirect(301, long_url)
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