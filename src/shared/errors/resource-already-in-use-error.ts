import { ErrorOptions, HttpError } from './http-error.js';

export class ResourceAlreadyInUseError extends HttpError {
  constructor(
    message = 'Resource Already In Use Error',
    options?: ErrorOptions,
  ) {
    super(message, 400, options);
  }
}
