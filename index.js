require("dotenv").config()

const express = require("express")
const app = express();
const path = require('path')
const crypto = require('crypto')
const pool = require('./db');
const limiter = require('express-rate-limit')({
    windowMs: 1*60*1000,
    max: 200,
})

app.use(limiter);
app.use(express.static(__dirname+'/public'))
app.use(express.json())                         // necessary to extract body data in POST requests
app.use(express.urlencoded({extended: true}))   // necessary to take form data from the ejs template

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")



const API_URL = "/create-url";



app.get('/fetch/:short_url', async (req, res) => {
    const {short_url} = req.params;

    const result = await pool.query('SELECT long_url FROM url_map WHERE short_url=$1;', [short_url]) 
    console.log('fetch endpoint: ',result.rows);
    
    const long_url = result.rows[0].long_url;

    if(!long_url){
        res.status(404).send("URL not found");
    }else{
        res.redirect(301, long_url)
    }
})

app.get('/api/create-url', (req, res) => {
    res.render('get-url-page', {
        title: "Page",
        api_url: API_URL,
    });
})

app.post(API_URL, async (req, res) => {
    const { url } = req.body;
    const hashed_url = crypto.createHash('sha1').update(url).digest('hex');
    const key = `tiny${hashed_url.substring(hashed_url.length-7)}`;
    const result = await pool.query('INSERT INTO url_map VALUES($1, $2) on conflict(short_url) do nothing;',[key, url]);
    console.log('create url endpoint: ',result.rows);
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
