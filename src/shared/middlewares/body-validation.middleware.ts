import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { UnprocessableEntity } from '../errors/unprocessable-entity.js';

export async function bodyValidationMiddleware<T extends Object>(
  req: Request,
  res: Response,
  next: NextFunction,
  dto: new () => T,
) {
  const userDto = plainToInstance(dto, req.body);
  console.log('🚀 ~ dto:', dto);
  console.log('🚀 ~ req.body:', req.body);

  const errors = await validate(userDto);
  console.log('🚀 ~ errors:', errors);

  if (errors.length > 0) {
    throw new UnprocessableEntity('Validation failed', {
      errors: errors.map((error) => error.constraints),
    });
  }

  next();
}
