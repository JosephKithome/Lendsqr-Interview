const express = require('express')
const withDrawRouter = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config();
const verifyJWT = require('../../middleware/verifyJWT')
const knexDb = require('../../dbConfig/dbConfig')


withDrawRouter.post('/withdraw', verifyJWT, async (req, resp) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, "6smhlntk6kjbictjd78llrlp2m")
        console.log("{PAYLOAD", payload);
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }
        req.userId = payload.subject

        // Query the account of the user to withdraw money from
        await knexDb('account')
            .where({ user_id: req.userId })
            .then(async rows => {
                console.log(`AC NO:: ${rows[0].accountNumber}`);

                //Withdraw funds
                let accountBal = rows[0].accountBalance
                console.log(`Balance::: ${accountBal}`);

                let amount = accountBal - req.body.amount
                
                await knexDb('account')
                    .where({ accountNumber: req.body.sourceAccountNumber })
                    .update({
                        'accountBalance': amount
                    })


                // Transaction log history
                // update transactions log table
                data = knexDb('transactions')
                    .insert({
                        'account_id': rows[0].id,
                        'amountDeposited': req.body.amountDeposited,
                        'accountNumber': req.body.sourceAccountNumber,
                        'destAccountNumber': req.body.destAccountNumber,
                        'purpose': 'WITHDRAW'

                    })


            })
        return resp.json(data)

    }
    catch (error) {
        resp.status(500).json({ message: "Error funding Account", error: error.message })
    }

})

module.exports = withDrawRouter