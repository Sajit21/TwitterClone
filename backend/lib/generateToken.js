import jwt from "jsonwebtoken";



// export const generateTokenAndSetCookie=(userId,res)=>{
   
//     try {
//         const token =jwt.sign({userId},process.env.JWT_SECRET,{
//             expiresIn: "15d",
//         })


//         res.cookie("jwt",token,{
//             maxAge: 15*24* 60*60*1000,
//             httpOnly:true,
//             sameSite:"strict",
//             secure:process.env.NOD_ENV !== "development" }) //only secure is true when it is false
        
//     } catch (error) {
        
//     }
// }

export const generateTokenAndSetCookie=(userId,res)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "15d",
    })


    res.cookie("jwt",token,{
        maxAge: 15*24* 60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NOD_ENV !== "development" }) //only secure is true when it is false
    

}


