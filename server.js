const express =require('express');
const  bodyParser = require('body-parser');

const PORT = 2039
const app =express()
app.use(bodyParser.json())

//Apis
const authApi =require('./routes/auth/authApi')
const transferApi = require('./routes/transfer/transferApi')
const accountRouter = require('./routes/account/account')
const fundRouter = require('./routes/fund/fund')



app.use('/auth',authApi)
app.use('/transfer',transferApi)
app.use('/account',accountRouter)
app.use('/fund',fundRouter)


app.listen(PORT,function(){
    console.log(`Server Running on port ${PORT}`);
    
})