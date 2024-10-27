import { NextFunction, Request, Response } from 'express';

export function parseFormDataDto(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  console.log('🚀 ~ req.body.dto:', req.body.dto);
  req.body = JSON.parse(req.body.dto);

  next();
}
