var express = require('express');
var router = express.Router();


// category 
var db = require('../config/db');
var Response = require('../config/response');

/* Category listing */

router.get('/',function(req,res,next){
  res.send('respond with a resource');
});

//Display All Records API
router.get('/get-all-categorys-api',function(req,res,next){
  
      db.query("select * from tbl_category",function(err,db_rows){

        if(err){
         //Response.errorResponse(err,res);
        }else{
          console.log(db_rows);
          Response.successResponse('Category Listing!!',res,db_rows);
        }
      });
});

// Add Category API

router.post('/add-category-api',function(req,res,next){

  console.log(req.body);

  const mybodydata = {
    category_name: req.body.category_name

  }

  db.query("insert into tbl_category set  ? ",mybodydata,function(err,result){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('Category Added!!',res, {});
    }
  });
});

//Get Single Data API
//Open Using FormData Method

router.get('/get-category-details-api/:id',function(req,res,next){

  console.log("Details API");

  var categoryid = req.params.id;

  console.log(categoryid);
  db.query("Select * from tbl_category where category_id = ? ",[categoryid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      console.log(db_rows);
      Response.successResponse('Category Lising!!',res,db_rows);
    }
  });
});

//Delete Record API

router.get('/delete-category-api/:id',function(req,res,next){

  var deletecategoryid = req.params.id;
  console.log(req.body.category_id);
  console.log("Show id is " + deletecategoryid);

  db.query("delete from tbl_category where category_id = ? ",[deletecategoryid],function(err,db_rows){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('Category deleted',res,{});
    }
  });
});

//Update Record API
router.post('/update-category-api/:id',function(req,res,next){

  console.log("Update API Called");
  console.log(req.body.category_id);
  console.log(req.body);

  var category_id = req.params.category_id;

  var category_name = req.body.category_name;

  console.log(category_name);

  db.query(" update tbl_category set category_name = ?  where category_id = ?",[category_name,category_id],function(err,respond){

    if(err){
      Response.errorResponse(err,res);
    }else{
      Response.successResponse('Record updated!',res,{});
    }
  });
});


//Update Photo Record API
router.post('/update-photo-api',function(req,res){

  if(!req.files)
      return res.status(400).send('No files were uploaded.');

      //File Object 
      var  myfile = req.files.category_image;
      var myfilename = req.files.category_image.name;

    // Use the mv() method to place the file somewhere on your server
    myfile.mv("public/images/category/" + myfilename, function (err){

      if(err)
          return res.status(500).send(err);
          //res.send('File uploaded!');
    });


    var category_id = req.body.category_id;
    var category_image = myfilename;

    db.query("update tbl_category set category_image = ? where category_id = ? ",[category_image,category_id],function(err,respond){

      if(err){
        Response.errorResponse(err,res);
      }else{
        Response.successResponse('Record updated!!',res,{});
      }
    });
});



// insert Data 

router.get('/add', function(req, res, next) {
    res.render('category/add-category');
});
  
  router.post('/add',function(req,res){
    
    console.log(req.body);
    console.log(req.files.category_image.name);
    
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }
    
  var myfile = req.files.category_image;
   var category_image1 = req.files.category_image.name;
   
   const mybodydata = {
      category_name : req.body.category_name,
      category_image : category_image1
    }
    
    db.query("insert into tbl_category set ?",mybodydata,function(err,result){
      if(err) throw err;
     // res.redirect('/category/add');
    });
  
   
    // Use the mv() method to place the file somewhere on your server
    myfile.mv("public/myuploads/"+category_image1, function(err) {
      if (err)
        return res.status(500).send(err);
        res.redirect('/category/add');
      //res.send('File uploaded!');
    });
  });
  
  //fetch Record from table
  
  router.get('/display',function(req,res,next){
  
    db.query("select * from tbl_category ",function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
  
      res.render('category/view-category',{db_rows_array:db_rows});
  
    });
  });
  
  //Delete category by id
  
 router.get('/delete/:id',function(req,res){
  
  var deletecid = req.params.id;
  console.log("delete product id is " + deletecid);
  db.query("delete from tbl_category where category_id = ? ",[deletecid],function(err,db_rows){

    if(err) throw err;
    console.log(db_rows);
    console.log("Record Deleted ");
    res.redirect('/category/display');
  });


});
  //show single category by id
  
  router.get('/show/:id',function(req,res){
  
    var categoryshowid = req.params.id;
    console.log("show category id is " + categoryshowid);
    db.query("select * from tbl_category where category_id = ? ",[categoryshowid],function(err,db_rows)
    {
      console.log(db_rows);
      if(err) throw err;
      res.render("category/show-category",{db_rows_array:db_rows});
    });
  });
  
  // Get single category for edit Record
  
  router.get('/edit/:id',function(req,res){
  
    var categoryeditid = req.params.id;
    console.log("category id is" + categoryeditid);
  
    db.query("select * from tbl_category where category_id = ?",[categoryeditid],function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render('category/edit-category',{db_rows_array:db_rows});
    });
  });
  
  //update Record using post method
  
  router.post('/edit/:id',function(req,res){
  
    console.log("category Edit id is ",req.params.categoryid);
  
    var categoryid = req.params.id;
    var categoryname = req.body.category_name;
    
  
    db.query("update tbl_category set category_name = ? where category_id = ?",[categoryname,categoryid],function(err,respond){
  
      if(err) throw err;
      res.redirect('/category/display');
    });
  
  });

  // Get Single Change Image 
  router.get('/changeimage/:id',function(req,res){
  
    var categoryeditid = req.params.id;
    console.log("category id is" + categoryeditid);
  
    db.query("select * from tbl_category where category_id = ?",[categoryeditid],function(err,db_rows){
  
      if(err) throw err;
      console.log(db_rows);
      res.render('category/change-image',{db_rows_array:db_rows});
    });
  });

  // update image using post method

  router.post('/changeimage/:id',function(req,res){

    var category_image1 = req.files.category_image.name;
    console.log("category Edit id is ",req.params.categoryid);

    var categoryid = req.params.id;
    var categoryimage = category_image1;

    db.query("update tbl_category set category_image = ? where category_id = ?",[categoryimage,categoryid],function(err,respond){
  
      if(err) throw err;
      res.redirect('/category/display');
    });
  

  });

  module.exports = router;
  
  