const express = require('express')
const jwt = require('jsonwebtoken')
const transferRouter = express.Router();
const verifyJWT = require('../../middleware/verifyJWT')
const knexDb = require('../../dbConfig/dbConfig')

// Funding an account
transferRouter.post('/send', verifyJWT, async (req, resp) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, "6smhlntk6kjbictjd78llrlp2m")
        console.log("{PAYLOAD",payload);
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }
        let transferData = req.body
        req.userId = payload.subject

        console.log(`TOKEN::: ${req.userId}`)

        req.body.user_id = req.userId


        try {
            //Run  a select statement to establish if a user bank accounts exists
            knexDb('account')
                .where({ user_id: req.userId }) //Runs  a query to  get the logged in user bank account
                .then(async rows => {
                    console.log(`AC NO:: ${rows[0].accountNumber}`);
                    // checks whether the provided payloads number matches the on the request
                    if (req.body.sourceAccountNumber == rows[0].accountNumber) {

                        accountBalance = rows[0].accountBalance // Gets existing account balance for source
                        console.log("This is your balance", accountBalance);

                        // check if the dest account still exists
                        knexDb('account')
                            .where({ accountNumber: req.body.destAccountNumber })
                            .then(async rows => {

                                console.log(`DESTBANK::: ${rows[0].accountNumber}`);
                                
                                let destAccountBalance = rows[0].accountBalance
                                console.log(`DESTBANKBALANCE::: ${destAccountBalance}`);

                                if (req.body.destAccountNumber == rows[0].accountNumber) {

                                    //Make bank transfer 
                                    await knexDb('transfer')
                                        .insert({
                                           'amount': req.body.amount,
                                           'destAccountNumber': req.body.destAccountNumber,
                                           'sourceAccountNumber': req.body.sourceAccountNumber,
                                           'purpose': 'Fund Transfer',


                                        })
                                    resp.status(201).send(`Confirmed.You have transferred ${req.body.amount} 
                                from account  ${req.body.sourceAccountNumber} to  account ${req.body.destAccountNumber}`);

                                    // update account balance 
                                    //get the balance amount
                                    let existingBalance = accountBalance
                                    console.log(`EXISTING:: ${existingBalance}`);
                                    // deduct the amount transferred from the parent account balance
                                    remainingAccountBalance = parseInt(existingBalance) - req.body.amount
                                    console.log(`AMOUNTGER:: ${remainingAccountBalance}`);

                                    await knexDb('account')
                                        .where({ accountNumber: req.body.sourceAccountNumber })
                                        .update({
                                            'accountBalance': remainingAccountBalance
                                        })

                                        // Update the destination bank account
                                        await knexDb('account')
                                        .where({ accountNumber: req.body.destAccountNumber })
                                        .update({
                                            'accountBalance': destAccountBalance + req.body.amount
                                        })

                                    // Transaction log history
                                    // update transactions log table
                                    await knexDb('transactions')
                                        .insert({
                                            'account_id': rows[0].id,
                                            'amountDeposited': req.body.amountDeposited,
                                            'accountNumber': req.body.sourceAccountNumber,
                                            'destAccountNumber': req.body.destAccountNumber,
                                            'purpose': 'MONEY TRANSFER'


                                        })

                                } else {
                                    resp.status(403).json({ message: `Invalid account number` })
                                }
                            })
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


module.exports = transferRouter