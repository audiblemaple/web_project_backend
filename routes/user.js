const express = require('express');
const {
    signupUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser
} = require('../controllers/userController')

const router = express.Router();

// ROUTE HANDLERS

// GET all users
router.get('/', getAllUsers);

//GET a single user
router.get('/:id', getUser);

// login
router.post('/login', loginUser);


// signup
router.post('/signup', signupUser);

//forgot password and reset password
router.post('/forgot_password', forgotPassword);
router.patch('/reset_password/:token', resetPassword);

//DELETE a user
router.delete('/:id', deleteUser);

//PATCH (update) a user
router.patch('/:id', updateUser);

module.exports = router;