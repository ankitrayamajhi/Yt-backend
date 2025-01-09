/*
For controller we need a helper file = asyncHandler.js

*/
import { asyncHandler } from "../utils/asyncHandler.js";
//To throw error we need apiError
import {ApiError} from "../utils/ApiError.js"
//check if user already exists
import {User} from "../models/user.model.js"
//To upload clodinary
import {uploadOnCloudinary} from "../utils/cloudinary.js"
//to return response
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshTokens = async(userId) =>
{
    try {
        const user = await User.findById(userId)
        // Check if the user exists
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        //Access Token for user
        //Refresh Token for database
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return{accessToken, refreshToken}
        
    } catch (error) {
        console.error('Error generating tokens:', error);
        throw new ApiError(500,"Something went wrong while access and refresh token")
        
    }
}





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
//console.log("Email",email)
//console.log("Fullname",fullName)

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
const existedUser = await User.findOne({
    $or: [{ username }, { email }]
})
if (existedUser) {
    throw new ApiError(409,"User with username or eamil already exists!")
}
//console.log(req.files);
//4
const avatarLocalPath = req.files?.avatar[0]?.path
//const coverImageLocalPath = req.files?.coverImage[0]?.path
let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}
if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required!")
}
//5
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

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
const createdUser = await User.findById(user._id).select(
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


const loginUser = asyncHandler(async(req,res) =>{
/*
login
1. req body = bring data
2. username or email
3. find the user
4. password check
5. access and refresh token
6. send cookie


*/
//1
const {username,email,password}= req.body
console.log(email);
//2
if (!username && !email) {
    throw new ApiError(400,"Username or Email is must required!")
}
/*
Here is an alternative of above code based on logic
if (!username && !email) {
    throw new ApiError(400,"Username or Email is must required!")
}

*/
//3
const user = await User.findOne({
    $or: [{username},{email}]
})
if (!user) {
    throw new ApiError(404,"User does not exist!")
}
//4
const isPasswordValid = await user.isPasswordCorrect
(password) //method from user.model
if (!isPasswordValid) {
    throw new ApiError(401,"Invalid user crediantials !")
}

//5
// Details in top of this page because it is common for other as well

const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(user._id)
//to remove unnecessary fields //optional
const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//6
const options = { //after this it is only modified from server
    httpOnly: true,
    secure: true
}

return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            user: loggedInUser,accessToken,refreshToken
        },
        "User logged in Sucessfully "
    )
)

})
//To logged out
const logoutUser = asyncHandler(async(req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out!"))
    
})

const refreshAccessToken = asyncHandler(async(req,res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401,"Unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
       const user = await User.findById(decodedToken?._id)
    
       if (!user) {
        throw new ApiError(401,"Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options ={
            httpOnly: true,
            secure: true
        }
    
        const {accessToken ,newRefreshToken} = generateAccessTokenAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken:newRefreshToken
                },
                "Access token refreshed"
            )
        )
        
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

}