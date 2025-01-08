import express from "express"
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"
import userRoutes from  "./routes/user.route.js"

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT=process.env.PORT
const app= express();

console.log(process.env.MONGO_URI)
app.use(express.json())


app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)




app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
    connectDB();
})
