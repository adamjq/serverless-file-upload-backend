'use strict'

import bunyan from 'bunyan'
import {getS3LocationFromEvent} from "../util"
import readChunk from 'read-chunk'
import fileType from 'file-type'

const logger = bunyan.createLogger({name: "retrieveMetadata"})

const UPLOAD_S3_BUCKET = process.env.UPLOAD_S3_BUCKET || ''

// TODO: actually implement this
const determineMimeType = () => {
    return 'image/png'
}

const determineFileSize = (S3Event: any): number => {
    const record = S3Event.Records[0]
    return record.s3.object.size
}

export const handler = async (event: any) => {
    logger.info(event)
}
