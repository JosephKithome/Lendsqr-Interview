require("dotenv").config();
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: '',
        database: process.env.DB_NAME
    }
});

knex.raw("SELECT VERSION()").then(() => {
    console.log("COnnection to DB  success");
})

//   knex.schema.createTable('users',(table)=>{
//     table.increments('id')
//     table.string("name")
//     table.string("email")
//     table.string("firstname")
//     table.string("lastname")
//     table.string("password")
//   }).then(()=>{
//     console.log("Table created successfully!!");
//   }).catch((error)=>{console.log(error); throw error})
//   .finally(()=>{
//     knex.destroy();
//   })


// Account Schema
// knex.schema.createTable('account', (table) => {
//     table.increments('id').primary()
//     table.integer('user_id').unsigned().references('users.id')
//     table.string('accountNumber')
//     table.unique('accountNumber')
//     table.integer('accountBalance')
//     table.integer('amountDeposited')
//     table.string('currency')
//     table.string('accountType')
//     table.string('countryPin')
//     table.string('address')
//     table.timestamp('created_at').defaultTo(knex.fn.now())
// }).then(() => {
//     console.log("Table created successfully!!");
// }).catch((error) => { console.log(error); throw error })
//     .finally(() => {
//         knex.destroy();
//     })


//Transactions  table
// knex.schema.createTable('transactions', (table) => {
//     table.increments('id').primary()
//     table.integer('account_id').unsigned().references('account.id')
//     table.string('accountNumber')
//     table.string('destAccountNumber')
//     table.integer('amountDeposited')
//     table.timestamp('created_at').defaultTo(knex.fn.now())
//     table.string('purpose').defaultTo('Top Up')
// }).then(() => {
//     console.log("Table created successfully!!");
// }).catch((error) => { console.log(error); throw error })
//     .finally(() => {
//         knex.destroy();
//     })

// knex.schema.createTable('transfer', (table) => {
//     table.increments('id').primary()
//     table.integer('account_id').unsigned().references('account.id')
//     table.integer('sourceAccountNumber')
//     table.integer('destAccountNumber')
//     table.integer('purpose')
//     table.integer('amount')
//     table.timestamp('created_at').defaultTo(knex.fn.now())
// }).then(() => {
//     console.log("Table created successfully!!");
// }).catch((error) => { console.log(error); throw error })
//     .finally(() => {
//         knex.destroy();
//     })



module.exports = knex





