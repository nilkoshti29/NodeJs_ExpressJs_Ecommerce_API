var express = require('express');
var router = express.Router();

var db = require('../config/db');
//var Response = require('../config/response');

/* GET Product listing.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
 */
//Login Session Cookie
/*
router.get('/',function(req,res,next){

    res.render('login');
  });
  
  router.post('/login-process',function(req,res,next){
  
    console.log(req.body);
  
    var useremail = req.body.user_email;
    var userpassword = req.body.user_password;

    
  
    //Session variable useremail/userpassword with value
  
    req.session.loginemail = useremail;
    req.session.loginpassword = userpassword;
  
    res.cookie("loginemail", useremail);
    res.cookie("loginpassword", userpassword);
  
    res.cookie("islogin", 1);
    res.cookie("ispassword", 2);
  
    console.log(res.session);
    console.log(res.session);
    res.redirect("/dashboard");
  
  });
  
  router.get('/dashboard',function(req,res,next){
  
    console.log("Hi!! I am Dashboard");
    console.log(req.session);
    console.log(req.session);
  
    var mysessionemail = req.session.loginemail;
    var mysessionpassword = req.session.loginpassword;
  
    if(!mysessionemail && mysessionpassword){
      res.redirect("/login");
    }
    res.render('/dashboard',{myvalue : mysessionemail, myvalue2 : mysessionpassword});
  
  });
  router.get('/logout', function(req, res) {
   
    //  req.session.destroy;
      
      res.clearCookie("loginemail");
      res.clearCookie("loginpassword");
      res.clearCookie("islogin");
      res.clearCookie("ispassword");
      //res.clearCookie("islogin",{ expires: Date.now(), path: '/' });
      //res.clearCookie('loginname', { expires: new Date.now(), path: '/' });
      //res.clearCookie("islogin" ,{ expires: new Date(0), path: '/' });
      res.redirect('/login');
     
    });
    
    router.get('/cookie', function (req, res,next) {
      // Cookies that have not been signed
      res.cookie("CookieDemo" , 'Nilesh').send('Cookie is set');
      console.log('Cookies: ', req.cookies)
     });
  
     //sesion counter
  
  router.get('/sescounter', function(req, res, next) {
    if (req.session.views) {
      req.session.views++
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      res.end()
    } else {
      req.session.views = 1
      res.end('welcome to the session demo. refresh!')
    }
  });
*/
// Login Database Connection 
router.get('/',function(req,res,next){

  res.render('login');
});

router.post('/login-process',function(req,res,next){
   console.log(req.body);
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;

  //Session variable useremail/userpassword with value

  req.session.loginemail = user_email;
  req.session.loginpassword = user_password;
  
  db.query("select * from tbl_user where user_email = ? ",[user_email],function(err,results,fields){
    if(err){
      console.log("Please Login Retry!!");
    }else{
      if(results.length > 0){
        console.log(results[0].user_password);
        if(user_password === results[0].user_password){  
           req.session.loginemail = user_email;
           req.session.loginpassword = user_password;
          console.log("Login SuccessFully!!!");
          res.redirect('/dashboard');
        }else{
          console.log("Email and Password does not match");
         
          res.render('login');
        }
      }else{
        console.log("Email does not exits!!");
        res.render('login');
      }
    }
   
  });
 
});

router.get('/dashboard',function(req,res){

  console.log(req.session);
  console.log(req.session);

  var user_email =   req.session.loginemail ;
  var user_password = req.session.loginpassword;

  if(user_email && user_password){
    
    //res.send('Welcome back' + user_email + '!');
      res.render('dashboard', { myvalue: user_email, myvalue2: user_password });
  }else{
    res.send('Please login to view this Page!!'); 
  }
  res.end();
});


//LogOut Process
router.get('/logout', function(req, res) {
 
  //  req.session.destroy;
    
    res.clearCookie("loginemail");
    res.clearCookie("loginpassword");
    res.clearCookie("islogin");
    res.clearCookie("ispassword");
    //res.clearCookie("islogin",{ expires: Date.now(), path: '/' });
    //res.clearCookie('loginname', { expires: new Date.now(), path: '/' });
    //res.clearCookie("islogin" ,{ expires: new Date(0), path: '/' });
    res.redirect('/login');
   
  });

  
  //Login API 

router.post('/login-api', function (req, res, next) {
  console.log(req.body);
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;
  connection.query("SELECT * FROM tbl_user WHERE user_email = ?", [user_email], function (err, results, fields) {
    if (err) {
      Response.errorResponse(err, res);
    } else {

      if (results.length > 0) {
        console.log(results[0].user_password);
        if (user_password == results[0].user_password) {
          res.json({
            flag: 1,
            message: 'successfully authenticated',
            data: results
          })
        } else {
          res.json({
            flag: 0,
            message: "Email and password does not match"
          });
        }

      } else {
        res.json({
          flag: 0,
          message: "Email does not exits"
        });
      }
      // Response.successResponse('User Added!', res, {});
    }

  });
});

module.exports = router;