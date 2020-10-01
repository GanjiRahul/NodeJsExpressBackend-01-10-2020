const formidable = require('formidable');
var ObjectId = require('mongodb').ObjectID;

const productSizeModel = require('../model/productSize');

const addAndUpdateProductSize = async (req, res, next) => {
    const form = new formidable.IncomingForm();
    return await form.parse(req, async (err, fields, files) => {
      console.log('size fields :' , fields);
      if (!fields.size) return res.json({ status:400, message: 'Size  is required.' });
      if (!fields._id) delete fields._id;
            saveProductSize(fields , res);
    });
  };
  
  const saveProductSize = async(fields, res)=>{ 
    if(fields._id){
      return await productSizeModel.findByIdAndUpdate(
        fields._id, fields, { new: true },
        function( error, result){
          if (error) 
          return res.json({status:400 , message : error.message});
          return res.json({ status: 'success', message: "Size "+result.size+" updated successfully." , data:result});
        }
      );
    }else{
      console.log('f231 :',fields);
      if(fields == '' || fields == null)
      return res.json({status:400 , message:"Required fields"});
      const saveable = new productSizeModel(fields);
      return await saveable.save(async (error, saved) => {
        console.log('22123' , saved , error);
        if (error) return res.json({status:400, message:error.message});
        console.log('44123');
        return res.json({status:200,message:"Size "+saved.size+" added successfully." , data : saved});
      });
    };
  };
  
  const getProductSize = async (req, res, next) => {
    return await productSizeModel.find( req.body, (error, savedSize)=>{
      if(error)
      return res.json({status:400 , message:error.message})
      return res.json({ status:200, message: "Size Details Successfully Retrived", data: savedSize });
    })
  };

  const getProductSizeById = async (req, res, next) => {
    console.log('get size by :',req.body);
    if(req.body.sizeId == '')
    return res.json({status:400 , message : "SizeId is required"})
    return await productSizeModel.find( {_id : req.body.sizeId}, (error, savedSize)=>{
      if(error)
      return res.json({status:400 , message:error.message})
      return res.json({ status:200, message: "Size Details Successfully Retrived", data: savedSize });
    })
  };

  const deleteProductSize = async (req, res, next) => {
    console.log('delete size :' , req.body);
    // if (!req.user) return res.json({ status:400, message: 'User is not found', redirect: '/' });  
    if(req.body.sizeId == null || req.body.sizeId == undefined || req.body.sizeId == '') 
       return res.json({status:400 , message:"sizeId is required"});

       return await productSizeModel.findByIdAndRemove({_id:ObjectId(req.body.sizeId)}).sort({updatedAt:-1}).then(docs=> {
       return res.json({ status:200, message: 'Size deleted successfully.', data: docs });
      }).catch(error=> next(error));
  };

  module.exports = {
      addAndUpdateProductSize,
      getProductSize,
      deleteProductSize,
      getProductSizeById
  }