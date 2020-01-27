var express = require('express');
var router = express.Router();

var db = require('../config/db');
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/form', function(req, res, next) {
  res.render('form');
});

router.post('/formprocess', function(req, res, next) {
  console.log(req.body);
  var a = req.body.txt1;
  var b = req.body.txt2;
  console.log("A Value is " + a + "B Value is "+ b);


  // Nodemailer
  var mymsg = "Hi " + a + "Contact you Age is " + b   ;

  console.log("Mymsg is " + mymsg);
  const nodemailer = require('nodemailer');
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        //host: 'bh-in-29.webhostbox.net',
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "andy83458@gmail.com", // generated ethereal user
            pass: "andy!@#brown" // generated ethereal password
        }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Andy " <andy83458@gmail.com>', // sender address
        to: 'nilkoshti29@gmail.com', // list of receivers
        subject: 'Contact Form Request ',   // Subject line
        text: "Test", // plain text body
        html:  mymsg // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
  //res.render("abc", { title: a });
});

router.get('/fileupload',function(req,res,next){

  res.render('fileupload');
});

router.post('/fileupload-process', function(req, res, next) {
 
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let myfile = req.files.file123;
  let myfilename = req.files.file123.name;

  // Use the mv() method to place the file somewhere on your server
  myfile.mv("public/images/"+myfilename, function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded!');
  });
 
});



//Add User API
router.post('/login-api', function (req, res, next) {
  console.log(req.body);
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;
  db.query("SELECT * FROM tbl_user WHERE user_email = ?", [user_email], function (err, results, fields) {
      if (err) {
        res.json(err)
         Response.errorResponse(err, res);
      } else {
          if (results.length > 0) {
              console.log(results[0].user_password);
              if (user_password == results[0].user_password) {
                  res.json({
                      flag: 1,
                      message: 'successfully authenticated'
                  })
              } else {
                  res.json({
                      flag: 0,
                      message: 'Email and password does not match'
                  });
              }

          }
          else {
              res.json({
                  flag: 0,
                  message: 'Email does not exits'
              });
          }
          // Response.successResponse('User Added!', res, {});
      }

  });
});






//Login Database
router.get('/login',function(req,res,next){

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
//Change Password Database

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

//Forgot Password using DataBase 
router.get('/forgotpassword',function(req,res,next){

  res.render('forgotpassword');
 
});

router.post('/forgotpassword-process',function(req,res,next){

  var user_email = req.body.user_email;
  var user_password =req.body.user_password;

  req.session.loginemail = user_email;
  req.session.loginpassword = user_password;

  db.query("select * from tbl_user where user_email = ?",[user_email],function(err,results,fields){

    if(err){
      console.log("Please Try again!!");
    }else{
      if(results.length > 0){
        console.log(results[0].user_password);
        res.redirect('/forgotpassword');
      }else{
        var mymsg = "HI Password is " + user_password;
        console.log("Password is " + user_password);
        const nodemailer = require('nodemailer');
        nodemailer.createTestAccount((err, account) => {
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
              //host: 'bh-in-29.webhostbox.net',
              host: "smtp.gmail.com",
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                  user: "andy83458@gmail.com", // generated ethereal user
                  pass: "andy!@#brown" // generated ethereal password
              }
          });
          // setup email data with unicode symbols
          let mailOptions = {
              from: '"Andy " <andy83458@gmail.com>', // sender address
              to: 'nilkoshti29@gmail.com', // list of receivers
              subject: 'Contact Form Request', // Subject line
              text: "Test" + mymsg, // plain text body
              html:  mymsg  + user_password// html body
          };
        
          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              // Preview only available when sending through an Ethereal account
              console.log('Preview URL: %s  ', nodemailer.getTestMessageUrl(info));
              res.redirect('/changepassword');
          });
        });

      }

    }
    
  })
})






//Login API 
/*
router.post('/login-api', function (req, res, next) {
  console.log(req.body);
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;
  connection.query("SELECT * FROM tbl_user_master WHERE user_email = ?", [user_email], function (err, results, fields) {
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

// Change Password API

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
});

//forgot Password API

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



//Login Session Cookie

router.get('/login',function(req,res,next){

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
  res.redirect("dashboard");

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
  res.render('dashboard',{myvalue : mysessionemail, myvalue2 : mysessionpassword});

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
//change Password
router.get('/changepassword', function(req, res, next) {
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

// Forgot Password 

router.get('/forgotpassword', function(req, res, next) {
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
module.exports = router;

