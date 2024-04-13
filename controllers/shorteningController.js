const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const pool = require('../db');

router.post("/", async (req, res) => {
    const { url } = req.body;
    hashed_url = crypto.createHash('shake256',{outputLength: 5}).update(url).digest('base64url');
    const result = await pool.query('INSERT INTO url_map(short_url, long_url) VALUES($1, $2) on conflict(short_url) do nothing;',[hashed_url, url]);

    // reset the sequence in case of conflict due to duplicate entry in the database.
    if(result.rows.length == 0)
        await pool.query('select setval($1, MAX(id)) from url_map;', ['url_map_id_seq']);

    res.render('get-url-page', {
        title: "Get your Mini URL",
        api_url: null,
        key: hashed_url
    });
})

module.exports = router
