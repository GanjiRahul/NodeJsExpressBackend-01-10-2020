const mongoose = require('mongoose');

const ProductSizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    unique : true
  }
},{
  timestamps: true
});

ProductSizeSchema.post('save', function(error, doc, next) {
  console.log('doc at size :',doc);
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('size is already exist'));
  } else {
    next(error);
  }
});

const ProductSize = mongoose.model('ProductSize', ProductSizeSchema);
module.exports = ProductSize