
const express = require('express');
const router = express.Router();
const productController = require('../controller/product.cont');

router.post('/addAndUpdateProduct' , productController.addAndUpdateProduct);
router.post('/deleteProduct' , productController.deleteProduct);
router.get('/getProduct' , productController.getProduct);

module.exports = router;
