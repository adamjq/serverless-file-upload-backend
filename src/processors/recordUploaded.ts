'use strict'

import bunyan from 'bunyan'
import axios from 'axios'
import { getS3LocationFromEvent } from "../util"
import {GQLUploadStatus, GQLUpdateUploadInput} from "../types/graphql"

const logger = bunyan.createLogger({name: "recordUpload"})

const APPSYNC_URL = process.env.APPSYNC_URL || ''
const APPSYNC_REGION = process.env.APPSYNC_REGION || ''
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ''

export const handler = async (event: any) => {
    logger.info(event);
    const location = getS3LocationFromEvent(event)
    logger.info(`Object location: ${location}`)

    const gqlMutation = {
        "query": "mutation updateUpload(location: $location, update: { status: UPLOADED}) { id }",
        "variables": { "location": location }
    }
   logger.info({gqlMutation})

    try {
      const response = await axios.post(APPSYNC_URL, gqlMutation, { headers: {
        'X-API-KEY': APPSYNC_API_KEY, 'Content-Type': 'application/json'
      }})
      logger.info({response})
    } catch (error) {
      logger.error({error})
    }
}
