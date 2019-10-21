'use strict'

import bunyan from 'bunyan'
import {getS3LocationFromEvent} from "../util";
const logger = bunyan.createLogger({name: "virusScan"})

const UPLOAD_S3_BUCKET = process.env.UPLOAD_S3_BUCKET || ''

export const handler = async (event: any) => {
    logger.info(event);
    const location = getS3LocationFromEvent(event)
}
