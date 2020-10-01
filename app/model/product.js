const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  size:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Size'
  },
  icon: String,
  price: String,
  stock: String,
  description: String,
},{
  timestamps: true
});

ProductSchema.path('name').validate(async(value)=> {
   const name = await mongoose.models.Product.countDocuments({name : value});
   return !name;
},'Product name already exist');

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
