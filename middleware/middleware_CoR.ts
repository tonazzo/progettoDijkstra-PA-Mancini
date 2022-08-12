import * as Middleware from './middleware';

/** 
*Catene di middleware
**/

export const authentication = [
    Middleware.checkHeader,
    Middleware.checkToken,
    Middleware.verifyAndAuthenticate
]

export const noAuthentication = [
    Middleware.checkPayloadHeader,
    Middleware.checkJSONPayload
]

export const refill = [
    Middleware.checkAdmin,
    Middleware.checkUserExistRefill

]

export const createModel = [
    Middleware.checkUserExist,
    Middleware.checkRemainingToken
]

export const executeModel = [
    Middleware.checkUserExist,
    Middleware.checkRemainingToken
]

export const createRevision = [
    Middleware.checkUserExist,
    Middleware.checkRemainingToken
]

export const removeRevision = [
    Middleware.checkUserExist
]

export const enableRevision = [
    Middleware.checkUserExist
]

export const disableRevision = [
    Middleware.checkUserExist
]

export const showModels = [
    Middleware.checkUserExist
]

export const showRevisions = [
    Middleware.checkUserExist
]

export const showCancelledRevision = [
    Middleware.checkUserExist
]

export const showToken = [
    Middleware.checkUserExist,
    Middleware.checkRemainingToken
]

export const catchError = [
    Middleware.logErrors,
    Middleware.errorHandler
]