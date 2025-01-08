import express from "express"
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";

import userRoutes from  "./routes/user.route.js"

dotenv.config();

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
