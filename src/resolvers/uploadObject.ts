'use strict'

import { S3, DynamoDB } from 'aws-sdk'
import bunyan from 'bunyan'
import uuidv4 from 'uuid/v4'

import {GQLUpload, GQLUploadResponse, GQLUploadStatus} from "../types/graphql"

const UPLOAD_S3_BUCKET = process.env.UPLOAD_S3_BUCKET || ''
const UPLOAD_S3_BUCKET_REGION = process.env.UPLOAD_S3_BUCKET_REGION || ''
const UPLOAD_DDB_TABLE_NAME = process.env.UPLOAD_DDB_TABLE_NAME || ''

const logger = bunyan.createLogger({name: "uploadObject"})

const s3 = new S3({apiVersion: '2006-03-01'})
const ddb = new DynamoDB.DocumentClient()

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
        Bucket: UPLOAD_S3_BUCKET,
        Key: s3BucketKey,
        Expires: EXPIRY_TIME,
    }
    const signedURL = s3.getSignedUrl('putObject', params)

    const S3LocationPath = `${UPLOAD_S3_BUCKET}/${s3BucketKey}`

    const uploadObject: GQLUpload = {
        id: uploadId,
        location: S3LocationPath,
        name: uploadInput.name,
        description: uploadInput.description,
        status: DEFAULT_STATUS,
        created: currentTimestamp,
        modified: currentTimestamp,
    }

    // Store the upload in DynamoDB in a CREATED state
    const dbParams: DynamoDB.DocumentClient.PutItemInput = {
        TableName: UPLOAD_DDB_TABLE_NAME,
        Item: uploadObject
    }
    try {
        await ddb.put(dbParams).promise();
        logger.info({uploadObject}, 'Successfully stored upload item');
        const uploadResponse: GQLUploadResponse = {
            upload: uploadObject,
            uploadURL: signedURL,
        }
        logger.info({uploadResponse}, "Returning upload response");
        return uploadResponse
    } catch (err) {
        logger.error({uploadObject}, `ERROR: ${err}`);
        return err
    }
}
