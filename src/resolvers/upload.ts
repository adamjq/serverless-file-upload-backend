'use strict'

import { DynamoDB } from 'aws-sdk'
import bunyan from 'bunyan'
import {GQLUpload, GQLUploadStatus} from "../types/graphql"
import { getDownloadPresignedUrl, getThumbnailPresignedUrl } from "../util"

const UPLOAD_DDB_TABLE_NAME = process.env.UPLOAD_DDB_TABLE_NAME || ''

const logger = bunyan.createLogger({name: "upload"})

const ddb = new DynamoDB.DocumentClient()

export const handler = async (event: any) => {
    logger.info(event);

    const dbQueryParams : DynamoDB.DocumentClient.QueryInput = {
        TableName: UPLOAD_DDB_TABLE_NAME,
        KeyConditionExpression: "#id = :idValue",
        ExpressionAttributeNames:{
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":idValue": event.arguments.id
        }
    }
    let upload = {} as GQLUpload
    try {
        const data = await ddb.query(dbQueryParams).promise()
        if (data.Items && data.Items.length) {
            logger.info({item: data.Items[0]}, 'Successfully got upload item');
            upload = data.Items[0] as GQLUpload
        } else {
            logger.error({data}, 'Item does not exist')
            return
        }
    } catch (err) {
        logger.error('ERROR:', err);
        return err;
    }

    // Only return a download URL if the item is uploaded
    if (upload.status === GQLUploadStatus.COMPLETED) {
        upload.downloadURL = getDownloadPresignedUrl(upload.location, upload.name)
    } else {
        upload.downloadURL = undefined
    }

    if (upload.thumbnail) {
        upload.thumbnail.downloadURL = getThumbnailPresignedUrl(upload.thumbnail.bucket, upload.thumbnail.key, upload.name)
    }

    logger.info({upload}, 'Returning upload item');
    return upload
}
