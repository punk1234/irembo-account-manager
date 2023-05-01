import { Service } from "typedi";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config";
import { RandomCodeGenerator } from "../../helpers";
import { IFileUploadData } from "../../interfaces";

@Service()
export class FileManager {
  constructor() {
    cloudinary.config(config.CLOUDINARY);
  }

  /**
   * @method uploadFiles
   * @async
   * @param {Array<IFileUploadData>} data
   * @param {string} bucket
   * @returns {Promise<Array<string>>}
   */
  async uploadFiles(data: Array<IFileUploadData>, bucket: string): Promise<Array<string>> {
    const UPLOAD_URLS = await Promise.all(
      data.map((item: IFileUploadData) => this.uploadFile(item, bucket)),
    );

    return UPLOAD_URLS;
  }

  /**
   * @method uploadFile
   * @async
   * @param {IFileUploadData} data
   * @param {string} bucket
   * @returns {Promise<string>}
   */
  private async uploadFile(data: IFileUploadData, bucket: string): Promise<string> {
    const response = await cloudinary.uploader.upload(
      `data:${data.mimeType};base64,` + data.encodedContent,
      {
        public_id: bucket + "/" + RandomCodeGenerator.getFromUUID(),
      },
    );

    if (!response?.url) {
      throw new Error("Could not upload file!");
    }

    return response.url;
  }
}
