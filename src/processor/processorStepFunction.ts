'use strict'

import bunyan from 'bunyan'
import {getS3LocationFromEvent} from "../util"
import {GQLUpdateUploadInput, GQLUploadStatus} from "../types/graphql"
import axios from "axios"

const logger = bunyan.createLogger({name: "processorStepFunction"})

const APPSYNC_URL = process.env.APPSYNC_URL || ''
const APPSYNC_REGION = process.env.APPSYNC_REGION || ''
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ''
const UPLOAD_S3_BUCKET = process.env.UPLOAD_S3_BUCKET || ''

type StateMachinePath = "RetrieveMetadata" | "GenerateThumbnail" | "VirusScan" | "PersistMetadata"

interface StepFunctionEventInput {
    Path: StateMachinePath,
    Input: {
        Records: any[],
        processResults?: any[],
        metadataResults?: any
    }
}

export const handler = async (event: StepFunctionEventInput, context: any) => {
    logger.info({event, context})
    const path: StateMachinePath = event.Path
    switch (path) {
        case "RetrieveMetadata": {
            return await retrieveMetadata(event)
        }
        case "GenerateThumbnail": {
            return await generateThumbnail(event)
        }
        case "VirusScan": {
            return await virusScan(event)
        }
        case "PersistMetadata": {
            return await persistMetadata(event)
        }
        default: {
            logger.error({path}, "Unknown Step Function path")
        }
    }
}

// TODO: Actually implement this
export const retrieveMetadata = async (event: StepFunctionEventInput) => {
    logger.info({event}, "Retrieving Metadata")
    const metadata = {
        size: event.Input.Records[0].s3.object.size,
        mimeType: 'image/png'
    }
    logger.info({metadata}, "Metadata retrieved successfully")
    return metadata
}

// TODO: Actually implement this
export const generateThumbnail = async (event: StepFunctionEventInput) => {
    logger.info({event}, "Generating Thumbnail")
    const location = getS3LocationFromEvent(event.Input)
    const metadata = event.Input.metadataResults

    return {
        thumbnail: null
    }
}

// TODO: Actually implement this
export const virusScan = async (event: StepFunctionEventInput) => {
    logger.info({event}, "Scanning for virus")
    const location = getS3LocationFromEvent(event.Input)
    const metadata = event.Input.metadataResults

    const scanSuccess = true
    if (scanSuccess) {
        logger.info("File passed virus scan")
        return { status: GQLUploadStatus.COMPLETED }
    } else {
        logger.info("File failed virus scan")
        return { status: GQLUploadStatus.REJECTED }
    }
}

export const persistMetadata = async (event: StepFunctionEventInput) => {
    logger.info({event}, "Persisting metadata")
    const location = getS3LocationFromEvent(event.Input)

    const processResults = event.Input.processResults as any[]

    // We take the results from parallel processing states and build the updateUpload GraphQL mutation input
    const retrieveMetadataResults = event.Input.metadataResults
    const generateThumbnailResults = processResults[2]
    const virusScanResults = processResults[1]
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

    const gqlMutation = {
        "query": "mutation UpdateUpload($location: String!, $update: UpdateUploadInput) { updateUpload(location: $location, update: $update) { id } }",
        "variables": { "location": location, "update": update }
    }
   logger.info({update, gqlMutation})

    try {
      const response = await axios.post(APPSYNC_URL, gqlMutation, { headers: {
        'X-API-KEY': APPSYNC_API_KEY, 'Content-Type': 'application/json'
      }})
      logger.info({response})
    } catch (error) {
      logger.error({error})
    }
}
