import express from "express"
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"
import userRoutes from  "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"




dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT=process.env.PORT
const app= express();


app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)


console.log(process.env.MONGO_URI)
app.use(express.json())


app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/notification",notificationRoutes)



app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
    connectDB();
})
