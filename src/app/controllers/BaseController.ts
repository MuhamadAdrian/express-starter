import { Response } from "express";

export class BaseController {
  /**
   * Send a standardized success response
   * @param res - Express Response object
   * @param data - The response data
   * @param message - Optional success message
   * @param statusCode - HTTP status code (default: 200)
   */
  protected static successResponse(
    res: Response,
    data: unknown = null,
    message: string = "Success",
    statusCode: number = 200
  ) {
    res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  }

  /**
   * Send a standardized error response
   * @param res - Express Response object
   * @param error - The error message or object
   * @param statusCode - HTTP status code (default: 500)
   */
  protected static  errorResponse(
    res: Response,
    error: unknown,
    statusCode: number = 500
  ) {
    const message =
      error instanceof Error ? error.message : error || "An error occurred";

    res.status(statusCode).json({
      status: "error",
      message,
    });
  }
}
