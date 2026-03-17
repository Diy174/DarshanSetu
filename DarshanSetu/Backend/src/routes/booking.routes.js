
import { Router } from "express";
import { 
    registerBooking, 
    getBookingHistory, 
    getSlotAvailability,
    initializeSlots,
    cancelBooking
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/booking").post(verifyJWT, upload.none(), registerBooking) //user will book slot 
router.route("/booking-history").get(verifyJWT, getBookingHistory)
router.route("/cancel-booking").post(verifyJWT,upload.none(),cancelBooking)

router.route("/slot-availability").get(getSlotAvailability) //no need to login for checking availability
router.route("/initialize-slots").post(upload.none(), initializeSlots) //slots creation admin work

export default router