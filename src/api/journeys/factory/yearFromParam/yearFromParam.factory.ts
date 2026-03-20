import { BadRequestException } from '@nestjs/common';

export function yearFromParamFactory(year: string): number {
  const y = Number(year);
  if (!Number.isFinite(y)) throw new BadRequestException('year inválido.');
  return y;
}
