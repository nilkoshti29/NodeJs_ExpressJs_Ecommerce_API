var express = require('express');
var router = express.Router();

// Order

var db = require('../config/db');
var Response = require('../config/response');


// Get Order Listing
router.get('/',function(req,res,next){
  res.send('respond with a response');
});

//Display all Record API
router.get('/get-all-order-api',function(req,res,next){

  db.query("select * from tbl_order_master",function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Order Listing!!!',res,db_rows);
    }
  });
});


//Add Order API

router.post('/add-order-api',function(req,res,next){

  console.log(req.body);

  const mybodydata = {
    order_date: req.body.order_date,
    user_id: req.body.user_id
  }
  db.query("insert into tbl_order_master set ?",mybodydata,function(err,result){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('Order Added!!',res,db_rows);
    }
  });
});

//Get Single Data API
//Open Using FormData  Method

router.get('/get-order-details-api/:id',function(req,res,next){

  console.log("Details API");
  var orderid = req.params.id;

  console.log(orderid);

  db.query("select * from tbl_order_master where order_id = ? ",[orderid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Order Listing!!',res,db_rows);
    }
  });
});

//Delete Record API
router.get('/delete-order--api/:id',function(req,res,next){

  var deleteorderid = req.params.id;
  console.log(req.body.order_id);
  console.log("Show id is"+ deleteorderid);

  db.query("delete from -tbl_order_master where order_id = ? ",[deleteorderid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Order Deleted!',res,{});
    }
  });

});

//Update Record API
router.post('/update-order-api/:id',function(req,res,next){

  console.log("Update API called");
  console.log(req.body.order_id);
  console.log(req.body);

  var order_id = req.params.order_id;

  var order_date = req.body.order_date;
  var user_id = req.body.user_id;

  console.log(order_date,user_id);

  db.query("update tbl_order_master set order_date = ? , user_id = ? where order_id = ? ",[order_date,user_id,order_id],function(err,respond){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Record Updated!!',res,{});
    }
  });
});



router.get('/add', function(req, res, next) {

  db.query("select * from tbl_user",function(err,db_rows){
  
    if(err) throw err;
    console.log(db_rows);
    res.render('order/add-order',{db_rows_array:db_rows});
  });
 
});
  
router.post('/add',function(req,res,next){
  
    console.log(req.body);
  
    const mybodydata = {
  
      order_date: req.body.order_date,
      user_id: req.body.user_id
    }
  
    db.query("insert into tbl_order_master set ? ",mybodydata,function(err,result){
  
      if(err) throw err;
      res.redirect('/order/add');
    });
  
  });
  
  // Fetch Record From table
  
  router.get('/display',function(req,res,next){
  
    db.query(`SELECT
      tbl_order_master.order_id
      , tbl_order_master.order_date
      , tbl_user.user_name
  FROM
      tbl_user
      INNER JOIN tbl_order_master
          ON (tbl_user.user_id = tbl_order_master.user_id)`,function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render('order/view-order',{db_rows_array:db_rows});
    });
  
  });
  
  // delete Order by id
  
  router.get('/delete/:id',function(req,res){

    var deleteoid = req.params.id;
    console.log("Delete order id is " + deleteoid);

    db.query("delete from tbl_order_master where order_id = ? ",[deleteoid],function(err,db_rows){

      if(err) throw err;
      console.log(db_rows);
      console.log("Record Deleted");
      res.redirect('/order/display');
    });

  });
  
  
  // Get single order by id
  
  router.get('/show/:id',function(req,res){
  
    var ordershowid = req.params.id;
    console.log("ordershow id is "+ ordershowid);
  
    db.query(`SELECT
    tbl_order_master.order_id
    , tbl_order_master.order_date
    , tbl_user.user_name
FROM
    tbl_user
    INNER JOIN tbl_order_master
        ON (tbl_user.user_id = tbl_order_master.user_id) where tbl_order_master.order_id = ? `,[ordershowid],function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render('order/show-order',{db_rows_array:db_rows});
    });
  });
  
  // Get single order for edit Record

  router.get('/edit/:id',function(req,res){

    var ordereditid = req.params.id;
    console.log("Order id is" + req.params.ordereditid);

    db.query("select * from tbl_order_master where order_id = ? ",[ordereditid],function(err,db_rows){
      // Dropdown Fetch Record
        db.query("select * from tbl_user",function(err,db_user_rows){

        if(err) throw err;
        console.log(db_rows);
        console.log(db_user_rows);
        res.render("order/edit-order",{db_rows_array:db_rows,db_arr_user_rows:db_user_rows});
        }); 
    });
 });
  
  
  // Update Record using post  method
  
  router.post('/edit/:id',function(req,res){
  
    
    console.log("orderedit id is ",req.params.orderid);
  
    var orderid = req.params.id;
  
    var orderdate = req.body.order_date;
    var userid = req.body.user_id;
  
  
    db.query("update tbl_order_master set order_date = ?  , user_id = ? where order_id = ?",[orderdate,userid,orderid],function(err,respond){
  
      if(err) throw err;
      res.redirect('/order/display');
    });
  
  });
  

module.exports = router;