const express = require('express');
const router = express.Router();

const appGasController = require('../controllerrs/appGasController');
const appOrderController = require('../controllerrs/appOrderController');
const appUserManageController = require('../controllerrs/appUserManageController');
const userController = require('../controllerrs/userController');
const appIoTController = require('../controllerrs/appIoTManageController');



router.get('/get/getGasType',appGasController.getGasDetail);
router.get('/get/getOrderGasById',appGasController.getOrderGasById);

router.get('/get/province',userController.getProvince);
router.get('/get/amphure',userController.getAmphure) ;
router.get('/get/district',userController.getDistrict);

router.get('/get/getUserDetailById',appUserManageController.getUserDetailById)



// login 
router.post('/post/login',appUserManageController.userLogin)

// User Management 

router.post('/post/registerUser',appUserManageController.registerUser);

// User address mamagement

router.get('/get/userAddressByUserId',appUserManageController.getUserAddressByUserId);

router.get('/get/userAddressByAddressId',appUserManageController.getUserAddressByAddressId);

router.post('/post/add/userAddress',appUserManageController.addUserAddress);

router.post('/post/edit/userAddress',appUserManageController.editUserAddress);

router.post('/post/delete/userAddress',appUserManageController.deleteUserAddress);



// Order 



// IoT

router.post('/post/add/iot',appIoTController.registerIoT);


module.exports = router;
