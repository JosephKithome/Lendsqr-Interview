const express = require('express')
const accountRouter = express.Router();
const jwt = require('jsonwebtoken')
require("dotenv").config();
const verifyJWT = require('../../middleware/verifyJWT')
const generateAccountNumber = require('../../middleware/accountNumberGenarator')

const knexDb = require('../../dbConfig/dbConfig')

accountRouter.post('/create', verifyJWT, async (req, resp) => {
    try {
        const authHeader = req.headers.authorization
        console.log(req.headers.authorization);
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, process.env.SECRET_KEY)
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }
        let acNo = generateAccountNumber(1000000000000, 900000000000)
        let accountData = req.body
        req.userId = payload.subject
        req.body.user_id = req.userId
        req.body.accountNumber = acNo
        req.body.accountBalance = 0
        req.body.currency = 'KES'

        try {
            //Run  a select statement to establish if a user exists
            knexDb('account')
                .where({ user_id: req.body.user_id })
                .then(async rows => {
                    console.log(rows.length);
                    if (rows.length < 1) {
                        const data = await knexDb('account')
                            .insert(accountData)

                        resp.status(201).send("Account created successfully");
                    }
                    else {
                        resp.status(403).json({ message: `You already have an account with Lendsqr.Your account Number is ${rows[0].accountNumber}` })
                    }
                })
        } catch (error) {
            resp.status(500).json({ message: "Error creating Account", error: error.message })
        }

    } catch (error) {
        resp.status(500).json({ message: "Error creating Account", error: error.message })
    }
})


// Funding an account
accountRouter.post('/fund', verifyJWT, async (req, resp) => {
    try {
        const authHeader = req.headers.authorization
        console.log(req.headers.authorization);
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, process.env.SECRET_KEY)
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }
        let accountData = req.body
        req.userId = payload.subject
        req.body.user_id = req.userId


        try {
            //Run  a select statement to establish if a account exists
            knexDb('account')
                .where({ accountNumber: req.body.accountNumber })
                .then(async rows => {
                    console.log(rows.length);
                    if (req.body.accountNumber ==rows[0].accountNumber) {

                        // Fund the account here
                        //get the balance amount
                        let existingBalance = parseInt(rows[0].accountBalance)
                        console.log(`Balance::: ${typeof(rows[0].accountBalance)}`);
                        // Update account balance
                        req.body.accountBalance =parseInt(existingBalance) + req.body.amountDeposited

                        const data = await knexDb('account')
                            .where({accountNumber: req.body.accountNumber})
                            .update(accountData)

                             // Transaction log history
                            // update transactions log table
                            await knexDb('transactions')
                            .insert({
                                'account_id': rows[0].id,
                                'accountNumber': req.body.accountNumber,
                                'amountDeposited': req.body.amountDeposited

                            })

                        resp.status(201).send(`Account ${rows[0].accountNumber} funded with ${req.body.amountDeposited}`);
                    }
                    else {
                        resp.status(403).json({ message: `Invalid account number` })
                    }
                })
        } catch (error) {
            resp.status(500).json({ message: "Error funding Account", error: error.message })
        }

    } catch (error) {
        resp.status(500).json({ message: "Error funding Account", error: error.message })
    }
})


module.exports = accountRouter