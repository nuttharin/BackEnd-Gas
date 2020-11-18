const express = require('express');
const router = express.Router();

const appGasController = require('../controllerrs/appGasController');
//const appOrderManageController = require('../controllerrs/appOrderManageController');
const appUserManageController = require('../controllerrs/appUserManageController');
const userController = require('../controllerrs/userController');
const appIoTController = require('../controllerrs/appIoTManageController');
const gasController = require('../controllerrs/gasController');
const appDriverManageController = require('../controllerrs/appDriverManageController');
const appGeneralController = require('../controllerrs/appGeneralController');
//const appOrderManageController = require('../controllerrs/appOrderManageController');
const appOrderManageController = require('../controllerrs/appOrderManageController');
const {verifyAccessToken , RefreshToken} = require('../controllerrs/appTokenManageController');





// router.get('/get/getGasType',appGasController.getGasDetail);
// router.get('/get/getOrderGasById',appGasController.getOrderGasById);

//===== General ===== //
router.get('/get/province',verifyAccessToken,appGeneralController.getProvince);
router.get('/get/amphure',appGeneralController.getAmphure) ;
router.get('/get/district',appGeneralController.getDistrict);
router.get('/get/bankAll',appGeneralController.getBankAll);
router.get('/get/paymentChannel',appGeneralController.getPaymentChannel);




//===== login =====//
router.post('/post/login',appUserManageController.userLogin);
router.post('/post/loginDriver',appDriverManageController.driverLogin);
router.post('/post/refreshToken',RefreshToken)



//===== User Management =====//
router.get('/get/getUserDetailById',appUserManageController.getUserDetailById);

router.post('/post/registerUser',appUserManageController.registerUser);
router.post('/post/edit/user',appUserManageController.editUserByUserId);
router.post('/post/delete/user',appUserManageController.deleteUserByUserId);
router.post('/post/edit/user/profile',appUserManageController.editUserPicProfileByUserId);



//===== User address mamagement =====//

router.get('/get/userAddressByUserId',appUserManageController.getUserAddressByUserId);
router.get('/get/userAddressByAddressId',appUserManageController.getUserAddressByAddressId);

router.post('/post/add/userAddress',appUserManageController.addUserAddress);
router.post('/post/edit/userAddress',appUserManageController.editUserAddress);
router.post('/post/delete/userAddress',appUserManageController.deleteUserAddress);




//===== Rider Management =====//
router.get('/get/driverBankByDriverId',appDriverManageController.getDriverBankByDriverId);
router.get('/get/driverBankById',appDriverManageController.getDriverBankById);

router.get('/get/getDriverProfileById',appDriverManageController.getDriverProfileById);


router.post('/post/registerDriver',appDriverManageController.registerRider);
router.post('/post/edit/driver',appDriverManageController.editRiderByRiderId);
router.post('/post/delete/driver',appDriverManageController.deleteRiderByRiderId);
router.post('/post/edit/driver/profile',appDriverManageController.editRiderPicProfileByRiderId);

router.post('/post/add/bankDriver',appDriverManageController.addDriverBank);
router.post('/post/edit/bankDriver',appDriverManageController.editDriverBank);
router.post('/post/delete/bankDriver',appDriverManageController.deleteDriverBank);

router.post('/post/edit/driver/workStatus',appDriverManageController.editStatusWorkByRiderId);

router.post('/post/add/driver/position',appDriverManageController.updatePositionDriverByDriverId);
router.get('/get/driver/position',appDriverManageController.getPositionDriverByDriver);



//===== Cart =====//
router.get('/get/cart/cartByuserId',appOrderManageController.getOrderInCartByUserId);

router.post('/post/add/cart',appOrderManageController.addOrderInCartByUserId);
router.post('/post/edit/cart',appOrderManageController.editOrderInCartById);
router.post('/post/delete/cart',appOrderManageController.deleteOrderInCartById);


//===== Order =====//
//user
//router.get('/get/orderUser/orderByUserId',appOrderManageController.getOrderByUserId);
router.get('/get/orderUser/orderHistoryAllByUserId',appOrderManageController.getOrderHistoryAllByUserId);
router.get('/get/orderUser/orderByOrderId',appOrderManageController.getOrderByOderId);
// router.get()

router.post('/post/add/orderUser',appOrderManageController.addOrderUser);
router.post('/post/edt/orderUser',appOrderManageController.editOrderUser);
router.post('/post/delete/orderUser',appOrderManageController.cancalOrderUser);

//driver

router.get('/post/driver/distance',appOrderManageController.sendOrderToDriver);
router.post('/post/driver/driverReceiveOrder',appOrderManageController.driverReceiveOrder);
router.get('/get/driver/getOrderCurrentByDriverId' ,appOrderManageController.getDriverOrderReviceByDriverId);




//===== IoT =====//

router.get('/get/iot/iotByUserId',appIoTController.getIoTByUserId);
router.get('/get/iot/iotAll',appIoTController.getIoTDeviceAll);

router.post('/post/add/iot',appIoTController.registerIoT);
router.post('/post/edit/iot',appIoTController.editIotByUserId);
router.post('/post/delete/iot',appIoTController.deleteIoTByUserId);
router.post('/post/reset/iot' , appIoTController.resetGasIoT) ;


//===== GAS =====//
router.get('/get/gas/detail',appGasController.getGasDetail);
router.get('/get/iot/gas/percentPressure',appGasController.getPercentPressureBySerialNumber);



module.exports = router;
