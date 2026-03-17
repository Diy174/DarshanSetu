import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from '../models/admin.models.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {v2 as cloudinary} from "cloudinary";

const loginUser = AsyncHandler(async (req, res) => {
    const { contactNo, temple_id, password } = req.body;

    if (!contactNo || !temple_id || !password) {
        throw new ApiError(400, "All fields are required");
    }

    console.log("LOGIN BODY:", req.body);

    const admin = await Admin.findOne({
        temple_id,
    });

    console.log("FOUND ADMIN:", admin);

    if (!admin) {
        throw new ApiError(404, "Temple is not registered!!");
    }

    const isPassword = admin.password;
    if (isPassword != password) {
        return res.status(400).json({
            message: "Invalid contact number or password!!"
        });
    }

    const loggedInUser = await Admin.findById(admin._id).select("-password");

    return res.status(200).json(
        new ApiResponse(
            200,
            { user: loggedInUser },
            "Temple logged In Successfully"
        )
    );
});

const logoutUser = AsyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, {}, "User Logged out successfully!!"))
});

const uploadTempleMap = AsyncHandler(async (req, res) => {
    console.log('=== Upload Temple Map Started ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { temple_id } = req.body;

    if (!temple_id) {
        console.error('Temple ID missing in request');
        throw new ApiError(400, "Temple ID is required");
    }

    if (!req.file) {
        console.error('No file uploaded');
        throw new ApiError(400, "Map file is required");
    }

    const mapFileLocalPath = req.file.path;
    console.log('Map file local path:', mapFileLocalPath);
    const admin = await Admin.findOne({ temple_id });

    if (!admin) {
        console.error('Temple not found:', temple_id);
        throw new ApiError(404, "Temple not found");
    }

    console.log('Admin found:', admin.temple_id);

    if (admin.mapPublicId) {
        try {
            console.log('Deleting old map:', admin.mapPublicId);
            await cloudinary.uploader.destroy(admin.mapPublicId);
            console.log('Old map deleted successfully');
        } catch (error) {
            console.error("Error deleting old map:", error);
        }
    }

    console.log('Uploading to Cloudinary...');
    const mapUpload = await uploadOnCloudinary(mapFileLocalPath);

    if (!mapUpload) {
        console.error('Cloudinary upload failed');
        throw new ApiError(500, "Failed to upload map to Cloudinary");
    }

    console.log('Map uploaded to Cloudinary:', mapUpload.secure_url);

    admin.mapUrl = mapUpload.secure_url;
    admin.mapPublicId = mapUpload.public_id;
    await admin.save();

    console.log('Admin updated with new map URL');
    console.log('=== Upload Temple Map Completed ===');

    return res.status(200).json(
        new ApiResponse(
            200,
            { mapUrl: mapUpload.secure_url },
            "Temple map uploaded successfully"
        )
    );
});
const getTempleMap = AsyncHandler(async (req, res) => {
    const { temple_id } = req.params;
    console.log("Temple ID from params:", temple_id);

    const allAdmins = await Admin.find().select("temple_id mapUrl");
    console.log("All admins:", allAdmins);

    if (!temple_id) {
        throw new ApiError(400, "Temple ID is required");
    }

    const admin = await Admin.findOne({ temple_id }).select('mapUrl');

    if (!admin) {
        throw new ApiError(404, "Temple not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { mapUrl: admin.mapUrl || null },
            admin.mapUrl ? "Temple map fetched successfully" : "No map uploaded yet"
        )
    );
});

export { loginUser, logoutUser, uploadTempleMap, getTempleMap };

