'use strict'

import bunyan from 'bunyan'
import {getS3LocationFromEvent} from "../util"
import {GQLUpdateUploadInput} from "../types/graphql"
import axios from "axios"

const logger = bunyan.createLogger({name: "persistMetadata"})

const APPSYNC_URL = process.env.APPSYNC_URL || ''
const APPSYNC_REGION = process.env.APPSYNC_REGION || ''
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ''

/**
 * We take the results from parallel processing states and build the updateUpload GraphQL mutation input
 * @param processResults
 */
export const buildUpdate = (processResults: any): GQLUpdateUploadInput => {
    const retrieveMetadataResults = processResults[0]
    const generateThumbnailResults = processResults[1]
    const virusScanResults = processResults[2]

    const update: any = {}

    if (retrieveMetadataResults) {
        update.size = retrieveMetadataResults.size
        update.mimeType = retrieveMetadataResults.mimeType
    }
    if (generateThumbnailResults && generateThumbnailResults.thumbnail) {
        update.thumbnail = generateThumbnailResults.thumbnail
    }
    if (virusScanResults && virusScanResults.status) {
        update.status = virusScanResults.status
    }
    return update
}

export const handler = async (event: any) => {
    logger.info(event);
    const location = getS3LocationFromEvent(event)

    // These come from the previous parallel execution steps of the state machine
    const update = buildUpdate(event.processResults)
    logger.info({update}, "updateUpload input from processing steps")

    const gqlMutation = {
        "query": "mutation UpdateUpload($location: String!, $update: UpdateUploadInput) { updateUpload(location: $location, update: $update) { id } }",
        "variables": { "location": location, "update": update }
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
