const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email');
const crypto = require('crypto');

// create token
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '90d'})
}

const createSendToken = (user, res) => {
    const token = createToken(user._id);

        res.status(201).json({
            status: "success",
            username: user.username,
            email: user.email,
            token,
            user_id: user._id
        })
}

// login user
const loginUser = async (req, res) => {
    const {password, email} = req.body;
    
    // add doc to DB
    try {
        const user = await User.login(password, email);
        
        // create and send token
        createSendToken(user, res);
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

// signup user
const signupUser = async (req, res) => {
    const {username, password, email} = req.body;

    // add doc to DB
    try {
        const user = await User.signup(username, password, email);

        // create and send token
        createSendToken(user, res);

        // send welcome email
        await new Email(user, null).sendWelcome();

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}

// renew password
const forgotPassword = async (req, res) => {
    // Get user based on email
    const user = await User.findOne({ email: req.body.email });
    try {
        if (!user) {
            throw Error('Email does not exists');
        }

        // Generate the random reset token
        const resetToken = await user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});

        // Send it to user's email
        // const resetURL = `${req.protocol}://${req.get(
        //     'host'
        //     )}/api/user/reset_password/${resetToken}`;

        res.status(200).json({
            status: "success",
            message: 'Password reset token generated and sent to email',
            // resetToken - not in res, only on email!
        })


        // await new Email(user, resetURL).sendPasswordReset();
        await new Email(user, resetToken).sendPasswordReset();


    } catch (error) {
        if (user) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validateBeforeSave: false});
        }
        const status_code = !user ? 400 : 500;
        res.status(status_code).json({
            status: 'fail',
            error: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    // get user based on token
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({ 
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now() }
    });

    try {
        // If token has not expired, and there is user, set new password
        if (!user) {
            throw Error('Token is invalid or expired');
        }

        // send user.password to userModel function so it will hash it
        const new_password = await User.renewPassword(req.body.password);

        user.password = new_password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // create and send token
        createSendToken(user, res);

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error.message
        })
    }
}


// get all users
const getAllUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});

    res.status(200)
    .json({
        status: 'success',
        requstedAt: req.requestTime,
        users
    });
}

// get a single user
const getUser = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            status: 'fail',
            error: 'Invalid user id'
        })
    }

    const user = await User.findById(id)

    checkUserStatus(user, res);
}

// delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            status: 'fail',
            error: 'Invalid user id'
        })
    }

    const user = await User.findOneAndDelete({_id: id})

    checkUserStatus(user, res);
}

// update a user
const updateUser = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            status: 'fail',
            error: 'Invalid user id'
        })
    }

    const user = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    checkUserStatus(user, res);
}

// inner function to check if user is null and then
// generate a response accordingly
function checkUserStatus (user, res) {
    if (!user) {
        return res.status(400).json({
            status: 'fail',
            error: 'No such user'
        })
    }
    
    res.status(200).json({
        status: 'success',
        user
    });
}


module.exports = {
    signupUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser
}