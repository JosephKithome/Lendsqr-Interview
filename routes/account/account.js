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
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, "6smhlntk6kjbictjd78llrlp2m")
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }

        let acNo = generateAccountNumber(111111111111, 999999999999)
        let accountData = req.body
        req.userId = payload.subject
        req.body.user_id = req.userId
        req.body.accountNumber = acNo
        req.body.accountBalance = 0
        req.body.currency = 'KES'

        console.log("USER_ID::", req.body.user_id);


        try {
            //Run  a select statement to establish if a user exists
            knexDb('account')
                .where({ user_id: req.body.user_id })
                .then(async rows => {
                    if (rows.length < 1) {
                        await knexDb('account')
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
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, "6smhlntk6kjbictjd78llrlp2m")
        console.log("{PAYLOAD", payload);
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
                    if (req.body.accountNumber == rows[0].accountNumber) {

                        // Fund the account here
                        //get the balance amount
                        let existingBalance = parseInt(rows[0].accountBalance)
                        console.log(`Balance::: ${typeof (rows[0].accountBalance)}`);
                        // Update account balance
                        req.body.accountBalance = parseInt(existingBalance) + req.body.amountDeposited

                        await knexDb('account')
                            .where({ accountNumber: req.body.accountNumber })
                            .update(accountData)

                        // Transaction log history
                        // update transactions log table
                        await knexDb('transactions')
                            .insert({
                                'account_id': rows[0].id,
                                'accountNumber': req.body.accountNumber,
                                'amountDeposited': parseInt(req.body.amountDeposited)

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


// checking  account balance
accountRouter.get('/checkbalance', verifyJWT, async (req, resp) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, "6smhlntk6kjbictjd78llrlp2m")
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }
        let accountData = req.body
        req.userId = payload.subject
        req.body.user_id = req.userId


        try {
            //Run  a select statement to establish if a account exists
            knexDb
                .from('account')
                .select('accountNumber', 'accountBalance')
                .where({ user_id: req.body.user_id })
                .then(rows => {
                    console.log(rows)
                    console.log(typeof (rows))
                    resp.status(200).json(rows)
                })


        } catch (error) {
            resp.status(500).json({ message: "Error", error: error.message })
        }

    } catch (error) {
        resp.status(500).json({ message: "Error", error: error.message })
    }
})

// get account account transctions

accountRouter.get('/account_transactions/:accNo', verifyJWT, async (req, resp) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, "6smhlntk6kjbictjd78llrlp2m")
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }
        let accountData = req.body
        req.userId = payload.subject
        req.body.user_id = req.userId


        try {
            //Run  a select statement to establish if a account exists
            knexDb
                .from('account')
                .select('*')
                .leftJoin('transactions', 'account.id', 'transactions.account_id')
                .then(rows => {
                    console.log(rows)
                    console.log(typeof (rows))
                    resp.status(200).json(rows)
                })


        } catch (error) {
            resp.status(500).json({ message: "Error", error: error.message })
        }

    } catch (error) {
        resp.status(500).json({ message: "Error", error: error.message })
    }
})


//get user account details

accountRouter.get('/getAccount', verifyJWT, async (req, resp) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, "6smhlntk6kjbictjd78llrlp2m")
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }
        req.userId = payload.subject
        req.body.user_id = req.userId


        try {
            //Run  a select statement to establish if a account exists
            knexDb
                .from('account as ac')
                .select(`u.firstname`,`u.lastname`,`ac.accountNumber`, `ac.accountBalance`, `u.email`)
                .innerJoin('users as u', 'ac.user_id', 'u.id')
                .then(rows => {
                    console.log(rows)
                    console.log(typeof (rows))
                    resp.status(200).json(rows)
                })


        } catch (error) {
            resp.status(500).json({ message: "Error", error: error.message })
        }

    } catch (error) {
        resp.status(500).json({ message: "Error", error: error.message })
    }
})


module.exports = accountRouter