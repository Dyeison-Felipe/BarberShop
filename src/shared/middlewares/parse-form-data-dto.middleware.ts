import { NextFunction, Request, Response } from 'express';

export function parseFormDataDto(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  req.body = JSON.parse(req.body.dto);

  next();
}
