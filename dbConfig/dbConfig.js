require("dotenv").config();
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      port : process.env.DB_PORT,
      user : process.env.DB_USER,
      password : '',
      database : process.env.DB_NAME
    }
  });

  knex.raw("SELECT VERSION()").then(()=>{
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

module.exports =knex




  
