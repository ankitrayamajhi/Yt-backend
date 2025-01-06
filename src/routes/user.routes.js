import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router()

//when control come from  app.js = /users
router.route("/register").post(registerUser)
//router.route("/login").post(loginUser)
//then registerUser method is called which is located on controller
/*
http://localhost:8000/api/v1/users/register
http://localhost:8000/api/v1/users/login
*/
export default router