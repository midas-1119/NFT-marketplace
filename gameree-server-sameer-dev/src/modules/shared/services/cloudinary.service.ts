import { Injectable } from '@nestjs/common';
import { IUploadImage } from 'src/interfaces';
import { v2 as cloudinary } from 'cloudinary'
const streamifier =require('streamifier')

// const cloudinary = require('cloudinary');


@Injectable()
export class CloudinaryService {
    constructor(

    ) {
        // super();
    }
    async uploadFile(file: IUploadImage) {
        try {
            cloudinary.config({
                cloud_name: "gameree",
                api_key: "148286718353576",
                api_secret: "LMXy8eHCh7RKRErja3bITH0Qdkg"
            });
            // let strm = new StreamableFile(file.buffer)
            // const res = cloudinary.uploader.upload_stream(strm)

            // res.then((data) => {
            //     console.log(data);
            //     console.log(data.secure_url);
            // }).catch((err) => {
            //     console.log(err);
            // });

            // const url = cloudinary.url("olympic_flag", {
            //     width: 100,
            //     height: 150,
            //     Crop: 'fill'
            // });
            let url = new Promise((resolve, reject) => {

                let cld_upload_stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "NFT-Buildings-1"
                    },
                    (error: any, result: any) => {

                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
            });
            return url
        } catch (error: any) {
            console.log("error", error)
            return ''
        }
    }


}
