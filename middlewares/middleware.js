const logger = require('../util/logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (err, req, res, next) => {
    response.status(404).send({ error: 'unknown endpoint' })
    next(err)
}

const errorHandler = (error, request, response, next) => {
    console.log('errorHandler:', error)
    console.log('errorHandler error.name: ', error.name);
    if (error.name === 'ReferenceError') {
        return response.status(400).send({
            error: 'reference error'
        })
    }

    if (error === 'ERROR IN PUT') {
        return response.status(400).send({
            error: 'ERROR IN PUT HERE'
        })
    }

    if (error === 'ERROR IN POST') {
        return response.status(400).send({
            error: 'ERROR IN POST HERE'
        })
    }

    if (error.name === 'SequelizeValidationError') {
        return response.status(400).send({
            error: 'Validation isEmail on username failed'
        })
    }
    if (error.name === 'SequelizeDatabaseError') {
        return response.status(400).send({
            error: 'Error in query'
        })
    }


    //logger.error(error.message)

    next(error)
}

/* const errorHandler = (err, req, res, next) => {
    console.log('Error handler here')
    console.log('Error: ', err)
    next()
} */
const time = (req, res, next) => {
    console.log('Time:', Date.now())
    next()
}
/* 
const time2 = (req, res, next) => {
    console.log('time2')
    next()
}

const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
} */

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    time
}