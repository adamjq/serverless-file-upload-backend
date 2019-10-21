'use strict'

import AWS from 'aws-sdk'
import bunyan from 'bunyan'

const RECORD_UPLOAD_LAMBDA_FUNCTION_ARN = process.env.RECORD_UPLOAD_LAMBDA_FUNCTION_ARN || ''
const ADD_METADATA_LAMBDA_FUNCTION_ARN = process.env.ADD_METADATA_LAMBDA_FUNCTION_ARN || ''
const VIRUS_SCAN_LAMBDA_FUNCTION_ARN = process.env.VIRUS_SCAN_LAMBDA_FUNCTION_ARN || ''
const GENERATE_THUMBNAIL_LAMBDA_FUNCTION_ARN = process.env.GENERATE_THUMBNAIL_LAMBDA_FUNCTION_ARN || ''

const logger = bunyan.createLogger({name: "fanout"})

const lambda = new AWS.Lambda()

export const handler = async (event: any) => {
    logger.info(event);

    const fanoutFunctions: string[] = [
        RECORD_UPLOAD_LAMBDA_FUNCTION_ARN,
        ADD_METADATA_LAMBDA_FUNCTION_ARN,
        VIRUS_SCAN_LAMBDA_FUNCTION_ARN,
        GENERATE_THUMBNAIL_LAMBDA_FUNCTION_ARN
    ]

    const fanoutPromises: any = []

    fanoutFunctions.forEach( (functionARN) => {
        // Invoke the Record Upload lambda
        const params = {
            FunctionName: functionARN,
            InvokeArgs: JSON.stringify(event),
        }
        fanoutPromises.push(lambda.invokeAsync(params, (err: any, data: any) => {
                if (err) {
                    logger.error({error: err, stack: err.stack}, "Error occurred invoking lambda")
                } else {
                    logger.info({data}, "Lambda successfully invoked")
                }
            }).promise()
        )
    })

    // Actually invoke the lambdas
    await Promise.all(fanoutPromises);
    logger.info("Exiting")
}
