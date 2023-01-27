const subtle = crypto.subtle;

async function genkey() {
  let keypair = await subtle.generateKey(
    {
      name: 'RSA-OAEP',
      // Consider using a 4096-bit key for systems that require long-term security
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
  // console.log(keypair);
  return keypair;
}

async function toJWK(key) {
  const jwk = await subtle.exportKey('jwk', key);
  // console.log('jwk', jwk);
  return jwk;
}

async function toCrypto(jwk) {
  const cryObj = await subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
  // console.log('cry obj', cryObj);
  return cryObj;
}

async function encryptData(key, plainText) {
  const encodedText = new TextEncoder().encode(plainText);
  let cipherText = await subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    key,
    encodedText
  );
  // console.log('encypted text is ArrayBuffer', cipherText);
  // let buffer = new Uint8Array(cipherText);
  // console.log('En buffer is', buffer);
  return cipherText;
}
async function decryptData(key, cipherText) {
  try {
    let plaintext = await subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      key,
      cipherText
    );
    // console.log('decrypted ArrayBuffer', plaintext);
    let decodedText = new TextDecoder().decode(plaintext);
    // console.log('decoded text', decodedText);
    return decodedText;
  } catch (error) {
    console.log('decrypt error', error);
    throw new Error(error);
  }
}

// async function works() {
//   const keypair = await genkey();
//   // const keypair2 = await genkey();
//   console.log('public key', keypair.publicKey);
//   const jwk = await toJWK(keypair.publicKey);
//   // return jwk;
//   console.log(jwk.n);
//   const pub = await toCrypto(jwk);
//   let data =
//     'Hello World Hello world hello world Hello world hello world Hello world hello worldHello world hello world Hello world hello world Hello world hello world Hello world hello  worldHelloawo222';
//   const cipherText = await encryptData(pub, data);
//   console.log('length', data.length);
//   const plainText = await decryptData(keypair.privateKey, cipherText);
// }
export {genkey, encryptData, decryptData, toJWK, toCrypto};
