import { ErrorOptions, HttpError } from './http-error.js';

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', options?: ErrorOptions) {
    super(message, 401, options);
  }
}
