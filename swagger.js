const swaggerAutogen = require("swagger-autogen")()
const outputFile = "./documentation/swagger_output.json";




const endpoints = [
    './routes/account/account',
    './routes/auth/authApi',
    './routes/transfer/transferApi',
    './routes/withdraw/withdrawFunds'



]

swaggerAutogen(outputFile, endpoints)