import express from "express"
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const PORT=process.env.PORT
const app= express();

console.log(process.env.MONGO_URI)

app.use("/api/auth",authRoutes)



app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
    connectDB();
})
