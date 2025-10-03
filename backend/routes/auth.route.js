const express = require('express');
const router = express.Router();

const authcontroller = require('../controllers/auth.controller');
const validateRegister = require('../middlewares/validateRegister.middleware');



router.post('/login', authcontroller.login);
router.post('/register', validateRegister , authcontroller.register);


module.exports = router;