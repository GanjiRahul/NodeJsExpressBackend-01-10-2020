
const express = require('express');
const router = express.Router();
const productSizeController = require('../controller/productSize.cont');

router.post('/addAndUpdateProductSize' ,productSizeController.addAndUpdateProductSize);
router.post('/deleteProductSize' ,productSizeController.deleteProductSize);
router.get('/getProductSize' ,productSizeController.getProductSize);
router.post('/getProductSizeById' ,productSizeController.getProductSizeById);

module.exports = router;
