'use strict'

import { DynamoDB } from 'aws-sdk'
import bunyan from 'bunyan'

import {GQLUpload, GQLUpdateUploadInput} from "../types/graphql"
import {getUploadPresignedUrl} from "../util";

const UPLOAD_DDB_TABLE_NAME = process.env.UPLOAD_DDB_TABLE_NAME || ''

const logger = bunyan.createLogger({name: "updateUpload"})

const ddb = new DynamoDB.DocumentClient()

interface HandlerEvent {
    arguments: {
        location: string,
        update: GQLUpdateUploadInput
    }
}

export const updateFields = (update: GQLUpdateUploadInput, upload: GQLUpload): GQLUpload => {
    logger.info({update, upload}, "Building object with updated fields");
    Object.keys(update).forEach((k: string) => {
        // @ts-ignore
        upload[k] = update[k]
    })
    const currentTs = Date.now()
    upload.modified = new Date(currentTs).toISOString()
    return upload
}

const getUploadFromDDB = async (location: string): Promise<GQLUpload | undefined> => {
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
            return data.Items[0] as GQLUpload
        } else {
            logger.error({data}, 'Item does not exist');
        }
    } catch (err) {
        logger.error('ERROR:', err);
        return err;
    }
}

export const handler = async (event: HandlerEvent): Promise<GQLUpload | undefined> => {
    logger.info(event)
    const S3Location = event.arguments.location
    const update = event.arguments.update

    // First, Query the item in it's current state by global seconary index
    const uploadItem = await getUploadFromDDB(S3Location)

    if (uploadItem) {
        const updatedItem = updateFields(update, uploadItem)
        logger.info({updatedItem}, "Upload with updated fields");

        // Store the upload in DynamoDB in a CREATED state
        const dbPutParams: DynamoDB.DocumentClient.PutItemInput = {
            TableName: UPLOAD_DDB_TABLE_NAME,
            Item: updatedItem
        }
        try {
            await ddb.put(dbPutParams).promise();
            logger.info("Update in dynamodb succeeded");
        } catch (err) {
            logger.error({updatedItem}, `ERROR: ${err}`);
            return err
        }
        updatedItem.downloadURL = getUploadPresignedUrl(updatedItem.location)
        logger.info({updatedItem}, 'Returning updated upload item');
        return updatedItem
    }
    logger.error("No record in dynamodb to update");
}
