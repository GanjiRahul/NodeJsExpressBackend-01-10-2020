var express  = require('express');
var router   = express.Router();
var user = require('./user');
var category =  require('./category');
var product  = require('./product');
var productSize = require('./productSize');
const fetch = require('node-fetch');
const userModel = require('../model/user');


  isAuth = (req, res, next) => {
    console.log('req.header.authorization :',req.headers.authorization ,  req.headers.authorization != 'undefined');
    if(req.headers.authorization != 'undefined'){
      var parseObj =  JSON.parse(req.headers.authorization)
      console.log('res obj :',parseObj.profile.email ,' token :: ' , parseObj.token);
      fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.headers.authorization}` , {method:'get'}).then(
        function(response) {
          console.log('typeof : ' ,  response ,'response.status :' ,response.status);
          if(response.status == 200 && response.status == 'OK'){
            userModel.findOne({ email:'' }, async (err, user) => {
                          if (err)
                            return res.status(500).send({ message: 'There was a problem finding the user' });
                          if(!user)
                            return res.status(500).send({ message: 'Unable to login user' });
                          req.user = {
                            _id           : user._id,
                            email         : user.email,
                          };
                          next();
            });
          }
        })
      .catch(function(error) {
        console.log('error :',error);
      })
    }
  };


router.use('/apis/*', isAuth);
// router.post('/apis/userAuth', isAuth);
router.use('/api/user',user)
// router.use('/apis/category',category);
router.use('/api/category',category);
// router.use('/apis/product',product);
router.use('/api/product',product);
// router.use('/apis/productSize',productSize);
router.use('/api/productSize',productSize);

module.exports = router;