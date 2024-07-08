// library requires
require("dotenv").config()
const express = require("express")
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')

// custom requires
const limiter = require('express-rate-limit')({
    windowMs: 1 * 60 * 1000,
    max: 200,
})
const shorteningController = require('./controllers/shorteningController')
const redirectionController = require('./controllers/redirectionController')

// constants
const app = express();
const SHORTENING_API_ENDPOINT = "/create-url";
const REDIRECTION_API_ENDPOINT = "/fetch";
const PORT = process.env.PORT || 3000

// middlewares
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(limiter);
app.use(express.static(__dirname + '/public'))
app.use(express.json())                         // necessary to extract body data in POST requests
app.use(express.urlencoded({ extended: true }))   // necessary to take form data from the ejs template

// views
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// ---------- ROUTES ------------

app.use(REDIRECTION_API_ENDPOINT, redirectionController) //shortening endpoint

app.get('/', (req, res) => {
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

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
