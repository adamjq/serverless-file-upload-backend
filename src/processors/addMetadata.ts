'use strict'

import bunyan from 'bunyan'
import {getS3LocationFromEvent} from "../util"
import readChunk from 'read-chunk'
import fileType from 'file-type'
import axios from "axios"
import {GQLUploadStatus} from "../types/graphql";

const logger = bunyan.createLogger({name: "addMetadata"})

const APPSYNC_URL = process.env.APPSYNC_URL || ''
const APPSYNC_REGION = process.env.APPSYNC_REGION || ''
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ''
const UPLOAD_S3_BUCKET = process.env.UPLOAD_S3_BUCKET || ''

// TODO: actually implement this
const determineMimeType = () => {
    return 'image/png'
}

const determineFileSize = (S3Event: any): number => {
    const record = S3Event.Records[0]
    return record.s3.object.size
}

export const handler = async (event: any) => {
    logger.info(event);

    logger.info("Called from state machine")

   //  const location = getS3LocationFromEvent(event)
   //
   //  const update = {
   //      mimeType: determineMimeType(),
   //      size: determineFileSize(event),
   //      status: GQLUploadStatus.UPLOADED
   //  }
   //
   //  const gqlMutation = {
   //      "query": "mutation UpdateUpload($location: String!, $update: UpdateUploadInput) { updateUpload(location: $location, update: $update) { id } }",
   //      "variables": { "location": location, "update": update }
   //  }
   // logger.info({gqlMutation})
   //
   //  try {
   //    const response = await axios.post(APPSYNC_URL, gqlMutation, { headers: {
   //      'X-API-KEY': APPSYNC_API_KEY, 'Content-Type': 'application/json'
   //    }})
   //    logger.info({response})
   //  } catch (error) {
   //    logger.error({error})
   //  }
}
