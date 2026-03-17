import { Router } from "express";
import { loginUser, logoutUser, uploadTempleMap, getTempleMap } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router()

router.route("/login").post(upload.none(), loginUser)
router.route("/logout").post(upload.none(), logoutUser)
router.route("/upload-map").post(upload.single("mapFile"), uploadTempleMap) //temple map upload
router.route("/get-map/:temple_id").get(getTempleMap) //see particular temple map

export default router