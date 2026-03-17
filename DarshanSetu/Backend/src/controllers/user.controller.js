import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import { Booking } from "../models/booking.models.js"
import mongoose from 'mongoose'
import SlotAvailability from "../models/slot.models.js"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = AsyncHandler(async (req, res) => {
    const { lastname, firstname, phoneno, password } = req.body

    if (!firstname?.trim() || !lastname?.trim() || !password?.trim() || !phoneno) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ phoneno })
    if (existedUser) {
        throw new ApiError(409, "Phone number is already registered")
    }

    const user = await User.create({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        phoneno,
        password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) throw new ApiError(500, "Something went wrong while registering the user")

    return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"))
})


const loginUser = AsyncHandler(async (req, res) => {
    const { phoneno, password } = req.body

    if (!phoneno) {
        throw new ApiError(400, "phoneno is required")
    }

    const user = await User.findOne({
        $or: [{ phoneno }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!user || !isPasswordValid) {
        return res.status(400).json({ message: "Invalid phone number or password!!" });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, newRefreshToken
                },
                "User logged In Successfully"
            )
        )
})

const resetPassword = AsyncHandler(async (req, res) => {
    const { newPassword, phoneno } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
        throw new ApiError(400, 'newPassword is required and must be at least 6 characters');
    }

    let user;
    if (req.user?._id) {
        user = await User.findById(req.user._id);
    } else {
        if (!phoneno) throw new ApiError(400, 'phoneno is required when not authenticated');
        user = await User.findOne({ phoneno: phoneno.trim() });
    }

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

const logoutUser = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                //refreshToken: 1
                refreshToken: ""
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged out successfully!!"))
})

const refreshAccessToken = AsyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const registerBooking = AsyncHandler(async (req, res) => {
    console.log('📥 Received booking request:', JSON.stringify(req.body, null, 2))

    const {
        date,
        username,
        slot,
        city,
        temple,
        phone,
        id,
        visitorDetails,
        visitors,
        differentlyAbled,
        elders
    } = req.body

    if (!username || !temple || !slot || !date || !phone || !city || !id) {

        throw new ApiError(400, "All required fields must be provided")
    }

    // Validate visitorDetails array
    if (!visitorDetails || !Array.isArray(visitorDetails) || visitorDetails.length === 0) {

        throw new ApiError(400, "At least one visitor detail is required")
    }

    const isKashi = temple?.trim().toLowerCase() === "shri kashi vishwanath temple".toLowerCase()
    const maxAllowed = isKashi ? 2 : 10

    if (visitorDetails.length > maxAllowed) {
        throw new ApiError(400, `Maximum ${maxAllowed} visitors allowed for this temple`)
    }

    for (let i = 0; i < visitorDetails.length; i++) {
        const visitor = visitorDetails[i]

        if (!visitor.name || !visitor.name.trim()) {
            throw new ApiError(400, `Visitor ${i + 1}: Name is required`)
        }

        if (!visitor.aadhaar || !/^\d{12}$/.test(visitor.aadhaar)) {
            throw new ApiError(400, `Visitor ${i + 1}: Valid 12-digit Aadhaar is required`)
        }

        if (!visitor.type || !['visitor', 'elder', 'differentlyAbled'].includes(visitor.type)) {
            throw new ApiError(400, `Visitor ${i + 1}: Valid type (visitor/elder/differentlyAbled) is required`)
        }
    }
    console.log("REQ USER:", req.user);
    console.log("REQ COOKIES:", req.cookies);
    console.log("BOOKING BODY:", req.body);

    if (!req.user?._id) {
        throw new ApiError(401, "User must be logged in to make a booking")
    }

    const totalVisitors = visitorDetails.length
    const eldersCount = visitorDetails.filter(v => v.type === 'elder').length
    const differentlyAbledCount = visitorDetails.filter(v => v.type === 'differentlyAbled').length



    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        let slotAvailability = await SlotAvailability.findOne({
            temple,
            date,
            slot
        }).session(session)

        const DEFAULT_SLOT_CAPACITY = 3000

        if (!slotAvailability) {

            slotAvailability = await SlotAvailability.create([{
                temple,
                date,
                slot,
                totalSeats: DEFAULT_SLOT_CAPACITY,
                bookedSeats: 0,
                availableSeats: DEFAULT_SLOT_CAPACITY
            }], { session })
            slotAvailability = slotAvailability[0]
        }

        //prevent overbooking
        if (slotAvailability.availableSeats < totalVisitors) {
            await session.abortTransaction()
            session.endSession()
            throw new ApiError(409, `Not enough seats available. Only ${slotAvailability.availableSeats} seats remaining.`)
        }

        slotAvailability.bookedSeats += totalVisitors
        slotAvailability.availableSeats -= totalVisitors
        await slotAvailability.save({ session })



        const bookingData = {
            date,
            username,
            slot,
            city,
            temple,
            visitorDetails,
            visitors: totalVisitors,
            differentlyAbled: differentlyAbledCount,
            elders: eldersCount,
            phone,
            id,
            bookedBy: req.user._id
        }

        const booking = await Booking.create([bookingData], { session })

        await session.commitTransaction()
        session.endSession()

        // console.log(1)

        return res.status(201).json(
            new ApiResponse(200, {
                booking: booking[0],
                availableSeats: slotAvailability.availableSeats,
                bookedSeats: slotAvailability.bookedSeats,
                totalVisitors: totalVisitors
            }, "Booking completed successfully")
        )
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
})


const getBookingHistory = AsyncHandler(async (req, res) => {
    if (!req.user?._id) {
        throw new ApiError(401, "User must be logged in");
    }

    const bookings = await Booking.find({ bookedBy: req.user._id })
        .sort({ createdAt: -1 })
        .select('-__v');

    if (!bookings || bookings.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No booking history found")
        );
    }

    const currentBooking = bookings.find(b => b.status === "SCHEDULED") || null;

    const previousBookings = bookings.filter(b =>
        b._id.toString() !== currentBooking?._id.toString()
    );

    const transformBooking = (booking) => {
        if (!booking) return null;
        return {
            templeName: booking.temple,
            visitDate: booking.date,
            visitSlot: booking.slot,
            devotes: booking.visitors,
            group: booking.visitors,
            elders: booking.elders || 0,
            differentlyAbled: booking.differentlyAbled || 0,
            visitorDetails: booking.visitorDetails || [],
            _id: booking._id,
            id: booking.id,
            status: booking.status
        };
    };

    const responseData = {
        currentBooking: transformBooking(currentBooking),
        previousBookings: previousBookings.map(transformBooking)
    };

    return res.status(200).json({
        statuscode: 200,
        success: true,
        message: "Booking history get successfully",
        data: responseData
    });
});

const getSlotAvailability = AsyncHandler(async (req, res) => {
    const { temple, date } = req.query

    if (!temple || !date) {
        throw new ApiError(400, "all feilds are required")
    }

    const slots = await SlotAvailability.find({
        temple,
        date
    }).select('slot totalSeats bookedSeats availableSeats')

    return res.status(200).json(
        new ApiResponse(200, slots, "Slot availability fetched successfully")
    )
})

const initializeSlots = AsyncHandler(async (req, res) => {
    const { temple, date, slots } = req.body

    // console.log({ temple, date, slotsCount: slots?.length })

    if (!temple || !date || !slots || !Array.isArray(slots)) {
        throw new ApiError(400, "Temple, date, and slots array are required")
    }

    if (slots.length === 0) {
        throw new ApiError(400, "Slots array cannot be empty")
    }

    try {
        const existingSlots = await SlotAvailability.find({ temple, date })

        if (existingSlots.length > 0) {
            const expectedCapacity = slots[0].totalSeats
            const existingCapacity = existingSlots[0].totalSeats

            if (existingCapacity === expectedCapacity) {

                return res.status(200).json(
                    new ApiResponse(200, existingSlots, "Slots already initialized")
                )
            } else {

                await SlotAvailability.deleteMany({ temple, date })
            }
        }

        const slotDocs = slots.map(s => ({
            temple,
            date,
            slot: s.slot,
            totalSeats: s.totalSeats,
            bookedSeats: 0,
            availableSeats: s.totalSeats
        }))

        const createdSlots = await SlotAvailability.insertMany(slotDocs, { ordered: false })

        // console.log(" Success ")

        return res.status(201).json(
            new ApiResponse(200, createdSlots, "Slots initialized successfully")
        )
    } catch (error) {


        if (error.code === 11000) {
            const existingSlots = await SlotAvailability.find({ temple, date })
            return res.status(200).json(
                new ApiResponse(200, existingSlots, "Slots already initialized")
            )
        }

        throw error
    }
})

const cancelBooking = AsyncHandler(async (req, res) => {
    const { bookingId } = req.body

    if (!bookingId) {
        throw new ApiError(400, "Booking ID is required")
    }

    if (!req.user?._id) {
        throw new ApiError(401, "User must be logged in to cancel booking")
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        const booking = await Booking.findById(bookingId).session(session)

        if (!booking) {
            await session.abortTransaction()
            session.endSession()
            throw new ApiError(404, "Booking not found")
        }


        if (booking.bookedBy.toString() !== req.user._id.toString()) {
            await session.abortTransaction()
            session.endSession()
            throw new ApiError(403, "You are not authorized to cancel this booking")
        }


        if (booking.status === "CANCELLED") {
            await session.abortTransaction()
            session.endSession()
            throw new ApiError(400, "This booking is already cancelled")
        }


        const slotAvailability = await SlotAvailability.findOne({
            temple: booking.temple,
            date: booking.date,
            slot: booking.slot
        }).session(session)

        if (!slotAvailability) {
            await session.abortTransaction()
            session.endSession()
            throw new ApiError(404, "Slot availability record not found")
        }
        const visitorsToRelease = booking.visitors
        slotAvailability.bookedSeats -= visitorsToRelease
        slotAvailability.availableSeats += visitorsToRelease

        if (slotAvailability.bookedSeats < 0) {
            slotAvailability.bookedSeats = 0
        }
        if (slotAvailability.availableSeats > slotAvailability.totalSeats) {
            slotAvailability.availableSeats = slotAvailability.totalSeats
        }

        await slotAvailability.save({ session })

        booking.status = "CANCELLED"
        await booking.save({ session })

        await session.commitTransaction()
        session.endSession()

        // console.log('Booking cancelled')

        return res.status(200).json(
            new ApiResponse(200, {
                booking: booking,
                releasedSeats: visitorsToRelease,
                updatedSlot: {
                    bookedSeats: slotAvailability.bookedSeats,
                    availableSeats: slotAvailability.availableSeats
                }
            }, "Booking cancelled successfully")
        )

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    resetPassword,
    registerBooking,
    getBookingHistory,
    getSlotAvailability,
    initializeSlots,
    cancelBooking
}