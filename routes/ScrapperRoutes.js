const express = require('express');
const multer = require('multer');
const upload = multer();

const { getScrapperData }  = require('../Scrapper_controllers/Scrapper');

const router = express.Router();
 
router.post('/scrapper/data', getScrapperData);
 

module.exports = router;