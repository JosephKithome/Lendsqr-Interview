const express = require('express');
const { default: knex } = require('knex');
const jwt = require('jsonwebtoken')
require("dotenv").config();
const router = express.Router();
const User = require('../../models/user')
const verifyJWT = require('../../middleware/verifyJWT')

const knexDb = require("../../dbConfig/dbConfig")
const SECERET_KEY = process.env.SECRET_KEY



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
    try {
        knexDb('users')
            .where({ email: loginData.email })
            .then(async rows => {

                if (rows.length > 0) {
                    if (rows[0].email == loginData.email) {
                        if (rows[0].password == loginData.password) {

                            //Generate token
                            let payload = { subject: rows[0].id }
                            let token = jwt.sign(payload, "6smhlntk6kjbictjd78llrlp2m")
                            resp.status(200).json({ "token": token })
                        } else {
                            resp.status(400).json({ message: `Invalid password` })
                        }
                    } else {
                        resp.status(400).json({ message: `Invalid email address!` })
                    }
                } else {
                    resp.status(400).json({ message: `email does not exist!` })
                }

            })
    } catch (error) {
        resp.status(500).json({ message: "Error", error: error.message })
    }
})

router.post('/update_profile/:user_id', verifyJWT, async (req, resp) => {

    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]
    let payload = jwt.verify(token, "6smhlntk6kjbictjd78llrlp2m")
    if (!payload) {
        return resp.status(403).json({ message: `UnAuthorized Request` })
    }
    let userdata = req.body
    req.userId = payload.subject
    req.body.user_id = req.userId
    try {
        //Run  an update statement to the user with the id given
        console.log("HEREHERE");
        knexDb('users')
            .where({ user_id: req.body.user_id })
            .update(
                {
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                }
            )
            console.log("DONENNNE");
            console.log(resp.status);
        resp.status(200)
        // if(resp.status==200){
        //     knexDb
        //     .from('users')
        //     .select('*')
        //     .where({user_id: req.userId})
        //     .then(rows =>{
        //         resp.status(200).json(rows) // returns updated user data
        //     })
        // }

    } catch (error) {
        resp.status(500).json({ message: "Error updating user", error: error.message })
    }

})

module.exports = router