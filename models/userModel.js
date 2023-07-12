const mongoose = require('mongoose');
const validator = require ('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please tell your name']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        validate: [validator.isEmail]
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
}, { timestamps: true});


// static signup method
// we are using 'this' keyword so we must use regular function (instead of an arrow function)

userSchema.statics.renewPassword = async function (new_password) {
    console.log(new_password);
    
    // using salt and hashing the password with it
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);

    return hash;
}

userSchema.statics.signup = async function(username ,password, email) {
    
    const exists = await this.findOne({ email })

    // although email is unique we want to address this error
    if (exists) {
        throw Error('Email already in use');
    }

    // using salt and hashing the password with it
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        username,
        password: hash,
        email
    })

    return user;
}

// static login method
userSchema.statics.login = async function(password, email) {
    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Incorrect Email');
    }

    // password from browser - not hashed ; user.password - hashed 
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect Password');
    }

    return user;
}

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 30 * 60 * 1000

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
