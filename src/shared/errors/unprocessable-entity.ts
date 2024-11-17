import { HttpError, ErrorOptions } from './http-error.js';

export class UnprocessableEntity extends HttpError {
  constructor(message = 'Unprocessable Entity', options?: ErrorOptions) {
    super(message, 422, options);
  }
}
