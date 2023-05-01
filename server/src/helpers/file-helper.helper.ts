import { IFileUploadData } from "../interfaces";

export class FileHelper {
  /**
   * @method toUploadData
   * @static
   * @param {Array<Express.Multer.File>} files
   * @returns {Array<IFileUploadData>}
   */
  static toUploadData(files: Array<Express.Multer.File>): Array<IFileUploadData> {
    const data: Array<IFileUploadData> = [];

    for (const file of files) {
      data.push({
        encodedContent: file.buffer.toString("base64"),
        mimeType: file.mimetype,
      });
    }

    return data;
  }
}
