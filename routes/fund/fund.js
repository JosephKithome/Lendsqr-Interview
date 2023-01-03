const express = require('express')
const fundRouter = express.Router();

fundRouter.post('/fund',(req,resp)=>{
    resp.send('Fund Api')
})

module.exports = fundRouter