require("dotenv").config()

const express = require("express")
const app = express();

app.use(express.json())

const crypto = require('crypto')
const pool = require('./db');

app.get('/:short_url', async (req, res) => {
    const {short_url} = req.params;

    const result = await pool.query('SELECT long_url FROM url_map WHERE short_url=$1;', [short_url]) 
    console.log(result.rows);
    
    const long_url = result.rows[0].long_url;

    if(!long_url){
        res.status(404).send("URL not found");
    }else{
        res.redirect(301, long_url)
    }
})

app.post('/create-url', async (req, res) => {
    const { url } = req.body;
    const hashed_url = crypto.createHash('sha1').update(url).digest('hex');
    const key = `tiny${hashed_url.substring(hashed_url.length-7)}`;
    const result = await pool.query('INSERT INTO url_map VALUES($1, $2);',[key, url]);
    console.log(result.rows);
    res.send(`This is your key: ${key}`);
})

app.get('/api/test', (req, res) => {
    res.status(201).send("api online");
})

app.get('/test/flush-map', async (req, res) => {
    const map = await pool.query('Select * from url_map;');
    console.log(map.rows);
    res.send({map: [...map.rows]});
})

app.listen(process.env.PORT||3000, ()=>console.log('server listening'));
