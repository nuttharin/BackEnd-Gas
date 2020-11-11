const express = require('express');
const router = express.Router();

const userController = require('../controllerrs/userController');

// endpoint+/user 
// router.get('/get/province', userController.getProvince );
// router.get('/get/amphure',userController.getAmphure) ;
// router.get('/get/district',userController.getDistrict) ;
router.get('/get/positionByUserid',userController.getPositionByUserid) ;
router.get('/get/getOrderByProvince',userController.getOrderByProvince);
router.get('/get/getOrderByRiderId',userController.getOrderByRiderId);
//router.get('/get/getOrderAll',userController.getOrderAll);

// router.get('/get/')


//POST
router.post('/post/userPosition',userController.userAddPosition) ;
router.post('/post/userOrderGas',userController.userOrderGas) ;



module.exports = router;