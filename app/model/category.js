const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  icon: String,
  description:{type:String , required : true}
},{
  timestamps: true
});

CategorySchema.post('save', function(error, doc, next) {
  console.log('doc at cate :',doc);
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Category name is already exist'));
  } else {
    next(error);
  }
});

const Categories = mongoose.model('Category', CategorySchema);
module.exports = Categories;
