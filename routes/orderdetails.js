var express = require('express');
var router = express.Router();


//orderDetails 
var db = require('../config/db');
 var Response = require('../config/response');

//Get orderdetails API 
router.get('/',function(req,res,next){
  res.send('respond with a resourse');
});

//Display All Records API

router.get('/get-all-orderdetails-api',function(req,res,next){

  db.query("select * from tbl_order_details",function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('OrderDetails Listing!! ',res,db_rows);
    }
  });
});

//Add OrderDetails API

router.post('/add-order-details-api',function(req,res,next){

  console.log(req.body);

  const mybodydata = {

    order_id: req.body.order_id,
    product_id: req.body.product_id,
    order_qty: req.body.order_qty,
    order_amount: req.body.order_amount
  }
  db.query("insert into tbl_order_Detalis set ? ",mybodydata,function(err,result){

    if(err){
      Response.errorResponse(err,res);
    }else{
      
      Response.successResponse('OrderDetails Added!! ',res,{});
    }
  });
});

//Get Single Data API
//Open Using FormData Method

router.get('/get-order-details-api/:id',function(req,res,next){

  console.log("Details API");
  var orderdetailsid = req.params.id;

  console.log(orderdetailsid);
  db.query("select * from tbl_order_details where order_details_id = ?",[orderdetailsid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Order-details-Listing!!',res,db_rows);
    }
  });
});

//Delete Record API
router.get('/delete-order-details-api/:id',function(req,res,next){

  var deleteorderdetailsid = req.params.order_details_id;
  console.log(req.body.order_details_id);
  console.log("Show id is " + deleteorderdetailsid);

  db.query("delete from tbl_order_details where order_details_id = ? ",[deleteorderdetailsid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Order-Details deleted ',res,{});
    }
  });

});

//Update Record API
router.post('/update-order-details-api/:id',function(req,res,next){

  console.log("update API called");
  console.log(req.body.order_details_id);
  console.log(req.body);

  var order_details_id  = req.params.order_details_id;

  var order_id = req.body.order_id;
  var product_id = req.body.product_id;
  var order_qty = req.body.order_qty;
  var order_amount = req.body.order_amount;

  console.log(order_id,product_id,order_qty,order_amount);

  db.query("update tbl_order_details set order_id = ? , product_id = ? , order_qty = ? , order_amount = ? where order_details_id = ?",[order_id,product_id,order_qty,order_amount,order_details_id],function(err,respond){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('Record updated !',res,{});
    }
  });
});



router.get('/add',function(req,res,next){
  
 db.query("select * from tbl_order_master,tbl_product",function(err,db_rows){

      if(err) throw err;
      console.log(db_rows);
      res.render('orderdetails/add-orderdetails',{db_rows_array:db_rows});
    });
});

  
  router.post('/add',function(req,res,next){
  
    console.log(req.body);
  
    const mybodydata = {
  
     order_id: req.body.order_id,
     product_id: req.body.product_id,
     order_qty: req.body.order_qty,
     order_amount: req.body.order_amount
    }
  
    db.query("insert into tbl_order_details set ? ",mybodydata,function(err,result){
  
      if(err) throw err;
      res.redirect('/orderdetails/add');
    });
  });
  
  // Fetch Records From table
  
  router.get('/display',function(req,res,next){
  
    db.query(`SELECT
      tbl_order_details.order_details_id
      , tbl_order_details.order_id
      , tbl_product.product_name
      , tbl_order_details.order_qty
      , tbl_order_details.order_amount
  FROM
      tbl_order_master
      INNER JOIN tbl_order_details
          ON (tbl_order_master.order_id = tbl_order_details.order_id)
      INNER JOIN tbl_product
          ON (tbl_product.product_id = tbl_order_details.product_id)`,function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render('orderdetails/view-orderdetails',{db_rows_array:db_rows});
    });
  });
  
  // Delete order_details by order_details_id
  
  router.get('/delete/:id',function(req,res){
  
  var orderdetailsid = req.params.id;
  
  console.log(" Delete orderdetailsid is" + orderdetailsid);
  
    db.query("delete from tbl_order_details where order_details_id = ? ",[orderdetailsid],function(err,db_rows){
  
    if(err) throw err;
    console.log("Record Deleted");
    res.redirect('/orderdetails/display');
    });
  });
  
  // Show single Order_details by order_details_id
  
  router.get('/show/:id',function(req,res){
  
    var showorderdetailsid = req.params.id;
  
    console.log("show orderdetails id is " + showorderdetailsid);
  
    db.query(`SELECT
    tbl_order_details.order_details_id
    , tbl_order_details.order_id
    , tbl_product.product_name
    , tbl_order_details.order_qty
    , tbl_order_details.order_amount
FROM
    tbl_order_master
    INNER JOIN tbl_order_details
        ON (tbl_order_master.order_id = tbl_order_details.order_id)
    INNER JOIN tbl_product
        ON (tbl_product.product_id = tbl_order_details.product_id) where tbl_order_details.order_details_id = ?`,[showorderdetailsid],function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render("orderdetails/show-orderdetails",{db_rows_array:db_rows});
    });
  });
  
  // Get Single orderdetails for Edit Record
  
  router.get('/edit/:id',function(req,res){
  
    var orderdetailsedit = req.params.id;
  
    console.log("Edit orderdetails id is" + req.params.orderdetailsedit);
  
    db.query("select * from tbl_order_details where order_details_id = ? ",[orderdetailsedit],function(err,db_rows){
  
        db.query("select * from tbl_order_master",function(err,db_order_rows){

           db.query("select * from tbl_product",function(err,db_product_rows){
             if(err) throw err;
              console.log(db_order_rows);
              console.log(db_product_rows);
              console.log(db_rows);
              res.render("orderdetails/edit-orderdetails",{db_rows_array:db_rows,db_arr_product_rows:db_product_rows,db_arr_order_rows:db_order_rows});

            });
       });
      
    });
  });
  
  // Update Record using Post Method
  
  router.post('/edit/:id',function(req,res){
  
    console.log("Edit orderdetails id is" + req.params.orderdetailsid);
  
    var orderdetailsid = req.body.order_details_id;

    var orderdeid = req.params.order_id; 
    var productdeid = req.body.product_id;
    var orderqty = req.body.order_qty;
    var orderamount = req.body.order_amount;
  
    db.query("update tbl_order_details set order_id = ?, product_id = ? ,order_qty = ? ,order_amount = ? where order_details_id = ?",
    [orderdeid,productdeid,orderqty,orderamount,orderdetailsid],function(err,db_rows){
  
      if(err) throw err;
      res.redirect('/orderdetails/display');
    });
  });
  

module.exports = router;