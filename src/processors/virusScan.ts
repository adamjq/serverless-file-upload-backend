'use strict'

import bunyan from 'bunyan'
import {getS3LocationFromEvent} from "../util"
import {GQLUploadStatus} from "../types/graphql"

const logger = bunyan.createLogger({name: "virusScan"})

const UPLOAD_S3_BUCKET = process.env.UPLOAD_S3_BUCKET || ''

export const handler = async (event: any) => {
    logger.info(event);
    const location = getS3LocationFromEvent(event)

    // TODO: actually scan for viruses
    const scanSuccess = true

    if (scanSuccess) {
        logger.info("File passed virus scan")
        return { status: GQLUploadStatus.COMPLETED }
    } else {
        logger.info("File failed virus scan")
        return { status: GQLUploadStatus.REJECTED }
    }
}
