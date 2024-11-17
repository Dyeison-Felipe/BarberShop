import { ErrorOptions, HttpError } from './http-error.js';

export class ResourceNotFoundError extends HttpError {
  constructor(message = 'Resource Not Found Error', options?: ErrorOptions) {
    super(message, 404, options);
  }
}
