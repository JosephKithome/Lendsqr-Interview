const express =require('express');
require("dotenv").config();
const  bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./documentation/swagger_output.json")

const PORT = process.env.PORT || 2039
const app =express()
app.use(bodyParser.json())

//Apis
const authApi =require('./routes/auth/authApi')
const transferApi = require('./routes/transfer/transferApi')
const accountApi = require('./routes/account/account')
const fundApi = require('./routes/fund/fund')
const withdrawApi = require('./routes/withdraw/withdrawFunds')


// app.use('/auth',authApi)
// app.use('/transfer',transferApi)
// app.use('/account',accountApi)
// app.use('/fund',fundApi)
// app.use('/money',withdrawApi)

app.use('/' , swaggerUi.serve, swaggerUi.setup(swaggerFile));





app.listen(PORT,function(){
    console.log(`Server Running on port ${PORT} `);
    
})


module.exports= app