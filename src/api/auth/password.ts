import { compare, hash } from 'bcrypt';

const SALT_ROUNDS = 10;

function looksLikeBcrypt(stored: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(stored);
}

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, SALT_ROUNDS);
}

/** Aceita hash bcrypt ou legado em texto (ex.: seed dev). */
export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  if (looksLikeBcrypt(stored)) {
    return compare(plain, stored);
  }
  return plain === stored;
}
