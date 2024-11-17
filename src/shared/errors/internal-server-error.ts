import { ErrorOptions, HttpError } from './http-error.js';

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error', options?: ErrorOptions) {
    super(message, 500, options);
  }
}
