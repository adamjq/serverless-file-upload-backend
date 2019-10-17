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

    // First, Query the item in it's current state by global seconary index
    let uploadItem: any = {}
    const dbQueryParams : DynamoDB.DocumentClient.QueryInput = {
        TableName: UPLOAD_DDB_TABLE_NAME,
        IndexName: 'location',
        KeyConditionExpression: "#l = :s3path",
        ExpressionAttributeNames:{
            "#l": "location"
        },
        ExpressionAttributeValues: {
            ":s3path": location
        }
    }
    try {
        const data = await ddb.query(dbQueryParams).promise()
        if (data.Items && data.Items.length) {
            logger.info({item: data.Items[0]}, 'Successfully got upload item');
            uploadItem = data.Items[0] as GQLUpload
        } else {
            logger.error({data}, 'Item does not exist');
        }
    } catch (err) {
        logger.error('ERROR:', err);
        return err;
    }

    uploadItem.status = GQLUploadStatus.UPLOADED
    uploadItem.size = objectSize
    uploadItem.modified = new Date().toISOString()

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
