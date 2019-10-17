'use strict'

import { DynamoDB } from 'aws-sdk'
import bunyan from 'bunyan'

const UPLOAD_DDB_TABLE_NAME = process.env.UPLOAD_DDB_TABLE_NAME || ''

const logger = bunyan.createLogger({name: "recordUpload"})

const ddb = new DynamoDB.DocumentClient()

export const handler = async (event: any) => {
    logger.info(event);
}
