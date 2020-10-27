const express = require('express');
const router = express.Router();

const appGasController = require('../controllerrs/appGasController');
const appOrderController = require('../controllerrs/appOrderController');
const appUserManageController = require('../controllerrs/appUserManageController');
const userController = require('../controllerrs/userController');
const appIoTController = require('../controllerrs/appIoTManageController');
const gasController = require('../controllerrs/gasController');
const appDriverController = require('../controllerrs/appDriverManageController');



// router.get('/get/getGasType',appGasController.getGasDetail);
// router.get('/get/getOrderGasById',appGasController.getOrderGasById);
//router.get('/get/getUserDetailById',appUserManageController.getUserDetailById)

//===== General ===== //
router.get('/get/province',userController.getProvince);
router.get('/get/amphure',userController.getAmphure) ;
router.get('/get/district',userController.getDistrict);




//===== login =====//
router.post('/post/login',appUserManageController.userLogin)



//===== User Management =====//

router.post('/post/registerUser',appUserManageController.registerUser);
router.post('/post/edit/user',appUserManageController.editUserByUserId);
router.post('/post/delete/user',appUserManageController.deleteUserByUserId);



//===== User address mamagement =====//

router.get('/get/userAddressByUserId',appUserManageController.getUserAddressByUserId);
router.get('/get/userAddressByAddressId',appUserManageController.getUserAddressByAddressId);

router.post('/post/add/userAddress',appUserManageController.addUserAddress);
router.post('/post/edit/userAddress',appUserManageController.editUserAddress);
router.post('/post/delete/userAddress',appUserManageController.deleteUserAddress);




//===== Rider Management =====//
router.post('/post/registerDriver',appDriverController.registerRider);
router.post('/post/edit/driver',appDriverController.editRiderByRiderId);
router.post('/post/delete/driver',appDriverController.deleteRiderByRiderId);




//===== Order =====//



//===== IoT =====//

router.get('/get/iot/iotByUserId',appIoTController.getIoTByUserId);
router.get('/get/iot/iotAll',appIoTController.getIoTDeviceAll);

router.post('/post/add/iot',appIoTController.registerIoT);
router.post('/post/edit/iot',appIoTController.editIotByUserId);
router.post('/post/delete/iot',appIoTController.deleteIoTByUserId);


//===== GAS =====//
router.get('/get/gas/detail',appGasController.getGasDetail);

router.get('/get/iot/gas/percentPressure',appGasController.getPercentPressureBySerialNumber);



module.exports = router;
