import { getRandomValues, randomBytes } from 'crypto';
import * as constants from './constants.js';


export const consumeToken = async (
  prefix: string,
  token: string,
): Promise<string | null> => {

  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() < .05) return reject('');
        const id = Array.from(getRandomValues(new Uint8Array(`${prefix}:${token}`.length)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        resolve(id);
      },
      Math.floor(Math.random() * 50) + 10,
    );
  });
}


export const issueToken = async (
  prefix: string,
  value: string,
  ttl: number,
  byteSize: number = constants.token_byte_size,
): Promise<string> => {
  const token = randomBytes(byteSize).toString('hex');

  await new Promise(resolve => {
    setTimeout(
      () => {
        resolve({
          key: `${prefix}:${token}`,
          value,
          ttl,
        });
      },
      Math.floor(Math.random() * 15) + 5
    );
  });

  return token;
}
