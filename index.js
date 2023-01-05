const express =require('express');
const  bodyParser = require('body-parser');

const PORT = process.env.PORT
const app =express()
app.use(bodyParser.json())

//Apis
const authApi =require('./routes/auth/authApi')
const transferApi = require('./routes/transfer/transferApi')
const accountApi = require('./routes/account/account')
const fundApi = require('./routes/fund/fund')
const withdrawApi = require('./routes/withdraw/withdawFunds')


app.use('/auth',authApi)
app.use('/transfer',transferApi)
app.use('/account',accountApi)
app.use('/fund',fundApi)
app.use('/money',withdrawApi)


app.listen(PORT,function(){
    console.log(`Server Running on port ${PORT} `);
    
})