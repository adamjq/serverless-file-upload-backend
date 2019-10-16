'use strict'

import bunyan from 'bunyan';

const logger = bunyan.createLogger({name: "lambda"});

export const handler = async (event: any) => {
    logger.info(event);
}