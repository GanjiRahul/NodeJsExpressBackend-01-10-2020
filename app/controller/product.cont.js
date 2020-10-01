

const formidable = require('formidable');
const fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

const productModel = require('../model/product');

const addAndUpdateProduct = async (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.multiples = true;
    return await form.parse(req, async (err, fields, files) => {
      console.log('product add :' , fields);
      if (!fields.name) return res.json({ status:400, message: 'Product name is required.' });
      if (!fields._id) delete fields._id;
      if (files && files.icon && files.icon.name) {
        try {
          var productUpload = './uploads/product/';
          if (!fs.existsSync(productUpload)) fs.mkdirSync(productUpload);
          productUpload = './uploads/product/icons/';
          if (!fs.existsSync(productUpload)) fs.mkdirSync(productUpload);
          var oldpath = files.icon.path;
          var newpath =  productUpload + Date.now() + files.icon.name.replace(/\s+/g, '');
          fields.icon = newpath;
          fs.rename(oldpath, newpath, function (err) {
            if (err) {
              if (err.code === 'EXDEV') {
                var readStream = fs.createReadStream(oldpath);
                var writeStream = fs.createWriteStream(newpath);
                readStream.on('error', function (err) {
                  return res.json({ status:400, message: err });
                });
                writeStream.on('error', function (err) {
                  return res.json({ status:400, message: err });
                });
                readStream.on('close', function () {
                  fs.unlink(oldpath, function (err) {
                    return saveProduct(fields, res);
                  });
                });
                readStream.pipe(writeStream);
              } else {
                return res.json({ status:400, message: err }); // throw err;
              }
            }
            else {
              return saveProduct(fields, res);
            }
          });
        }
        catch (e) {
          return res.json({ status:400, message: e.message });
        }
      }
      else {
        return saveProduct(fields, res);
      }
    });
  };
  
  const saveProduct = async(fields, res)=>{ 
    if(fields._id){
      return await productModel.findByIdAndUpdate(
        fields._id, fields, { new: true },
        function( error, result){
          if (error) 
          return res.json({status:400 , message : error.message});
          return res.json({ status:200, message: "Product "+result.name+" updated successfully." , data : result });
        }
      );
    }
    else{
      const saveable = new productModel(fields);
      return await saveable.save(async (error, saved) => {
        if (error || !saved) return res.json({status:400, message:error.message});
          return res.json({status:200,message:"Product "+saved.name+" added successfully." , data : saved});
      });
    };
  };
  
  const getProduct = async (req, res, next) => {
    return await productModel.find( req.body, (error, product)=>{
      if(error)
      return res.json({status:400 , message:error.message})
      return res.json({ status:200, message: "Product Details Successfully Retrived", data: product });
    })
  };

  const deleteProduct = async (req, res, next) => {
    // if (!req.user) return res.json({ status:400, message: 'User is not found', redirect: '/' });  
       console.log('delete Product :',req.body);
       if(req.body.productId == null || req.body.productId == undefined || req.body.productId == '')
       return res.json({status:400 , message:"ProductId is required"});

       return await productModel.findByIdAndRemove({_id:ObjectId(req.body.productId)}).sort({updatedAt:-1}).then(docs=> {
       return res.json({ status:200, message: 'Product deleted successfully.', data: docs });
      }).catch(error=> next(error));
  };

  module.exports = {
      addAndUpdateProduct,
      getProduct,
      deleteProduct
  }

