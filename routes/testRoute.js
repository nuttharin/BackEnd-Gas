const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');

router.get('/testMongodb', testController.testMongodb);
router.get('/testPostgres',testController.testPostgres);


module.exports = router;