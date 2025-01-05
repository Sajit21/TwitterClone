import mongoose from "mongoose";


const UserSchema= new mongoose.Schema({

username :{
    type:String,
    required:true
},
password: {
    type:String,
    required:true,
    minlenght:6
},
email: {
  type:String,
  required:true,
  unique:true
},
followers: [
    {
        type:mongoose.Schema.Types.ObjectId, //stores an ObjectId from another document in the MongoDB database
     ref: "User",
     default:[] //says the user doesn't have followers when they signup

    }
],
following: [
    {
        type:mongoose.Schema.Types.ObjectId, //stores an ObjectId from another document in the MongoDB database
     ref: "User", // Refers to the "User" collection/model
     default:[] //says the user doesn't have following when they signup

    }
],
profileImg :{
    type: String,
    default: "",
},
coverImg: {
    type:String,
    default:"",
},
bio: {
    type:String,
    default: "",
},
link:{
    type:String,
    default:"",
},
},
{
    timestamps:true
}
})

const User=mongoose.model("User",UserSchema)
export default User;