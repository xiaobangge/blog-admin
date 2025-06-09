// ECB模式

import cryptoJs from "crypto-js";

const key = "Sean's Blog";
// DES加密
export const encryptDes = message => {
  const keyHex = cryptoJs.enc.Utf8.parse(key);
  const option = { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 };
  const encrypted = cryptoJs.DES.encrypt(message, keyHex, option);
  return encrypted.ciphertext.toString();
};

// DES解密
export const decryptDes = message => {
  const keyHex = cryptoJs.enc.Utf8.parse(key);
  const decrypted = cryptoJs.DES.decrypt(
    {
      ciphertext: cryptoJs.enc.Hex.parse(message)
    },
    keyHex,
    {
      mode: cryptoJs.mode.ECB,
      padding: cryptoJs.pad.Pkcs7
    }
  );
  return decrypted.toString(cryptoJs.enc.Utf8);
};
