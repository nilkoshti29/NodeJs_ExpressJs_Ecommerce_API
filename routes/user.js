var express = require('express');
var router = express.Router();

//User 
var db = require('../config/db');
var Response = require('../config/response');

//Get User Listing 
router.get('/',function(req,res,next){
  res.send('respond with a resourse');
}); 

//Display All Record API

router.get('/get-all-user-api',function(req,res,next){

  db.query("select  * from tbl_user",function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('User Listing!!',res,db_rows);
    }
  });
});

//Add User API

router.post('/add-user-api',function(req,res,next){

  console.log(req.body);

  const  mydata = {

    user_name: req.body.user_name,
    user_gender: req.body.user_gender,
    user_email: req.body.user_email,
    user_password: req.body.user_password,
    user_address: req.body.user_address
    }

  db.query("insert into tbl_user set ? ",mydata,function(err,result){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('User Added!!',res, {});
    }
    
  });
});

//Get Single Data API
//Open Using FormData Method

router.get('/get-user-details-api/:id',function(req,res,body){

  console.log("Details API");
  var userid =  req.params.id;


  console.log(userid);
  db.query("select * from tbl_user where user_id = ? ",[userid],function(err,db_rows){
    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('User Listing!!!',res,db_rows);
    }
  });
});

//Delete Record API 
router.get('/delete-user-api/:id',function(req,res,next){

  var deleteuserid = req.params.id;
  console.log(req.body.user_id);
  console.log("Show id is "+ deleteuserid);

  db.query("delete from tbl_user wher user_id = ?",[deleteuserid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('User Deleted ',res,{});
    }
  });
});

//Update Record API

router.post('/update-user-api/:id',function(req,res,next){

  console.log("Update API called");
  console.log(req.body.user_id);
  console.log(req.body);

  var user_id = req.params.user_id;

  var user_name = req.body.user_name;
  var user_gender = req.body.user_gender;
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;
  var user_address = req.body.user_address;
  
  console.log(user_name,user_gender,user_email,user_password,user_address);

  db.query("update tbl_user set user_name = ? , user_gender = ? , user_email = ? , user_password = ? , user_address = ? where user_id = ? ",[user_name,user_gender,user_email,user_address,user_password,user_id],function(err,respond){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Record Updated!',res,{});
    }
  });
});







//insert Data

	router.get('/add',function(req,res,next){

		res.render('user/add-user');
	  
	});
  
  router.post('/add',function(req,res,next){
  
    console.log(req.body);
    const mybodydata = {
  
      user_name:req.body.user_name,
      user_gender:req.body.user_gender,
      user_email:req.body.user_email,
      user_password:req.body.user_password,
      user_address:req.body.user_address
    }
    db.query("insert into tbl_user set ?",mybodydata,function(err,result){
  
      if(err) throw err;
      res.redirect('/user/add');
    });
  });
  
  // Fetch Records from user
  
  router.get('/display',function(req,res,next){
  
    db.query("select * from tbl_user ",function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render('user/view-user',{db_rows_array:db_rows});
    });
  
  });
  
  // Delete user by id
  
  router.get('/delete/:id',function(req,res){
  
    var deleteuid = req.params.id;
    console.log("Delete id is " + deleteuid);
    db.query("delete from tbl_user where user_id = ? ",[deleteuid],function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      console.log("Record Deleted");
      res.redirect('/user/display');
    });
  });
  
  // Get single user by id
  router.get('/show/:id',function(req,res){
  
    var usershowid = req.params.id;
    console.log("user showid is " + usershowid);
  
    db.query("select * from tbl_user where user_id = ? ",[usershowid],function(err,db_rows){
  
      console.log(db_rows);
      if(err) throw err;
      res.render("user/show-user",{db_rows_array:db_rows});
    });
  });
  
  // Get single user  for edit record
  
  router.get('/edit/:id',function(req,res){
  
    var usereditid = req.params.id;
    console.log("user id is " + req.params.usereditid );
  
    db.query("select * from tbl_user where user_id = ? ",[usereditid],function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render("user/edit-user",{db_rows_array:db_rows});
    });
  });
  
  //update Record using Post method
  
  router.post('/edit/:id',function(req,res){
    
    console.log("useredit id is ",req.params.userid);
  
    var userid = req.params.id;
  
    var username = req.body.user_name;
    var usergender = req.body.user_gender;
    var useremail = req.body.user_email;
    var userpassword = req.body.user_password;
    var useraddress = req.body.user_address;
  
  
    db.query("update tbl_user set user_name = ? , user_gender = ? , user_email = ? , user_password = ? , user_address = ? where user_id = ?",[username,usergender,useremail,userpassword,useraddress,userid],function(err,respond){
  
      if(err) throw err;
      res.redirect('/user/display');
    });
  
  });
  

module.exports = router;