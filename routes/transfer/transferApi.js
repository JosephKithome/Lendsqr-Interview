const express = require('express')
const transferRouter = express.Router();

transferRouter.get('/',(req,resp)=>{
    resp.send('Transfer Api')
})

module.exports = transferRouter