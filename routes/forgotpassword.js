var express = require('express');
var router = express.Router();

var db = require('../config/db');
//var Response = require('../config/response');

/* GET Product listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

// Forgot Password 
/*
router.get('/', function(req, res, next) {
    res.render('forgotpassword');
  });
  
  router.post('/forgotpassword-process',function(req,res,next){
  
      var forgotemail = req.body.forgotemail;
      console.log(forgotemail);
      req.session.mysessionforgotemail=forgotemail;
  
      console.log("Email value is" + req.session.mysessionforgotemail);
      res.redirect("/forgot-password"); 
  });
  
  router.get('/forgot-password',function(req,res,next){
  
      if(req.session.mysessionforgotemail){
          var forgotemail = req.session.mysessionforgotemail;
          
          res.render('forgot-password',{myemail : forgotemail});
      }else{
          res.redirect('/forgotpassword');
      }
  });
  */
//Forgot Password using DataBase 

//forgot Password API
/*
router.post('/forgot-password-api',function(req,res,next){

    var user_email = req.body.user_email;
  
    db.query("select * from tbl_user where user_email = ?",[user_email],function(err,db_rows){
  
      if(err){
        Response.errorResponse(err,res);
      }else{
        if(db_rows > 0 ){
          console.log(db_rows);
          Response.successResponse('Password!!',res,db_rows);
        }
      }
    });
  });
  */
module.exports = router;