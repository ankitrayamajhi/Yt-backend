/*
For controller we need a helper file = asyncHandler.js

*/
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req,res) => {
    res.status(200).json({
        message:"Ok"
    })



})

export {registerUser}