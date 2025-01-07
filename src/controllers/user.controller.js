/*
For controller we need a helper file = asyncHandler.js

*/
import { asyncHandler } from "../utils/asyncHandler.js";
//To throw error we need apiError
import {ApiError} from "../utils/ApiError.js"
//check if user already exists
import {User} from "../models/user.models.js"
//To upload clodinary
import {uploadCloudinary} from "../utils/cloudinary.js"
//to return response
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async(req,res) => {
    // res.status(200).json({
    //     message:"Ok"
    // })
/*
1. get user details from frontend
2. User details Validation = not empty
3. check if user already exists: username, email
4. check for images,check for avatar
5. upload them to cloudinary,avatar
6. create user object = create entery in db
7. remove password and refresh token field from response
8. check for user creation
9. return response

*/
//1
const {fullName,email,username,password} = req.body //req.from or req.url
console.log("Email",email)
console.log("Fullname",fullName)

//2
// if (fullName === null) {
//     trow new ApiError(400,"Fullname is required")
// }
 if (
   [fullName,email,username,password].some((field) => field?.trim() === "")
) {
   throw new ApiError(400,"All fields required!")
        
}
//3
//User.findOne({username})  
const existedUser = User.findOne({
    $or: [{ username }, { email }]
})
if (existedUser) {
    throw new ApiError(409,"User with username or eamil already exists!")
}
//4
const avatarLocalPath = req.files?.avatar[0]?.path
const coverImageLocalPath = req.files?.coverImage[0]?.path
if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required!")
}
//5
const avatar = await uploadCloudinary(avatarLocalPath)
const coverImage = await uploadCloudinary(coverImageLocalPath)

if (!avatar) {
    throw new ApiError(400,"Avatar file i required!")
}
//6
const user = await User.create({
    fullName,
    email,
    password,
    username:username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
})
//6 and 7
const createdUser = await User.findByID(user._id).select(
    "-password -refreshToken"
)
//8
if (!createdUser) {
    throw new ApiError(500,"Something went wrong while registering the user")
}
//9
//return res.status(201).json({createdUser})
return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered sucessfully!")
)

})

export {registerUser}