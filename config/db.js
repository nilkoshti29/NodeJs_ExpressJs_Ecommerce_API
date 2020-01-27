
var mysql = require('mysql');

//db Connection start

var connection = mysql.createConnection({

  host    : 'localhost',
  user    : 'root',
  password : '',
  database : 'my_dbecommerce'
});

connection.connect(function(err){

  if(!err){
    console.log("Database connected");
  }else{
    console.log("Error Database connecting");
  };
});
//db End

 
module.exports = connection;