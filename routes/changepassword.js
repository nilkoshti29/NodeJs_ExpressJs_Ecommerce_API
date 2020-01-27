var express = require('express');
var router = express.Router();

var db = require('../config/db');
//var Response = require('../config/response');

/* GET Product listing.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}); */


//change Password
/*
router.get('/', function(req, res, next) {
    res.render('changepassword');
  });
  
  router.post('/changepassword-process',function(req,res,next){
  
    var user_old_password = req.body.user_old_password;
    console.log(user_old_password);
    req.session.mysoldpassword= user_old_password;
  
    var new_password= req.body.new_password;
    console.log(new_password);
    req.session.mysnewpassword = new_password;
  
    var confirm_password = req.body.confirm_password;
    console.log(confirm_password);
    req.session.mysconfirmpassword = confirm_password;
  
    console.log("oldpassword value is" + req.session.mysoldpassword , "new Password value is " + req.session.mysnewpassword, " Confirm Password value is " + req.session.mysconfirmpassword);
  
    res.redirect("/change-password");
  });
  
  router.get('/change-password',function(req,res,next){
  
    if(req.session.mysoldpassword && req.session.mysnewpassword && req.session.mysconfirmpassword){
  
        var user_old_password = req.session.mysoldpassword;
        var new_password = req.session.mysnewpassword;
        var confirm_password= req.session.mysconfirmpassword;
  
        res.render('change-password',{myvalue3 : user_old_password,myvalue4 : new_password,myvalue5 : confirm_password});
    }else{
        res.redirect('/changepassword');
    }
  });
*/
  // Change Password Database Connection
  
  router.get('/changepassword', function(req, res, next) {
    
    var loginemail = req.session.loginemail;
  
        if(loginemail){
          res.render('changepassword');
        }else{
          res.redirect('login');
        }
   
  });
  
  router.post('/changepassword-process',function(req,res,next){
  
    var loginemail = req.session.loginemail;
   
    var user_password = req.body.user_password;
    console.log(user_password);
    req.session.mysoldpassword= user_password;
  
    var new_password= req.body.new_password;
    console.log(new_password);
    req.session.mysnewpassword = new_password;
  
    var confirm_password = req.body.confirm_password;
    console.log(confirm_password);
    req.session.mysconfirmpassword = confirm_password;
  
      db.query("update tbl_user set user_password = ?  where user_email = ? ",[new_password,loginemail],function(err,respond,db_rows){
        if(err)
        console.log(db_rows);
        res.redirect('/change-password');
      });
  });
  
  router.get('/change-password',function(req,res,next){
  
    console.log(req.session);
    console.log(req.session);
    console.log(req.session);
  
    var user_password = req.session.mysoldpassword;
    var new_password = req.session.mysnewpassword;
    var confirm_password= req.session.mysconfirmpassword;
  
    if(user_password && new_password && confirm_password){
        res.render('change-password',{myvalue3 : user_password,myvalue4 : new_password,myvalue5 : confirm_password});
      
    }else{
        res.redirect('/changepassword');
    }
  });

// Change Password API
/*
router.post('/change-password-api',function(req,res){

    var user_id = req.body.user_id;
    var user_new_password = req.body.user_new_password;
  
    db.query("update tbl_user set user_password = ? where user_id = ? ",[user_new_password,user_id],function(err,respond){
      if(err){
        Response.errorResponse(err,res);
      }else{
        Response.successResponse('Password updated!!',res,{});
      }
    });
  });*/


module.exports = router;