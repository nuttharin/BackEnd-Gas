const express = require('express');
const router = express.Router();

const userController = require('../controllerrs/userController');

// endpoint+/user 
router.get('/get/province', userController.getProvince );
router.get('/get/amphure',userController.getAmphure) ;
router.get('/get/district',userController.getDistrict) ;


//POST
router.post('/post/userPosition',userController.userAddPosition)



module.exports = router;