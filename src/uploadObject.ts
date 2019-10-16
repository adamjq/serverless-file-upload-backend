'use strict'

import AWS from 'aws-sdk'
import bunyan from 'bunyan'
import uuidv4 from 'uuid/v4'

import {GQLUpload, GQLUploadResponse, GQLUploadStatus} from "./types/graphql"

const USER_UPLOAD_S3_BUCKET = process.env.USER_UPLOAD_S3_BUCKET || ''
const USER_UPLOAD_S3_BUCKET_REGION = process.env.USER_UPLOAD_S3_BUCKET_REGION || ''

const logger = bunyan.createLogger({name: "lambda"})

const S3 = new AWS.S3({apiVersion: '2006-03-01'})

const DEFAULT_STATUS: GQLUploadStatus = GQLUploadStatus.CREATED
// Pre-signed URLs are valid for 5 minutes for file uploads
const EXPIRY_TIME = 300

export const handler = async (event: any) => {
    logger.info(event);
    const uploadInput = event.arguments.upload

    const currentTimestamp = new Date().toISOString()
    const uploadId = uuidv4()
    const s3BucketKey = uuidv4()

    // Params for S3 pre-signed URL putObject request
    const params = {
        Bucket: USER_UPLOAD_S3_BUCKET,
        Key: s3BucketKey,
        Expires: EXPIRY_TIME,
    }
    const signedURL = S3.getSignedUrl('putObject', params)

    const S3LocationPath = `${USER_UPLOAD_S3_BUCKET}/${s3BucketKey}`

    // TODO: Store this in DDB
    const uploadObject: GQLUpload = {
        id: uploadId,
        location: S3LocationPath,
        name: uploadInput.name,
        description: uploadInput.description,
        status: DEFAULT_STATUS,
        created: currentTimestamp,
        modified: currentTimestamp,
    }

    const uploadResponse: GQLUploadResponse = {
        upload: uploadObject,
        uploadURL: signedURL,
    }
    logger.info({uploadResponse}, "Returning upload response");
    return uploadResponse
}
