require("dotenv").config()

const express = require("express")
const app = express();
const path = require('path')
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

const SHORTENING_API_ENDPOINT = "/create-url";
const REDIRECTION_API_ENDPOINT = "/fetch";

const shorteningController = require('./controllers/shorteningController')
const redirectionController = require('./controllers/redirectionController')


// ---------- ROUTES ------------

app.use(REDIRECTION_API_ENDPOINT, redirectionController) //shortening endpoint

app.get('/api/create-url', (req, res) => {
    res.render('get-url-page', {
        title: "Get your Mini URL",
        api_url: SHORTENING_API_ENDPOINT,
        key: null,
    });
})

app.use(SHORTENING_API_ENDPOINT, shorteningController)

app.get('/api/test', (req, res) => {
    res.status(201).send("api online");
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>console.log(`server listening on port ${PORT}`));
