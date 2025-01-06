/*
npm i cloudinary= used to store data like aws
npm i multer = user upload file through multer 
user to local server's temp (storage)
cloudinary = local storage to server

 
*/

import {v2 as cloudinary} from "cloudinary"//cloudinary=custom name
import fs from "fs"
/*
fs = file system
it is default installed with node
It helps on = read,write,remove and other
basically it manage file system
*/


// Configuration
cloudinary.config(
    { 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
);
//uploading in cloudinary
const uploadOnCloudinary = async (localFilePath) => 
    {
        try {
            if(!localFilePath) return null
            //upload the file on cloudinary
            //cloudinary.uploader.upload(localFilePath,
           const response = await cloudinary.uploader.upload(localFilePath,
                {
                    resource_type:"auto" //it contain may be image,audio,video and so on

                }
            )
            //file has been uploaded sucessfully
            console.log("File is uploaded on cloudinary",response.url)
            console.log("File is uploaded on cloudinary",response)//not necessary
            return response;
        } catch (error) {
            //safe cleaning purpose
            fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed
            return null;
        }
    
    }
    export {uploadOnCloudinary}