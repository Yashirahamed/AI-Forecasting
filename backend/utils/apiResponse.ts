import { Response } from 'express'

export type ApiStatus = 'success' | 'error'

export interface ApiResponse<T = unknown> {
  status: ApiStatus
  data?: T
  message?: string
  timestamp: string
}

/**
 * Send a standardized success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string,
): Response => {
  const body: ApiResponse<T> = {
    status: 'success',
    data,
    message,
    timestamp: new Date().toISOString(),
  }
  return res.status(statusCode).json(body)
}

/**
 * Send a standardized error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
): Response => {
  const body: ApiResponse = {
    status: 'error',
    message,
    timestamp: new Date().toISOString(),
  }
  return res.status(statusCode).json(body)
}
