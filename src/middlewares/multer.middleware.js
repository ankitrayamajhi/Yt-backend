/*middlewares can make independently/directly but
Here we use multer to make middlewares

When we need to be capability of file uploading
there need to be inject middlewares : 
like : registration 
*/

import multer from "multer"

const storage = multer.diskStorage(
    {
        destination:function(req,file,callback)
        {
            callback(null,"./public/temp")
        },
        filename:function(req,file,callback)
        {
            callback(null,file.originalname)
        }

    }
)

export const upload = multer(
    {
        storage,
    }
)

