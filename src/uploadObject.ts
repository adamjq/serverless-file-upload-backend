'use strict'

import bunyan from 'bunyan'
import uuidv4 from 'uuid/v4'


const logger = bunyan.createLogger({name: "lambda"});

export const handler = async (event: any) => {
    logger.info(event);
    const uploadInput = event.arguments.upload

    const currentTimestamp = new Date().toISOString()
    const defaultStatus = "CREATED"

    const mockUpload = {
        upload: {
            id: uuidv4(),
            location: "s3 bucket location here",
            name: uploadInput.name,
            description: uploadInput.description,
            status: defaultStatus,
            createdDateTime: currentTimestamp,
            modifiedDateTime: currentTimestamp,
        },
        uploadURL: "https://presigned-url-here.com"
    }
    logger.info({mockUpload}, "Returning mock upload response");
    return mockUpload
}
