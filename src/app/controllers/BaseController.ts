import { Response, Request } from 'express'
import { validationResult } from 'express-validator'

export class BaseController {
    /**
     * Send a standardized success response
     * @param res - Express Response object
     * @param data - The response data
     * @param meta - The response meta
     * @param message - Optional success message
     * @param statusCode - HTTP status code (default: 200)
     */
    public static successResponse(
        res: Response,
        data: unknown,
        message: string = 'Success',
        statusCode: number = 200,
        meta: unknown = undefined
    ) {
        if (!res.headersSent) {
            res.status(statusCode).json({
                success: true,
                message,
                data,
                meta,
            })
        }
    }
    /**
     * Send a standardized error response
     * @param res - Express Response object
     * @param error - The error message or object
     * @param statusCode - HTTP status code (default: 500)
     */
    public static errorResponse(
        res: Response,
        error: unknown,
        statusCode: number = 400
    ) {
        if (!res.headersSent) {
            res.status(statusCode).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : error || 'An error occurred',
            })
        }
    }
    /**
     * Send a standardized validation error response
     * @param res - Express Response object
     * @param message - The error message
     * @param errors - The error from express
     * @param statusCode - HTTP status code (default: 500)
     */
    protected static errorValidation(
        res: Response,
        message: unknown,
        errors: Record<string, unknown>[],
        statusCode: number = 422
    ) {
        if (!res.headersSent) {
            res.status(statusCode).json({
                status: 'error',
                message,
                errors,
            })
        }
    }

    public static validate(req: Request, res: Response) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array({ onlyFirstError: true }),
            })
            return
        }
    }
}
