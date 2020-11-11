const express = require('express');
const router = express.Router();

const gasController = require('../controllerrs/gasController');

//GET
router.get('/get/getLastPressureBySerialNumber', gasController.getLastPressureBySerialNumber );
router.get('/get/getPercentPressureBySerialNumber',gasController.getPercentPressureBySerialNumber) ;





//POST

router.post('/post/collectPressureIoT2',gasController.collectPressureIoT2);
router.post('/post/registerGasToT',gasController.registerGasIoT)

module.exports = router;

