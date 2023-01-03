const express = require('express');
const { default: knex } = require('knex');
const jwt = require('jsonwebtoken')
require("dotenv").config();
const router = express.Router();
const User = require('../../models/user')
const verifyJWT = require('../../middleware/verifyJWT')

const knexDb = require("../../dbConfig/dbConfig")
const SECERET_KEY=process.env.SECRET_KEY


router.get('/', async (req, resp) => {
    resp.send('Auth Api')
})

// Create account
router.post('/register', async (req, resp) => {
    console.log("I was called");
    let userData = req.body;
    try {
        //Run  a select statement to establish if a user exists
        knexDb('users')
            .where({ email: req.body.email })
            .then(async rows => {
                console.log(rows.length);
                if (rows.length < 1) {
                    const data = await knexDb('users')
                        .insert(userData)
                        
                    resp.status(201).json(data);
                }
                else {
                    resp.status(403).json({ message: `User with email ${req.body.email} exists!` })
                }
            })
    } catch (error) {
        resp.status(500).json({ message: "Error creating new user", error: error.message })
    }

})

// login 
router.post('/login', (req, resp) => {
    let loginData = req.body
    try{
        knexDb('users')
        .where({ email: loginData.email })
        .then(async rows => {

           if(rows.length >0){
            if (rows[0].email == loginData.email) {
                if (rows[0].password == loginData.password) {

                     //Generate token
                     let payload = {subject: rows[0].id}
                     let token = jwt.sign(payload,SECERET_KEY)
                    resp.status(200).json({"token": token})
                } else {
                    resp.status(400).json({ message: `Invalid password` })
                }
            } else {
                resp.status(400).json({ message: `Invalid email address!` })
            }
           }else{
            resp.status(400).json({ message: `email does not exist!` })
           }

        })
    }catch(error){
        resp.status(500).json({ message: "Error", error: error.message })
    }
})

module.exports = router