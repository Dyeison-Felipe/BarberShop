import { ErrorOptions, HttpError } from './http-error.js';

export class BadRequestError extends HttpError {
  constructor(message = 'Bad request', options?: ErrorOptions) {
    super(message, 400, options);
  }
}
