const express = require('express')
const router = express.Router()
const pool = require('../db');

router.get("/:short_url", async (req, res) => {
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

module.exports = router