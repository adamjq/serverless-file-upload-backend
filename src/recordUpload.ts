'use strict'

import { DynamoDB } from 'aws-sdk'
import bunyan from 'bunyan'
import {GQLUpload, GQLUploadStatus} from "./types/graphql";

const UPLOAD_DDB_TABLE_NAME = process.env.UPLOAD_DDB_TABLE_NAME || ''

const logger = bunyan.createLogger({name: "recordUpload"})

const ddb = new DynamoDB.DocumentClient()

export const handler = async (event: any) => {
    logger.info(event);
    const record = event.Records[0]

    // S3 location is of form {Bucket}/{Key}
    const bucketName = record.s3.bucket.name
    const objectKey = record.s3.object.key
    const objectSize = record.s3.object.size

    const location = `${bucketName}/${objectKey}`
    logger.info(`Object location: ${location}`)

    // First, Get the item in it's current state
    let uploadItem: any = {}
    const dbGetParams: DynamoDB.DocumentClient.GetItemInput = {
        TableName: UPLOAD_DDB_TABLE_NAME,
        Key: {
            location: location
        }
    }
    try {
        const data = await ddb.get(dbGetParams).promise();
        logger.info('Successfully got upload item:', data.Item);
        uploadItem = data.Item as GQLUpload
    } catch (err) {
        logger.error('ERROR:', err);
        return err;
    }

    uploadItem.status = GQLUploadStatus.UPLOADED
    uploadItem.size = objectSize

    // Store the upload in DynamoDB in a CREATED state
    const dbPutParams: DynamoDB.DocumentClient.PutItemInput = {
        TableName: UPLOAD_DDB_TABLE_NAME,
        Item: uploadItem
    }
    try {
        await ddb.put(dbPutParams).promise();
        logger.info({uploadItem}, 'Successfully updated upload item');
    } catch (err) {
        logger.error({uploadItem}, `ERROR: ${err}`);
        return err
    }
}
