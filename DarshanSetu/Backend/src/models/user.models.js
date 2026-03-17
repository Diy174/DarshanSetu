import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt" //for secure password storage
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2' //for efficient paginated queries
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    phoneno:{
        type: Number,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true,'password is required']
    },
    refreshToken: {
        type: String
    }
},{timestamps: true})

userSchema.pre("save",async function () {
    if(!this.isModified("password")) return ;
    if (typeof this.password === 'string' && this.password.startsWith('$2')) {
        return;
    }
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    if (!candidatePassword) {
        console.warn('[AUTH DEBUG] isPasswordCorrect called with empty candidatePassword for user:', this._id);
        return false;
    }
    if (!this.password) {
        console.warn('[AUTH DEBUG] isPasswordCorrect: stored hash missing for user:', this._id);
        return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            phoneno:this.phoneno,
            firstname: this.firstname,
            lastname: this.lastname,
           
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.plugin(mongooseAggregatePaginate)

export const User = mongoose.model("User",userSchema)