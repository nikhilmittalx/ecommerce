const catchAsyncErrors = require("../middleware/catchAsyncError")
const ErrorHandler = require("../utils/errorHandler")
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const Product = require("../models/productModel");
const cloudinary = require("cloudinary")
const bcrypt = require("bcryptjs")

// Registering a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    const { name, email, password, avatar } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            // public_id: avatar.public_id,
            // url: avatar.url,
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    console.log(password)
    sendToken(user, 201, res);
})

// Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({ email: email }).select("+password");
    // console.log(user);
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);
    // console.log(user.password, password)
    // const isPasswordMatched = await bcrypt.compare(password, user.password);
    // console.log("yaha tak pahunch gya");
    // console.log(isPasswordMatched)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password1", 401))
    }

    sendToken(user, 200, res);
    // iske liye function bna dia jwtToken file me
    // const token = user.getJWTToken()
    // res.status(200).json({
    //     success:true,
    //     token,
    // })
})



// logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});



// forgot password 
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    // get reset token 
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recobery`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

})


// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400))
    }

    if (req.params.password !== req.params.confirmPassword) {
        return next(new ErrorHandler("Password doesnt match", 400))
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})


// get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    // aisa kabhi nhi hoga ki user na mile kyuki ye route access hi vo kr skega jo log in hoga already
    res.status(200).json({
        success: true,
        user
    })
})

// update user password 
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        console.log("purana != new pass")
        return next(new ErrorHandler("Old password is incorrect", 400))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400))
    }
    user.password = req.body.newPassword;
    await user.save();
    // sendToken(user, 200, res);

    res.status(200).json({
        success: true,
        user
    })
})



// update user profile 
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // we will add cloudinary later -- ab dal diya
    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    })

    res.status(200).json({
        success: true,
    })
})

// get all users (admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
})


// get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`, 400))
    }
    res.status(200).json({
        success: true,
        user,
    })
})


// update user role --admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.user.role
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    })

    res.status(200).json({
        success: true,
    })
})

// update user --Admin 
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id)
    if (!user) {
        return next(new ErrorHandler(`user doesn't exist with id : ${req.params.id}`))
    }
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

// // create new review or update review
// exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
//     const { rating, comment, productId } = req.body;
//     const review = {
//         user: req.user._id,
//         name: req.user.name,
//         rating: Number(rating),
//         comment,
//     }
//     const product = await Product.findById(productId);

//     const isReviewed = product.review.find((rev) => rev.user.toString() === req.user._id)

//     if (isReviewed) {
//         product.reviews.forEach((rev) => {
//             if (rev.user.toString() === req.user._id.toString())
//                 rev.rating = rating,
//                     rev.comment = comment
//         })
//     }
//     else {
//         product.reviews.push(review)
//         product.numOfReviews = product.reviews.length
//     }
//     let avg = 0;
//     product.reviews.forEach(rev => {
//         avg += rev.rating
//     })

//     product.ratings = avg / product.reviews.length

//     await product.save({ validateBeforeSave: false })

//     res.status(200).json({
//         success: true,
//     })
// })


// // get all reviews of a product
// exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
//     const product = await Product.findById(req.user.id);
//     if (!product) {
//         return next(new ErrorHandler("Product not found", 404))
//     }
//     res.status(200).json({
//         success: true,
//         reviews: product.reviews
//     })
// })

// // delete review
// exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
//     const product = await Product.findById(req.user.productId);
//     if (!product) {
//         return next(new ErrorHandler("Product not found", 404))
//     }

//     const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id)

//     let avg = 0;
//     reviews.forEach(rev => {
//         avg += rev.rating
//     })
//     const ratings = avg / reviews.length
//     const numOfReviews = reviews.length
//     await product.findByIdAndUpdate(
//         req.query.productId,
//         {
//             reviews,
//             ratings,
//             numOfReviews,
//         },
//         {
//             new: true,
//             runValidators: true,
//             useFindAndModify: false,
//         }
//     )

//     res.status(200).json({
//         success: true,
//         reviews: product.reviews
//     })
// })