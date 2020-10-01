const formidable = require('formidable');
const fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

const categoryModel = require('../model/category');

const addAndUpdateCategory = async (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.multiples = true;
    return await form.parse(req, async (err, fields, files) => {
      console.log('category fields :' , fields);
      if (!fields.name) return res.json({ status: 200, message: 'Category name is required.' });
      if (!fields._id) delete fields._id;
      if (files && files.icon && files.icon.name) {
        try {
          var categoryUpload = './uploads/category/';
          if (!fs.existsSync(categoryUpload)) fs.mkdirSync(categoryUpload);
          categoryUpload = './uploads/category/icons/';
          if (!fs.existsSync(categoryUpload)) fs.mkdirSync(categoryUpload);
          var oldpath = files.icon.path;
          var newpath =  categoryUpload + Date.now() + files.icon.name.replace(/\s+/g, '');
          fields.icon = newpath;
          fs.rename(oldpath, newpath, function (err) {
            if (err) {
              if (err.code === 'EXDEV') {
                var readStream = fs.createReadStream(oldpath);
                var writeStream = fs.createWriteStream(newpath);
                readStream.on('error', function (err) {
                  return res.json({ status: 200, message: err });
                });
                writeStream.on('error', function (err) {
                  return res.json({ status: 200, message: err });
                });
                readStream.on('close', function () {
                  fs.unlink(oldpath, function (err) {
                    return saveCategory(fields, res);
                  });
                });
                readStream.pipe(writeStream);
              } else {
                return res.json({ status: 200, message: err }); // throw err;
              }
            }
            else {
              return saveCategory(fields, res);
            }
          });
        }
        catch (e) {
          return res.json({ status: 200, message: e.message });
        }
      }
      else {
        return saveCategory(fields, res);
      }
    });
  };
  
  const saveCategory = async(fields, res)=>{ 
    if(fields._id){
      return await categoryModel.findByIdAndUpdate(
        fields._id, fields, { new: true },
        function( error, result){
          if (error) 
          return res.json({status:400 , message : error.message});
          return res.json({ status: 200, message: "Category "+result.name+" updated successfully." , data : result });
        }
      );
    }
    else{
      // try {
      //   const saveable = new categoryModel(fields);
      //   return await saveable.save(async (error, saved) => {
      //     console.log('category saved : ',saved);
      //     if (error || !saved) return res.json({status:400, message:error.message});
      //       return res.json({status:200,message:"Category "+saved.name+" added successfully." , data : saved});
      //   });
      // }catch (e) {
      //     console.log('error cat :: ' , e.message.toString())
      //    res.json({
      //    status: false,
      //    message: e.message.toString().includes('duplicate') ? 'Category already exist' : e.message.split(':')[0] // check if duplicate message exist
      //   })
      //  }

       const saveable = new categoryModel(fields);
        return await saveable.save(async (error, saved) => {
          console.log('category saved : ',saved);
          if (error || !saved) return res.json({status:400, message:error.message});
            return res.json({status:200,message:"Category "+saved.name+" added successfully." , data : saved});
        });
    };
  };
  
  const getCategories = async (req, res, next) => {
    return await categoryModel.find( req.body, (error, categories)=>{
      if(error)
      return res.json({status:400 , message:error.message})
      return res.json({ status:200, message: "Category Details Successfully Retrived", data: categories });
    })
  };

  const getCategoryById = async (req, res, next) => {
    console.log('get category by : ',req.body);
    if(req.body.categoryId == '')
    return res.json({status:400 , message : "CategoryId is required"})
    return await categoryModel.findById({_id : req.body.categoryId}, (error, categories)=>{
      if(error)
      return res.json({status:400 , message:error.message})
      return res.json({ status:200, message: "Category Details Successfully Retrived", data: categories });
    })
  };

  const deleteCategory = async (req, res, next) => {
    console.log('delete category :' , req.body);
    // if (!req.user) return res.json({ status:400, message: 'User is not found', redirect: '/' });  
    if(req.body.categoryId == null || req.body.categoryId == undefined || req.body.categoryId == ''  )
      return res.json({status:400 , message:"categoryId is required"});

      return await categoryModel.findByIdAndRemove({_id:ObjectId(req.body.categoryId)}).sort({updatedAt:-1}).then(docs=> {
        console.log('docs :', docs);
        return res.json({ status:200, message: 'Category deleted successfully.', data: docs });
       }).catch(error=> next(error));
  };

  module.exports = {
      addAndUpdateCategory,
      getCategories,
      deleteCategory,
      getCategoryById,
  }