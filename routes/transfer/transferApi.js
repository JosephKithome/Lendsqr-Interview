const express = require('express')
const transferRouter = express.Router();
const verifyJWT = require('../../middleware/verifyJWT')

// Funding an account
transferRouter.post('/send', verifyJWT, async (req, resp) => {
    let acBalanceAmount
    try {
        const authHeader = req.headers.authorization
        console.log(req.headers.authorization);
        const token = authHeader.split(' ')[1]
        let payload = jwt.verify(token, process.env.SECRET_KEY)
        if (!payload) {
            return resp.status(403).json({ message: `UnAuthorized Request` })
        }
        let transferData = req.body
        req.userId = payload.subject
        // req.body.user_id = req.userId


        try {
            //Run  a select statement to establish if a user bank accounts exists
            knexDb('account')
                .where({ accountNumber: req.userId })
                .then(async rows => {
                    console.log(rows.length);
                    if (req.body.sourceAccountNumber == rows[0].accountNumber) {
                        accountBalance = rows[0].accountBalance
                        console.log("This is your balance", accountBalance);
                        // check if the dest account still exists
                        knexDb('account')
                            .where({ accountNumber: req.body.destAccountNumber })
                            .then(async rows => {
                                console.log(rows.length);
                                if (req.body.destAccountNumber == rows[0].accountNumber) {
                                    await knexDb('transfer')
                                        .insert(transferData)
                                    resp.status(201).send(`Confirmed.You have transferred ${req.body.amount} 
                                from account  ${req.body.sourceAccountNumberd} to  account ${req.body.destAccountNumber}`);

                                    // update account balance 
                                    //get the balance amount
                                    let existingBalance = accountBalance
                                    // deduct the amount transferred from the parent account balance
                                   remainingAccountBalance = parseInt(existingBalance) - req.body.amount

                                    await knexDb('account')
                                        .where({ accountNumber: req.body.accountNumber })
                                        .update({
                                            'accountBalance': remainingAccountBalance
                                        })

                                    // Transaction log history
                                    // update transactions log table
                                    await knexDb('transactions')
                                        .insert({
                                            'account_id': rows[0].id,
                                            'amountDeposited': req.body.amountDeposited,
                                            'accountNumber': req.body.sourceAccountNumber,
                                            'destAccountNumber': req.body.destAccountNumber,


                                        })

                                    resp.status(201).send(`Account ${rows[0].accountNumber} funded with ${req.body.amountDeposited}`);
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