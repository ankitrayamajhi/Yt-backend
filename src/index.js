//require('dotenv').config({path: './env'}) //not good

/*in package.json
 "start": "nodemon src/index.js", = for other
    "dev":"nodemon -r dotenv/config --experimental-json-modules src/index.js" = for dotenv
*/
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";


import connectDB from "./db/index.js";

import dotenv from "dotenv"
dotenv.config({
    path: './'
})
/*
import express from "express"
const app = express()


// function connectDB(){

// }

// connectDB()

;(async() =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("ERROR: ",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port $(process.env.PORT)`);
        })

    } catch (error) {
        console.error("ERROR: ",error)
        throw error
    }
})()

*/

connectDB() 