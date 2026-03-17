import mongoose, { Schema } from 'mongoose'

const visitorDetailSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    aadhaar: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhaar must be exactly 12 digits'
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['visitor', 'elder', 'differentlyAbled']
    }
}, { _id: false })

const bookingSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    visitorDetails: {
        type: [visitorDetailSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0 && v.length <= 10;
            },
            message: 'Must have between 1 and 10 visitors'
        }
    },
    visitors: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    city: {
        type: String,
        required: true
    },
    elders: {
        type: Number,
        default: 0,
        min: 0
    },
    differentlyAbled: {
        type: Number,
        default: 0,
        min: 0
    },
    temple: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        default: "SCHEDULED",
        enum: ["SCHEDULED", "COMPLETED", "CANCELLED"]
    }
}, {
    timestamps: true
})

bookingSchema.index({ temple: 1, date: 1, slot: 1, status: 1 })
bookingSchema.index({ bookedBy: 1, createdAt: -1 })

export const Booking = mongoose.model("Booking", bookingSchema)

export default Booking