import { v2 as cloudinary } from "cloudinary";
import config from "../../config";
import fs from "fs";
import { Service } from "typedi";

@Service()
export class FileManager {

    constructor() {
        cloudinary.config(config.CLOUDINARY);
    }

    async uploadFile(fileEncodedString: string): Promise<string> {
        const response =  await cloudinary.uploader.upload(fileEncodedString, { public_id: "account-vrfy-doc",  });

        if (!response.url) {
            throw new Error("Could not upload file!");
        }

        return response.url;
    }

}