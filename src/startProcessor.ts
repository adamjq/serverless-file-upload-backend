'use strict'

import { StepFunctions } from 'aws-sdk'
import bunyan from 'bunyan'

const PROCESSING_STATE_MACHINE_ARN = process.env.PROCESSING_STATE_MACHINE_ARN || ''

const logger = bunyan.createLogger({name: "start-processor"})

const SF = new StepFunctions({apiVersion: '2016-11-23'});

export const handler = async (event: any) => {
    logger.info(event);

    const params = {
      stateMachineArn: PROCESSING_STATE_MACHINE_ARN,
      input: JSON.stringify(event),
    };
    await SF.startExecution(params, (err: any, data: any) => {
      if (err) {
        logger.error({error: err, stack: err.stack}, "Error occurred invoking processor state machine")
    } else {
        logger.info({data}, "Processor state machine successfully invoked")
    }}).promise()
    logger.info("Exiting")
}
