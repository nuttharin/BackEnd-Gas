const express = require('express');
const router = express.Router();

const appGasController = require('../controllers/appGasController');
//const appOrderManageController = require('../controllers/appOrderManageController');
const appUserManageController = require('../controllers/appUserManageController');
const userController = require('../controllers/userController');
const appIoTController = require('../controllers/appIoTManageController');
const gasController = require('../controllers/gasController');
const appDriverManageController = require('../controllers/appDriverManageController');
const appGeneralController = require('../controllers/appGeneralController');
//const appOrderManageController = require('../controllers/appOrderManageController');
const appOrderManageController = require('../controllers/appOrderManageController');
const appBankManageController = require('../controllers/appBankManageController'); 
const machineManageController = require('../controllers/machineManageController');
const {verifyAccessToken , RefreshToken} = require('../controllers/appTokenManageController');





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
router.post('/post/loginDriver',appDriverManageController.driverLogin);
router.post('/post/refreshToken',RefreshToken)



//===== User Management =====//
router.get('/get/getUserDetailById',appUserManageController.getUserDetailById);
router.get('/get/getUserByIdCard' ,appUserManageController.getUserByIdCard)

router.post('/post/registerUser',appUserManageController.registerUser);
router.post('/post/edit/user',appUserManageController.editUserByUserId);
router.post('/post/delete/user',appUserManageController.deleteUserByUserId);
router.post('/post/edit/user/profile',appUserManageController.editUserPicProfileByUserId);
router.post('/post/edit/user/password',appUserManageController.editPasswordUserByUserId) ;



//===== User address mamagement =====//

router.get('/get/userAddressByUserId',appUserManageController.getUserAddressByUserId);
router.get('/get/userAddressByAddressId',appUserManageController.getUserAddressByAddressId);

router.post('/post/add/userAddress',appUserManageController.addUserAddress);
router.post('/post/edit/userAddress',appUserManageController.editUserAddress);
router.post('/post/delete/userAddress',appUserManageController.deleteUserAddress);




//===== Rider Management =====//


router.get('/get/getDriverProfileById',appDriverManageController.getDriverProfileById);
router.get('/get/getDriverByIdCard', appDriverManageController.getDriverByIdCard);

router.post('/post/driver/statusActiveReceiveJobRider',appDriverManageController.statusActiveReceiveJobRider);
router.post('/post/driver/statusInactiveReceiveJobRider',appDriverManageController.statusInactiveReceiveJobRider);

router.post('/post/registerDriver',appDriverManageController.registerRider);
router.post('/post/edit/driver',appDriverManageController.editRiderByRiderId);
router.post('/post/delete/driver',appDriverManageController.deleteRiderByRiderId);
router.post('/post/edit/driver/profile',appDriverManageController.editRiderPicProfileByRiderId);
router.post('/post/edit/user/password', appDriverManageController.editPasswordDriverByDriverId);


router.post('/post/edit/driver/workStatus',appDriverManageController.editStatusWorkByRiderId);

router.post('/post/update/driver/position',appDriverManageController.updatePositionDriverByDriverId);
router.get('/get/driver/position',appDriverManageController.getPositionDriverByDriver);



router.post('/post/add/bankDriver',appBankManageController.addDriverBank);
router.post('/post/edit/bankDriver',appBankManageController.editDriverBank);
router.post('/post/delete/bankDriver',appBankManageController.deleteDriverBank);
router.get('/get/driverBankByDriverId',appBankManageController.getDriverBankByDriverId);
router.get('/get/driverBankById',appBankManageController.getDriverBankById);



//===== Cart =====//

router.get('/get/cart/cartByuserId',appOrderManageController.getOrderInCartByUserId);

router.post('/post/add/cart',appOrderManageController.addOrderInCartByUserId);
router.post('/post/edit/cart',appOrderManageController.editOrderInCartById);
router.post('/post/delete/cart',appOrderManageController.deleteOrderInCartById);


//===== Order =====//
//user
router.get('/get/orderUser/orderByUserId',appOrderManageController.getOrderByUserId);
router.get('/get/orderUser/orderHistoryAllByUserId',appOrderManageController.getOrderHistoryAllByUserId);
router.get('/get/orderUser/orderByOrderId',appOrderManageController.getOrderByOderId);


//flow order
router.post('/post/add/orderUser',appOrderManageController.addOrderUser);
router.get('/get/orderUser', appOrderManageController.getOrderByDriverId);
router.get('/get/orderUserByIdCard',appOrderManageController.getOrderByDriverIdCard);
router.post('/post/update/status/order' , appOrderManageController.updateStatusOrderByOrderId);
router.post('/post/order/checkQRcodeForDriver' , appOrderManageController.checkQRcodeForDriver);
router.post('/post/order/checkPwdFromMachineForReceive' , appOrderManageController.checkPwdFromMachineForReceive);
router.post('/post/order/checkPwdFromMachineForReturn' , appOrderManageController.checkPwdFromMachineForReturn);


router.post('/post/edit/orderUser',appOrderManageController.editOrderUser);
router.post('/post/delete/orderUser',appOrderManageController.cancalOrderUser);

router.post('/post/add/orderUser2',appOrderManageController.addOrderUser2)

//driver

router.get('/post/driver/distance',appOrderManageController.sendOrderToDriver);
router.post('/post/driver/driverReceiveOrder',appOrderManageController.driverReceiveOrder);
router.get('/get/driver/getOrderCurrentByDriverId' ,appOrderManageController.getDriverOrderReviceByDriverId);
router.get('/get/driver/findOrderNearDriver', appOrderManageController.findOrderNearDriver);
// router.get('')





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





// ===== machine ===== //
//router
router.post('/post/test1',machineManageController.test1)
router.post('/post/registerUserMachine', appUserManageController.registerUserMachine);

//router.post('/post/driver/checkQrCodeMachine/receiveGas',machineManageController.checkQrCodeMachineReceiveGasForDriver);
//router.post('/post/user/checkQrCodeMachine/receiveGas',machineManageController.checkQrCodeMachineReceiveGasForUser);

//router.post('/post/driver/checkQrCodeMachine/returnGas',machineManageController.checkQrCodeMachineReturnGasForDriver);
//router.post('/post/user/checkQrCodeMachine/returnGas',machineManageController.checkQrCodeMachineReturnGasForUser);

//router.post('/post/driver/checkPwdMachineStation',machineManageController.checkPwdMachineStation);



router.post('/post/machine/command/sendCommandToMachineGasOut' , machineManageController.sendCommandToMachineGasOut);
router.post('/post/fromMachine/update/quality/gasOut',machineManageController.updateGasOutInByOrderId);
router.post('/post/machine/command/testSendCommandToMachine' , machineManageController.testSendCommandToMachine);


router.post('/post/machine/command/sendCommandToMachineGasOut' , machineManageController.sendCommandToMachineGasOut);
router.post('/post/machine/command/sendCommandToMachineGasIn' , machineManageController.sendCommandToMachineGasIn);


router.get('/get/machine/getMachineCodeFromIP',machineManageController.getMachineCodeFromIP);

router.post('/post/machine/command/testOut' , machineManageController.testGasOut);
router.post('/post/machine/command/testIn' , machineManageController.testGasIn);
router.post('/post/machine/command/testInOut' , machineManageController.testGasInOut);


// =====  Bank  ===== //

router.get("/get/bank/driver/getMoneyHistoryInBankByDriverId",appBankManageController.getMoneyHistoryInBankByDriverId);
router.get("/get/bank/driver/getMoneyInBankByDriverBankId",appBankManageController.getMoneyInBankByDriverBankId);


module.exports = router;
