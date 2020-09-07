const express = require('express');
const router = express.Router();

const userController = require('../controllerrs/userController');

router.get('/get/province', userController.getProvince );
router.get('/get/amphure',userController.getAmphure) ;
router.get('/get/district',userController.getDistrict) ;



module.exports = router;