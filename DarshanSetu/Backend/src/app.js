import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()
const CORS_ORIGIN=["http://localhost:5173","http://localhost:5174","https://darshansetu-1.onrender.com","https://darshansetu-4fk9.onrender.com"];

app.use(cors(
    {
   origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (CORS_ORIGIN.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials:true}
))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)
import bookingRouter from "./routes/booking.routes.js"
app.use("/api/v1/bookings",bookingRouter)
import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRouter)

export {app}
