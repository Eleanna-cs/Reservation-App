const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');


router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);


router.get('/', authMiddleware, authorizeRoles('admin'), userController.getAllUsers);
router.get('/:id', authMiddleware, authorizeRoles('admin'), userController.getUserById);
router.put('/:id', authMiddleware, authorizeRoles('admin'), userController.updateUserByAdmin);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), userController.deleteUser);




module.exports = router;
