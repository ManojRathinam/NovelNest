const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require("uuid")

const User = require('../models/userModel')
const HttpError = require("../models/errorModel")


/// ======================REGISTER A NEW USER
// POST: api/users/register
// unprotected
const reigsterUser = async(req, res, next) => {
    try {
        const {name, email, password, password2} = req.body;
        if(!name || !email || !password){
            return next(new HttpError("Fill in all feilds.", 422))
        }

        const newEmail = email.toLowerCase()

        const emailExists = await User.findOne({email: newEmail})
        if(emailExists){
            return next(new HttpError("Email already exists",422))
        }

        if((password.trim()).length < 6){
            return next(new HttpError("Password should be atleast 6 characters.",422))
        }

        if(password != password2){
            return next(new HttpError("Password not matched.",422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({name, email: newEmail, password: hashedPass})
        res.status(201).json(`New User ${newUser.email} registered.`)

    } catch (error){
        return next(new HttpError("User registeration failed.",422))
    }
}







/// ======================LOGIN A REGISTERED USER
// POST: api/users/login
// unprotected
const loginUser = async(req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return next(new HttpError("Fill all the fields.",422))
        }
        const newEmail = email.toLowerCase();

        const user = await User.findOne({email : newEmail})
        if(!user){
            return next(new HttpError("Invalid Creditials.",422))
        }

        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return next(new HttpError("Invalid Creditials.",422))
        }

        const{_id: id,name} = user;const token = jwt.sign({id, name},process.env.JWT_SECRET, {expiresIn: "1d"})

        res.status(200).json({token,id,name})
    }catch(error){
        return next(new HttpError("Login Failed. Please check your credentials.",422))
    }
}






/// ====================== USER PROFILE
// POST: api/users/:id
//protected
const getUser = async(req, res, next) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if(!user){
            return next(new HttpError("User not found.",404))
        }
        res.status(200).json(user);
    } catch(error){
        return next(new HttpError(error))
    }
}






/// ======================CHANGE USER AVATAR
// POST: api/users/change-avatar
// protected
const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("Please choose an image.", 422));
        }

        const { avatar } = req.files;
        const user = await User.findById(req.user.id);

        // Delete old avatar if it exists
        if (user.avatar) {
            // Construct the path to the old avatar
            const oldAvatarPath = path.join(__dirname, '..', 'uploads', user.avatar);

            // Remove the old avatar file
            fs.unlink(oldAvatarPath, (err) => {
                if (err) {
                    console.error("Error deleting old avatar:", err);
                }
            });
        }

        // Check file size
        if (avatar.size > 500000) {
            return next(new HttpError("Profile picture should be less than 500kb"), 422);
        }

        // Generate unique filename for the new avatar
        const fileName = uuid() + '_' + avatar.name;
        const uploadPath = path.join(__dirname, '..', 'uploads', fileName);

        // Move the uploaded file to the uploads folder
        avatar.mv(uploadPath, async (err) => {
            if (err) {
                console.error("Error saving avatar:", err);
                return next(new HttpError(err));
            }

            // Update user's avatar in the database
            user.avatar = fileName;
            const updatedUser = await user.save();

            res.status(200).json(updatedUser);
        });
    } catch (error) {
        console.error("Error in changeAvatar:", error);
        return next(new HttpError("Failed to change avatar.", 500));
    }
}








/// ======================EDIT USER DETAILS FROM PROFILE
// POST: api/users/edit-User
// protected
const editUser = async(req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, newConfirmPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword){
            return next(new HttpError("Fill in all fields.",422))
        }
        const user = await User.findById(req.user.id);
        if(!user){
            return next(new HttpError("User not found.",403))
        }

        // Make sure new email doesn't exist already
        const emailExist = await User.findOne({email});
        if(emailExist && (emailExist._id != req.user.id)){
            return next(new HttpError("Email already exists.",422))
        }
        // Compare current password to db password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if(!validateUserPassword){
            return next(new HttpError("Invalid current password",422))
        }

        // Compare new Password
        if(newPassword != newConfirmPassword){
            return next(new HttpError("New Password do not match.",422))
        }

        // Hash new Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword,salt);

        // Update user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hashedPassword}, {new: true})
        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError(error))
    }
}











/// ======================GET AUTHORS
// POST: api/users/edit-User
// protected
const getAuthors = async(req, res, next) => {
    try{
        const authors = await User.find().select('-password')
        res.json(authors);
    } catch(error){
        return next(new HttpError(error))
    }
}

module.exports = {reigsterUser,loginUser,getUser,changeAvatar,editUser,getAuthors}
