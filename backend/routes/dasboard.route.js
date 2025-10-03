const express = require('express');
const router = express.Router();

const dashcontroller = require('../controllers/dashboard.controller');
const authcontroller = require('../middlewares/auth.middleware')


router.get('/user/:email', authcontroller ,  dashcontroller.user);
router.post('/admin', authcontroller, dashcontroller.admin);


module.exports = router;