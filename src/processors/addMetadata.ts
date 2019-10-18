'use strict'

import bunyan from 'bunyan'
import {getS3LocationFromEvent} from "../util"

const logger = bunyan.createLogger({name: "addMetadata"})

const APPSYNC_URL = process.env.APPSYNC_URL || ''
const APPSYNC_REGION = process.env.APPSYNC_REGION || ''
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ''

export const handler = async (event: any) => {
    logger.info(event);
    const location = getS3LocationFromEvent(event)
}
