var express = require('express');
var router = express.Router();


// product 

var db = require('../config/db');
var Response = require('../config/response');

/* GET Product listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Display All Records API

router.get('/get-all-products-api',function(req,res,next){
 
      db.query("select * from tbl_product",function(err,db_rows){

        if(err){
         Response.errorResponse(err,res);
        }else{
          console.log(db_rows);
          Response.successResponse('Product Listing!!',res,db_rows);
        }
      });
});

// Add Product API
router.post('/add-products-api',function(req,res,next){

  console.log(req.body);

  const mybodydata = {
    
    product_name: req.body.product_name,
    product_description: req.body.product_description,
    product_price: req.body.product_price,
    subcategory_id: req.body.subcategory_id
  
  }
  db.query("insert into tbl_product set ? ",mybodydata,function(err,result){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('Product Added!!',res, {});
    }
  });
});

//Get Single Data API
//Open Using FormData Method 
router.get('/get-products-details-api/:id',function(req,res,next){

  console.log("Details API");
  var productid = req.params.id;

  console.log(productid);
  db.query("select * from tbl_product where product_id = ? ",[productid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);

    }else{
      console.log(db_rows);
      Response.successResponse('Product Listing!!',res,db_rows);
    }
  });

});

//Delete Record API

router.get('/delete-products-api/:id',function(req,res,next){

  var deleteproductid = req.params.id;
  console.log(req.body.product_id);
  console.log("show id is " + deleteproductid);

  db.query("delete from tbl_product where product_id = ? ",[deleteproductid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Product deleted',res ,{});
    }
  });
});

//Update Record API
router.post('/update-products-api/:id',function(req,res,next){

  console.log("Update API called");
  console.log(req.body.product_id);
  console.log(req.body);

  var product_id = req.params.product_id;

  var product_name = req.body.product_name;
  var product_description = req.body.product_description;
  var product_price = req.body.product_price;
  var subcategory_id = req.body.subcategory_id;

  console.log(product_name,product_description,product_price,subcategory_id);

  db.query("update tbl_product set product_name = ? , product_description = ? , product_price = ? , subcategory_id = ?  where product_id = ?",[product_name,product_description,product_price,subcategory_id,product_id],function(err,respond){
    if (err) {
      Response.errorResponse(err,res);
    } else {
      Response.successResponse('Record updated!',res,{});
    }
  });
    
});

//Update Photo Record API
router.post('/update-photo-api',function(req,res){

  if(!req.files)
      return res.status(400).send('No files were uploaded.');

      //File Object 
      var  myfile = req.files.product_image;
      var myfilename = req.files.product_image.name;

    // Use the mv() method to place the file somewhere on your server
    myfile.mv("public/images/product/" + myfilename, function (err){

      if(err)
          return res.status(500).send(err);
          //res.send('File uploaded!');
    });


    var product_id = req.body.product_id;
    var product_image = myfilename;

    db.query("update tbl_product set product_image = ? where product_id = ? ",[product_image,product_id],function(err,respond){

      if(err){
        Response.errorResponse(err,res);
      }else{
        Response.successResponse('Record updated!!',res,{});
      }
    });
});









// Insert add Recod from Database
router.get('/add',function(req,res,next){

    // Dropdown Fetch Record
    db.query("select * from tbl_subcategory",function(err,db_rows){
      if(err) throw err;
      console.log(db_rows);
      res.render('product/add-product',{db_rows_array:db_rows});
    });
 });
  
router.post('/add',function(req,res){
  
    console.log(req.body);
    console.log(req.files.product_image.name);

    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }
    
    var myfile = req.files.product_image;
    var product_image1 = req.files.product_image.name;

    const mybodydata = {
  
      product_name: req.body.product_name,
      product_description: req.body.product_description,
      product_price: req.body.product_price,
      product_image: product_image1,
      subcategory_id: req.body.subcategory_id
    }
    db.query("insert into tbl_product set ?",mybodydata,function(err,result){
  
      if(err) throw err;
     // res.redirect('/product/add');
    });

     // Use the mv() method to place the file somewhere on your server
     myfile.mv("public/myuploads/"+product_image1, function(err) {
      if (err)
        return res.status(500).send(err);
        res.redirect('/product/add');
      
    });

  });
  
  // Fetch Records From table

router.get('/display',function(req,res,next){
    db.query(`SELECT
      tbl_product.product_id
      , tbl_product.product_name
      , tbl_product.product_description
      , tbl_product.product_price
      , tbl_product.product_image
      , tbl_subcategory.subcategory_name
  FROM
      tbl_subcategory
      INNER JOIN tbl_product 
          ON (tbl_subcategory.subcategory_id = tbl_product.subcategory_id)`,function(err,db_rows){
      if(err) throw err;
      console.log(db_rows);
      res.render('product/view-product',{db_rows_array:db_rows});
    });
  });
  
  // Delete Product by id
  
  router.get('/delete/:id',function(req,res){
  
    var deletepid = req.params.id;
    console.log("delete product id is " + deletepid);
    db.query("delete from tbl_product where product_id = ? ",[deletepid],function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      console.log("Record Deleted ");
      res.redirect('/product/display');
    });
  
  });
  
  // Get single Product by Id
  
  router.get('/show/:id',function(req,res){
  
    var productshowid = req.params.id;
    console.log("show product id is " + productshowid);
    db.query(`SELECT
    tbl_product.product_id
    , tbl_product.product_name
    , tbl_product.product_description
    , tbl_product.product_price
    , tbl_product.product_image
    , tbl_subcategory.subcategory_name
FROM
    tbl_subcategory
    INNER JOIN tbl_product 
        ON (tbl_subcategory.subcategory_id = tbl_product.subcategory_id) where tbl_product.product_id = ?`,[productshowid],function(err,db_rows){
      console.log(db_rows);
      if(err) throw err;
      res.render("product/show-product",{db_rows_array:db_rows});
    });
  });
  
  // Get single product for edit Record

  router.get('/edit/:id',function(req,res){

    var producteditid = req.params.id;
    console.log("Product id is" + producteditid);

    db.query("select * from tbl_product where product_id = ? ",[producteditid],function(err,db_rows){
      // Dropdown Fetch Record
      db.query("select * from tbl_subcategory",function(err,db_subcategory_rows){

      if(err) throw err;
      console.log(db_rows);
      console.log(db_subcategory_rows);
      res.render("product/edit-product",{db_rows_array:db_rows,db_arr_subcategory_rows:db_subcategory_rows});
    });    
 });
});
  
  // Update Record using Post Method
  
  router.post('/edit/:id',function(req,res){
   
    console.log("product Edit id is "+ req.params.productid);
  
    var productid = req.params.id;
  
    var productname = req.body.product_name;
    var productdescription = req.body.product_description;
    var productprice = req.body.product_price;
    var subcategorypid = req.body.subcategory_id;
  
    db.query("update tbl_product set product_name = ? , product_description = ? , product_price = ? , subcategory_id = ?  where product_id = ?",[productname,productdescription,productprice,subcategorypid,productid],function(err,respond){
  
      if(err) throw err;
      res.redirect('/product/display');
    });
  
  });

  //Get Single Image Change
  router.get('/changeimage/:id',function(req,res){

    var producteditid = req.params.id;
    console.log("Product id is" + producteditid);

    db.query("select * from tbl_product where product_id = ? ",[producteditid],function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render("product/change-image",{db_rows_array:db_rows});
    });
});

  // update image using Post Method
  router.post('/changeimage/:id',function(req,res){
  
    var product_image1 = req.files.product_image.name;
    
    console.log("product Edit id is "+ req.params.productid);
  
    var productid = req.params.id;
  
    var productimage = product_image1;
    
    db.query("update tbl_product set  product_image = ?  where product_id = ?",[productimage,productid],function(err,respond){
  
      if(err) throw err;
      res.redirect('/product/display');
    });
  
  });

module.exports = router;
