import {Router} from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile  
     } from "../controllers/user.controller.js";
//To upload file like avtar ,cover image
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

//when control come from  app.js = /users
router.route("/register").post(
    upload.fields([
        {
           name:"avatar",
           maxCount:1 
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),
    registerUser
    )
//router.route("/login").post(loginUser)
//then registerUser method is called which is located on controller
/*
http://localhost:8000/api/v1/users/register
http://localhost:8000/api/v1/users/login
*/


router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT, logoutUser)//not needed here = verifyJWT
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentUserPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails )
router.route("/avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar )
router.route("/cover-image").patch(verifyJWT, upload.single("cover-image"), updateUserCoverImage  )
router.route("/c/:username").get(verifyJWT,getUserChannelProfile )
router.route("/history").get(verifyJWT,updateAccountDetails )



export default router