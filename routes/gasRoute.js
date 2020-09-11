const express = require('express');
const router = express.Router();

const gasController = require('../controllerrs/gasController');

router.get('/get/getLastPressureBySerialNumber', gasController.getLastPressureBySerialNumber );


//POST

router.post('/post/collectPressureIoT',gasController.collectPressureIoT);

module.exports = router;

