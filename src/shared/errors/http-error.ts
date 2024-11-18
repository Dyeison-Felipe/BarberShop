export type ErrorOptions = {
  stack?: string;
  [key: string]: unknown;
};

export class HttpError extends Error {
  httpStatusCode: number;
  options?: ErrorOptions;

  constructor(message: string, httpStatusCode: number, options?: ErrorOptions) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.options = options;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
