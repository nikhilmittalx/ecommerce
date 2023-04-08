const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
    },
    email:{
        type:String,
        required:[true, "Please enter your email"],
        unique:true,
        validate:[validator.isEmail, "Please enter a valid Email"],
    },
    password:{
        type:String,
        required:[true, "Please enter your Password"],
        minLength:[8, "Password must be greater than 8 characters"],
        select:false,  // select: false makes field values not accessible using "this
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

})

// arrow function me "this" ka use nhi kr skte
// pre mtlb save hone se pehle hoga ye(ye mongoose ke hooks h)

userSchema.pre("save", async function(next){
    // agr phle se hash hoga to vapis ni krega..seedha else me jaega
    if(!this.isModified("password")){
        next();
    }
    else{
        this.password = await bcrypt.hash(this.password, 10)
    }
})

// JWT TOKEN
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}


// compare password
// false de rha h har time
userSchema.methods.comparePassword = async function (password) {
    // console.log(await bcrypt.compare(password, this.password))
    return await bcrypt.compare(password, this.password);
    // return true;
}



// generating password reset token
userSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
}


module.exports = mongoose.model("User", userSchema);