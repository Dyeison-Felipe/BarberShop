import { NextFunction, Request, Response } from 'express';

export interface IMiddleware {
  use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
