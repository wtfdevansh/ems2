const express = require('express');
const router = express.Router();

const dashcontroller = require('../controllers/dashboard.controller');
const authcontroller = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');


router.get('/user/:email', authcontroller ,  dashcontroller.user);
router.put('/user/:email', authcontroller, dashcontroller.editUser);
router.post('/admin', authcontroller, dashcontroller.admin);

// Profile photo upload and retrieval routes
router.post('/user/:email/upload-photo', authcontroller, upload.single('profilePhoto'), dashcontroller.uploadProfilePhoto);
router.get('/user/:email/profile-photo', dashcontroller.getProfilePhoto);

// Admin routes
router.get('/admin/users', authcontroller, dashcontroller.getAllUsers);
router.get('/admin/access-requests', authcontroller, dashcontroller.getAccessRequests);
router.put('/admin/user/:email/role-project', authcontroller, dashcontroller.updateUserRoleAndProject);
router.put('/admin/user/:email/access', authcontroller, dashcontroller.updateUserAccess);

module.exports = router;