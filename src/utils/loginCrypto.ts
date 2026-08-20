import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const LOGIN_IV = CryptoJS.enc.Utf8.parse('1234567887654321');
const AES_KEY_LENGTH = 32;
const AES_KEY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export interface LoginEnvelope {
  random: string;
  pubKeyMd5: string;
  data: string;
}

function createAesKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(AES_KEY_LENGTH));
  return Array.from(bytes, (byte) => AES_KEY_CHARS[byte % AES_KEY_CHARS.length]).join('');
}

function toPem(publicKeyBody: string): string {
  const body = publicKeyBody
    .replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, '');
  const lines = body.match(/.{1,64}/g)?.join('\n') ?? body;
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----`;
}

export function createLoginEnvelope(
  publicKeyBody: string,
  credentials: { email: string; password: string },
): LoginEnvelope {
  const normalizedPublicKey = publicKeyBody.trim();
  const aesKey = createAesKey();
  const data = CryptoJS.AES.encrypt(
    JSON.stringify(credentials),
    CryptoJS.enc.Utf8.parse(aesKey),
    {
      iv: LOGIN_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).toString();

  const rsa = new JSEncrypt();
  rsa.setPublicKey(toPem(normalizedPublicKey));
  const random = rsa.encrypt(aesKey);
  if (!random) throw new Error('登录公钥加密失败，请重试');

  return {
    random,
    pubKeyMd5: CryptoJS.MD5(normalizedPublicKey).toString(),
    data,
  };
}
