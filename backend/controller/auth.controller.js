import User from "../model/user.model.js";
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../lib/generateToken.js";


export const signUp=async(req, res) => {
   try {

    const {fullname,username,password,email} =req.body;
    console.log(fullname,username,password,email)
    const emailregex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!(emailregex).test(email))
    {
     return  res.status(400).json({Message: "incorrect format of the email"})
    }

    //if tyo username pailai exit cha bhani give error 
    const existingUser= await User.findOne({username})
    if(existingUser)
    {
        res.status(400).json({message:"username is already created or exist "})
    }

    const existingEmail=await User.findOne({email})
        if(existingEmail)
    {
        res.status(400).json({message:"Email is already created or exist "})

    }
    if(password.lenght<6){
        res.status(400).json({
            message: "password shouldnot be less than 6"
        })
    }

    //bycrypt the password in signup
    const salt=await bcrypt.genSalt(10)

    const hashpassword= await bcrypt.hash(password,salt)
//    console.log("im ruuning this hash")
    //after the content the user is created// define all the content
    //creating a user
    console.log(hashpassword,password,fullname,username)
    const newUser = new User({
        fullname,
        username,
        password:hashpassword,
        email
    })
    console.log(newUser)


    //after the create of user . cookie and token is gernerated 
    if(newUser){
        generateTokenAndSetCookie(newUser._id,res)
        await newUser.save(); // saving the content of the newUser acc to their id 
    
   
    res.status(201).json({
        _id:newUser._id,
        fullName: newUser.fullname,
        username:newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg

    })
}

    else
    {
        res.status(400).json({message: "invalid data of user"})
    }

} catch (error) {
    console.log("invalid error of the data ")
    res.status(400).json({message: "interna server error "})
    
   }
// res.status(200).json({message: "sigup is connected"})

}



//incase of login :
//ask for username and password then find one username, check for the password,then generate token

export const login=async(req, res) => {
     try {

        const {username,password}=req.body;
        const user=await User.findOne({username})
        const isPasswordCorrect=await bcrypt.compare(password, user?.password || "")
        if(!user || !isPasswordCorrect)
        {
            res.status(400).json({message:"invalid username and password"})
        }

        //if username ra password milyo bhani 
        generateTokenAndSetCookie(user._id,res)

        //display them in postman
        res.status(201).json({
            _id:user._id,
            fullName: user.fullname,
            username:user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
    
        })


   //If valid, you generate a new authentication token and add it to the cookie.

   } catch (error) {
    console.log("invalid error in the server")
    res.status(400).json({message:"error found in the server"})
     
    }
 
 }


 export const logout=async(req, res) => {
    try {
     res.cookie("jwt","",{maxAge:0})
     res.status(200).json({message:"logout successfully "})
    } catch (error) {
        console.log("error in logout ontroller",error.message)
res.status(400).json({error:"internal server error"})
        
    }
}


export const getMe=async(req,res) => {

try {

    const user= await User.findById(req.user._id).select("-password")
    console.log(user)
    res.status(200).json(user)
    
} catch (error) {

    console.log("error in getMe controller", error.message);
    res.status(500).json({error: "internal server error"})    
}
}