"use server";

import NextCrypto from 'next-crypto';

const key = new NextCrypto(process.env.PLAM_ENCRYPTION_KEY!);

export async function encrypt(text?: string | null): Promise<string | null>  {
  if (!text) return null;
  return Buffer.from(await key.encrypt(text)).toString('base64');
}

export async function decrypt(text: string): Promise<string | null> {
  return await key.decrypt(Buffer.from(text, 'base64').toString('utf-8'));
}