'use strict'

import bunyan from 'bunyan'
import {getS3LocationFromEvent} from "../util"
import {GQLS3ObjectInput, GQLUpdateUploadInput, GQLUploadStatus} from "../types/graphql"
import axios from "axios"
import { S3 } from "aws-sdk"
import fileType from 'file-type'
import Sharp from 'sharp'
const sizeOf = require('image-size')

const logger = bunyan.createLogger({name: "processorStepFunction"})

const APPSYNC_URL = process.env.APPSYNC_URL || ''
const APPSYNC_REGION = process.env.APPSYNC_REGION || ''
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ''
const UPLOAD_S3_BUCKET = process.env.UPLOAD_S3_BUCKET || ''
const THUMBNAIL_S3_BUCKET = process.env.THUMBNAIL_S3_BUCKET || ''

const MAX_WIDTH  = 100
const MAX_HEIGHT = 100

type StateMachinePath = "RetrieveMetadata" | "GenerateThumbnail" | "VirusScan" | "PersistMetadata"

interface StepFunctionEventInput {
    Path: StateMachinePath,
    Input: {
        Records: any[],
        processResults?: any[],
        metadataResults?: any
    }
}

interface MimeType {
    ext: string,
    mime: string
}

interface Metadata {
    size: number,
    mimeType: string | undefined
}

const s3 = new S3({apiVersion: '2006-03-01'})

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

export const retrieveMetadata = async (event: StepFunctionEventInput): Promise<Metadata> => {
    logger.info({event}, "Retrieving Metadata")
    try {
        const params = {
            Bucket: UPLOAD_S3_BUCKET,
            Key: event.Input.Records[0].s3.object.key,
            Range: `bytes=0-${fileType.minimumBytes}`
        }
        const data = await s3.getObject(params).promise()
        const mimeType = fileType(data.Body as Buffer)
        logger.info({mimeType, data}, "File downloaded and mime type determined")
        const metadata: Metadata = {
            size: event.Input.Records[0].s3.object.size,
            mimeType: mimeType ? mimeType.mime : undefined
        }
        logger.info({metadata}, "Metadata retrieved successfully")
        return metadata
    } catch (err) {
        logger.error({err}, "Error determining file mime type")
        const metadata: Metadata = {
            size: event.Input.Records[0].s3.object.size,
            mimeType: undefined
        }
        return metadata
    }
}

export const generateThumbnail = async (event: StepFunctionEventInput) => {
    logger.info({event}, "Generating Thumbnail")
    const location = getS3LocationFromEvent(event.Input)
    const metadata = event.Input.metadataResults

    if (metadata.mimeType && metadata.mimeType.split("/")[0] === "image") {

        try {

            const objectKey = event.Input.Records[0].s3.object.key
            const thumbnailKey = `thumbnail-${objectKey}`

            // Download the original object
            const getParams = {
                Bucket: UPLOAD_S3_BUCKET,
                Key: objectKey
            }
            const data = await s3.getObject(getParams).promise()
            logger.info("Downloaded object from S3 to generate thumbnail")

            const dimensions = sizeOf(data.Body)
            const scalingFactor = Math.min(
                MAX_WIDTH / dimensions.width,
                MAX_HEIGHT / dimensions.height
            )
            const width = Math.round(scalingFactor * dimensions.width)
            const height = Math.round(scalingFactor * dimensions.height)

            const thumbnailBuffer = await Sharp(data.Body as Buffer)
                .resize(width, height)
                .toBuffer()
            logger.info("Downloaded object from S3 to generate thumbnail")

            // Upload the thumbnail
            const putParams = {
                Body: thumbnailBuffer,
                Bucket: THUMBNAIL_S3_BUCKET,
                Key: thumbnailKey
            }
            const thumbnailResponseData = await s3.putObject(putParams).promise()

            const thumbnailObject: GQLS3ObjectInput = {
                bucket: THUMBNAIL_S3_BUCKET,
                key: thumbnailKey,
            }
            logger.info({thumbnailBuffer, thumbnailObject, thumbnailResponseData}, "Thumbnail generated and uploaded")
            return {
                thumbnail: thumbnailObject
            }
        } catch (err) {
            logger.error({err}, "Error handling thumbnail")
            return {
                thumbnail: null
            }
        }
    } else {
        return {
            thumbnail: null
        }
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
    const generateThumbnailResults = processResults[0]
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
        "query": `mutation UpdateUpload($location: String!, $update: UpdateUploadInput) {
                    updateUpload(location: $location, update: $update) { 
                        id, customerId, name, location, status, created, modified, description, size, mimeType, thumbnail, downloadURL
                      }
                    }`,
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
