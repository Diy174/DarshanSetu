import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAccessToken, resetPassword} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(upload.none(), registerUser)
router.route("/login").post(upload.none(),loginUser)
router.route("/reset-password").post(upload.none(),resetPassword)

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-Token").post(refreshAccessToken)

export default router