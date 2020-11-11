const express = require('express');
const router = express.Router();

const appGasController = require('../controllerrs/appGasController');
//const appOrderController = require('../controllerrs/appOrderController');
const appUserManageController = require('../controllerrs/appUserManageController');
const userController = require('../controllerrs/userController');
const appIoTController = require('../controllerrs/appIoTManageController');
const gasController = require('../controllerrs/gasController');
const appDriverController = require('../controllerrs/appDriverManageController');
const appGeneralController = require('../controllerrs/appGeneralController');
const appOrderController = require('../controllerrs/appOrderManageController');
const appOrderManageController = require('../controllerrs/appOrderManageController');




// router.get('/get/getGasType',appGasController.getGasDetail);
// router.get('/get/getOrderGasById',appGasController.getOrderGasById);

//===== General ===== //
router.get('/get/province',appGeneralController.getProvince);
router.get('/get/amphure',appGeneralController.getAmphure) ;
router.get('/get/district',appGeneralController.getDistrict);
router.get('/get/bankAll',appGeneralController.getBankAll);
router.get('/get/paymentChannel',appGeneralController.getPaymentChannel);




//===== login =====//
router.post('/post/login',appUserManageController.userLogin);
router.post('/post/loginDriver',appDriverController.driverLogin);



//===== User Management =====//
router.get('/get/getUserDetailById',appUserManageController.getUserDetailById)

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
router.get('/get/driverBankByDriverId',appDriverController.getDriverBankByDriverId);
router.get('/get/driverBankById',appDriverController.getDriverBankById);

router.get('/get/getDriverProfileById',appDriverController.getDriverProfileById);


router.post('/post/registerDriver',appDriverController.registerRider);
router.post('/post/edit/driver',appDriverController.editRiderByRiderId);
router.post('/post/delete/driver',appDriverController.deleteRiderByRiderId);

router.post('/post/add/bankDriver',appDriverController.addDriverBank);
router.post('/post/edit/bankDriver',appDriverController.editDriverBank);
router.post('/post/delete/bankDriver',appDriverController.deleteDriverBank);

router.post('/post/edit/driver/workStatus',appDriverController.editStatusWorkByRiderId)



//===== Cart =====//
router.get('/get/cart/cartByuserId',appOrderController.getOrderInCartByUserId);

router.post('/post/add/cart',appOrderController.addOrderInCartByUserId);
router.post('/post/edit/cart',appOrderController.editOrderInCartById);
router.post('/post/delete/cart',appOrderController.deleteOrderInCartById);


//===== Order =====//
//user
//router.get('/get/orderUser/orderByUserId',appOrderController.getOrderByUserId);
router.get('/get/orderUser/orderHistoryAllByUserId',appOrderManageController.getOrderHistoryAllByUserId);
router.get('/get/orderUser/orderByOrderId',appOrderManageController.getOrderByOderId);
// router.get()

router.post('/post/add/orderUser',appOrderController.addOrderUser);
router.post('/post/edt/orderUser',appOrderController.editOrderUser);
router.post('/post/delete/orderUser',appOrderController.cancalOrderUser);

//driver

router.get('/post/driver/distance',appOrderController.sendOrderToDriver);




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
