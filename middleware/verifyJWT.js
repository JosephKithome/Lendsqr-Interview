const { request } = require('http');
const jwt = require('jsonwebtoken')
require("dotenv").config();


// This verifies the passed bearer token and checks if its valid
const verifyJWT = (req,resp,next)=>{
    const authHeader = req.headers.authorization
    // console.log(req);
    if(!req.headers.authorization) {
        return resp.status(401).json({ message: `UnAuthorized Requestsssss` })
    }
    const token = authHeader.split(' ')[1]
    if(token=='null'){
        return resp.status(401).send({ message: `UnAuthorized RequestZZZZZ` })
    }

    let payload =jwt.verify(token,process.env.SECRET_KEY)
    if(!payload){
        return resp.status(403).json({ message: `UnAuthorized RequestJJJJS`})
    }
   
    next( req.userId)
}

module.exports = verifyJWT