var express = require('express');
var router = express.Router();


// subcategory 

var db = require('../config/db');
var Response = require('../config/response');

// Get Subcategory Listing

router.get('/',function(req,res,next){
  res.send('respond with a resourse');
});

//Display All Record API

router.get('/get-all-subcategory-api',function(req,res,next){

db.query("select * from tbl_subcategory",function(err,db_rows){
  if(err){
    Response.errorResponse(err,res);
  }else{
    console.log(db_rows);
    Response.successResponse('Subcategory Listing!!',res,db_rows);
  }
 });
});

//Add   Subcategory API

router.post('/add-subcategory-api',function(req,res,next){

  console.log(req.body);

  const mybodydata = {
    subcategory_name: req.body.subcategory_name,
    category_id: req.body.category_id
  }
  db.query("insert into tbl_subcategory set ?",mybodydata,function(err,result){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('Subcategory Added!!',res,{});
    }
  });
});

//Get Single Data API
//Open Using FormData Method

router.get('/get-subcategory-details-api/:id',function(req,res,next){

  console.log("Details API");
  var subcategoryid = req.params.id;

  console.log(subcategoryid);

  db.query("select * from tbl_subcategory where subcategory_id = ?",[subcategoryid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('Subcategory Lising!!',res,db_rows);
    }
  });
});

//Delete Record API

router.get('/delete-subcategory-api/:id',function(req,res,next){

  var deletesubcategoryid = req.params.id;
  console.log(req.body.subcategory_id);
  console.log("Show id is " + deletesubcategoryid);

  db.query("delete from tbl_subcategory where subcategory_id = ?",[deletesubcategoryid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
        console.log(db_rows);
        Response.successResponse('Subcategory Deleted',res,{});
    }
  });
});

//Update Record API

router.post('/update-subcategory-api/:id',function(req,res,result){

  console.log("Update API called");
  console.log(req.body.subcategory_id);
  console.log(req.body);

  var subcategory_id = req.params.subcategory_id;

  var subcategory_name = req.body.subcategory_name;
  var category_id = req.body.category_id;

  console.log(subcategory_name,category_id);

  db.query("update tbl_subcategory set subcategory_name =?, category_id = ? where subcategory_id = ? ",[subcategory_name,category_id,subcategory_id],function(err,respond){

    if(err){
      Response.errorResponse(err,res);

    }else{
      Response.successResponse('Record Updated!!',res,{});
    }
  });
});

//update Photo Record API
router.post('/update-photo-api',function(req,res){
  if(!req.files)
      return res.status(400).send('No files were uplodaed');

      //Files Object
      var  myfile = req.files.subcategory_image;
      var  myfilename = req.body.subcategory_image.name;

      // Use the mv() method to place the file somewere on your server
      myfile.mv("public/images.subcategory/" + myfilename,function(err){

        if(err)
            return res.status(500).send(err);
            //res.send('File uploaded!');
      });

      var subcategory_id = req.body.subcategory_id;
      var subcategory_image = myfilename;

      db.query("update tbl_subcategory set subcategory_image = ? where subcategory_id = ?",[subcategory_image,subcategory_id],function(err,respond){

        if(err){
          Response.errorResponse(err,res);
        }else{
          Response.successResponse('Record updated!!',res,{});
        }
      });
});


router.get('/add', function(req, res, next) {
  //DropDown Fetch Code"select * from tbl_subcategory "
  db.query("select * from tbl_category",function(err,db_rows){
    if(err) throw err;
    console.log(db_rows);
    res.render('subcategory/add-subcategory',{db_rows_array:db_rows});
  });
});
  
  router.post('/add',function(req,res){

    console.log(req.body);
    console.log(req.files.subcategory_image.name);
    
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }
    
    var myfile = req.files.subcategory_image;
   var subcategory_image1 = req.files.subcategory_image.name;
   
   const mybodydata = {
      subcategory_name : req.body.subcategory_name,
      subcategory_image : subcategory_image1,
      category_id : req.body.category_id
    }
    
    db.query("insert into tbl_subcategory set ?",mybodydata,function(err,result){
      if(err) throw err;
      //res.redirect('/subcategory/add');
    });
  
   
    // Use the mv() method to place the file somewhere on your server
    myfile.mv("public/myuploads/"+subcategory_image1, function(err) {
      if (err)
        return res.status(500).send(err);
        res.redirect('/subcategory/add');
      
    });
  });
  
  //fetch Record from table
  
  router.get('/display',function(req,res,next){
  
    db.query(`SELECT
      tbl_subcategory.subcategory_id
      , tbl_subcategory.subcategory_name
      , tbl_subcategory.subcategory_image
      , tbl_category.category_name
  FROM
      tbl_category
      INNER JOIN tbl_subcategory 
          ON (tbl_category.category_id = tbl_subcategory.category_id)`,function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
  
      res.render('subcategory/view-subcategory',{db_rows_array:db_rows});
  
    });
  });
  
  //Delete category by id
  
 router.get('/delete/:id',function(req,res){
  
  var deletesid = req.params.id;
  console.log("delete product id is " + deletesid);
  db.query("delete from tbl_subcategory where subcategory_id = ? ",[deletesid],function(err,db_rows){

    if(err) throw err;
    console.log(db_rows);
    console.log("Record Deleted ");
    res.redirect('/subcategory/display');
  });


});
  //show single category by id
  
  router.get('/show/:id',function(req,res){
  
    var subcategoryshowid = req.params.id;
    console.log("show subcategory id is " + subcategoryshowid);
    db.query(`SELECT
    tbl_subcategory.subcategory_id
    , tbl_subcategory.subcategory_name
    , tbl_subcategory.subcategory_image
    , tbl_category.category_name
FROM
    tbl_category
    INNER JOIN tbl_subcategory 
        ON (tbl_category.category_id = tbl_subcategory.category_id) where tbl_subcategory.subcategory_id = ?`,[subcategoryshowid],function(err,db_rows)
    {
      console.log(db_rows);
      if(err) throw err;
      res.render("subcategory/show-subcategory",{db_rows_array:db_rows});
    });
  });
  
  // Get single category for edit Record
  
  router.get('/edit/:id',function(req,res){
  
    var subcategoryeditid = req.params.id;
    console.log("subcategory id is" + subcategoryeditid);

    db.query("select * from tbl_subcategory where subcategory_id = ?",[subcategoryeditid],function(err,db_rows){
      
      db.query("select * from tbl_category",function(err,db_category_rows){

        if(err) throw err;
        console.log(db_rows);
        console.log(db_category_rows);
        res.render('subcategory/edit-subcategory',{db_rows_array:db_rows,db_arr_category_rows:db_category_rows});
      });
     
    });
    
  });
  
  //update Record using post method
  
  router.post('/edit/:id',function(req,res){
   
    var subcategory_image1 = req.files.subcategory_image.name;
    
    console.log("subcategory Edit id is ",req.params.subcategoryid);
  
    var subcategoryid = req.params.id;
  
    var subcategoryname = req.body.subcategory_name;
    var subcategoryimage = subcategory_image1;
    var categoryid = req.body.category_id;
   
    db.query("update tbl_subcategory set subcategory_name = ?, subcategory_image = ?, category_id = ? where subcategory_id = ?",[subcategoryname,subcategoryimage,categoryid,subcategoryid],function(err,respond)
    {
  
      if(err) throw err;
      res.redirect('/subcategory/display');
    });
  
  });

  //Get Simgle Chnage Image 
  router.get('/changeimage/:id',function(req,res){
  
    var subcategoryeditid = req.params.id;
    console.log("subcategory id is" + subcategoryeditid);

    db.query("select * from tbl_subcategory where subcategory_id = ?",[subcategoryeditid],function(err,db_rows){
  
        if(err) throw err;
        console.log(db_rows);
        res.render('subcategory/change-image',{db_rows_array:db_rows});
      });
     
  });
  // Update change image using post method

  router.post('/changeimage/:id',function(req,res){
   
    var subcategory_image1 = req.files.subcategory_image.name;
    
    console.log("subcategory Edit id is ",req.params.subcategoryid);
  
    var subcategoryid = req.params.id;

    var subcategoryimage = subcategory_image1;

    db.query("update tbl_subcategory set  subcategory_image = ? where subcategory_id = ?",[subcategoryimage,subcategoryid],function(err,respond)
    {
      if(err) throw err;
      res.redirect('/subcategory/display');
    });
  
  });

 module.exports = router;
  
  