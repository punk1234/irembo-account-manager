import fs from "fs";

export class FileConverter {

    static toBuffers(files: Array<Express.Multer.File>): Array<string> {
        const BUFFERS = [];

        for (const file of files) {
            // const BASE64_CONTENT = fs.readFileSync(file.buffer.toString("base64"));
            const BASE64_CONTENT = file.buffer.toString("base64")
            BUFFERS.push(BASE64_CONTENT);
        }

        console.debug(BUFFERS[0]);
        return BUFFERS;
    }

}