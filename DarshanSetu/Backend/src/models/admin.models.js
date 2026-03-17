
import mongoose, {Schema} from 'mongoose'

const loginSchema = new Schema({
    contactNo: {
        type: String,
        required: true
    },
    temple_id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    mapUrl: {
        type: String,
        default: null
    },
    mapPublicId: {
        type: String,
        default: null
    }
}, {timestamps: true})

export const Admin = mongoose.model("Admin", loginSchema)