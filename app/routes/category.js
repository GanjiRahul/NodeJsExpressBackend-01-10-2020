
const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.cont');

router.post('/addAndUpdateCategory' , categoryController.addAndUpdateCategory);
router.post('/deleteCategory'       , categoryController.deleteCategory);
router.get('/getCategory'           , categoryController.getCategories);
router.post('/getCategoryById'           , categoryController.getCategoryById);

module.exports = router;
