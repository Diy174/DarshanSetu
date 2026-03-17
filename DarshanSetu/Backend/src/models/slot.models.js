import mongoose, { Schema } from 'mongoose'

const slotAvailabilitySchema = new Schema({
    temple: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 0
    },
    bookedSeats: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
})


slotAvailabilitySchema.index({ temple: 1, date: 1, slot: 1 }, { unique: true })


slotAvailabilitySchema.index({ temple: 1, date: 1 })


slotAvailabilitySchema.virtual('occupancyPercent').get(function() {
    return (this.bookedSeats / this.totalSeats) * 100
})


slotAvailabilitySchema.methods.hasCapacity = function(requestedSeats) {
    return this.availableSeats >= requestedSeats
}


slotAvailabilitySchema.methods.bookSeats = function(seats) {
    if (!this.hasCapacity(seats)) {
        throw new Error(`Not enough seats available. Only ${this.availableSeats} seats remaining.`)
    }
    this.bookedSeats += seats
    this.availableSeats -= seats
    return this
}

const SlotAvailability = mongoose.model("SlotAvailability", slotAvailabilitySchema)

export default SlotAvailability