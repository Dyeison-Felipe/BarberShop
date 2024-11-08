import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export async function bodyValidationMiddleware<T extends Object>(
  req: Request,
  res: Response,
  next: NextFunction,
  dto: new () => T,
) {
  const userDto = plainToInstance(dto, req.body);

  const errors = await validate(userDto);

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.map((error) => error.constraints),
    });
  }

  next();
}
