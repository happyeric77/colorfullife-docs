---
title: Publickey and address (ETH)
---

## What is ethereum publickey and ethereum address?

A common misconception is that the public key is the same as the address in Ethereum. They are two different things, however, and the address is derived from the public key.

Public keys are either 65 bytes long for uncompressed public keys (`0x04` || uncompressed public key), or 33 bytes long for compressed public keys (`0x02` or `0x03` || compressed public key ). The difference is that the uncompressed public key includes the y value of the point on the elliptic curve, and the compressed public key does not. Using uncompressed public keys can speed up computation, at the cost of more storage. The first byte is the public key header and it determines whether the key is compressed or uncompressed. For compressed public keys, the first byte also determines the parity, since one x coordinate has multiple y values on an elliptic curve.

To go from a public key to an address, we take the compressed public key, omit the first header byte (to get a 32-byte long public key), and hash that using Keccak-256. Then, take the last 20 bytes, which is the address.

Given the following private key:

`0xeaf2c50dfd10524651e7e459c1286f0c2404eb0f34ffd2a1eb14373db49fceb6`

Using elliptic curve point multiplication we get the following (uncompressed) public key:

`0x04b884d0c53b60fb8aafba20ca84870f20428082863f1d39a402c36c2de356cb0c6c0a582f54ee29911ca6f1823d34405623f4a7418db8ebb0203bc3acba08ba64`

Then we hash this with Keccak-256, which results in:

`0xf0d03901469804f101fd1c62c6d5a3c98ec9073b54fa0969957bd582e8d874bf`

Finally, we take the last 20 bytes (40 characters), which results in the following address:

`0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf`

Addresses are shorter than public keys, while still providing sufficient uniqueness and security for sending transactions on Ethereum.

## How to get ethereum publickey from ethereum address?

Ethereum address is derived from the ethereum publickey. It is the last 40 characters of the keccak256 hash of the public key, with 0x prefix. And Keccak256 hash method is not reversible. So it is not possible to get ethereum publickey from ethereum address. See the detail flow below.

Given an ethereum publickey (128 characters, hex format meaning 0-F). We can get the ethereum address by the following steps:

1. keccak hash it to receive 64 characters, again hex format

2. drop first 24 characters which remains for us 40 character as address

3. you can add "0x" now to the beginning of this array.

[Not possible to recover ethereum publickey from address](https://stackoverflow.com/questions/57802131/can-we-generate-public-key-from-ethereum-public-address)

[Recovered ethereum publickey from `v` `r` `s` signature](https://ethereum.stackexchange.com/questions/13778/get-public-key-of-any-ethereum-account/13892)

## Only way to recover public key is from signature

We can only recover the public key when we have a signature (`peronal_sign` or `transaction`).
The following is an example to recover the public key from a signature of eth personal sign

```js
import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
} from "ethereumjs-util";

// // Example message
// const message = `Sign in with Notifi

//     No password needed or gas is needed.

//     Click\uFFFDApprove\uFFFD only means you have provided this wallet is owned by you!

//     This request will not trigger any transaction or cost any gas fees.

// Use of our website and service is subject to our terms of service and privacy policy.

// 'Nonce:' 0xF2750f5612c8A9c08efEaDB146Ec17825Ec1F490colorfullife1690955595`;

const messageUint8Array = new Uint8Array([
  83, 105, 103, 110, 32, 105, 110, 32, 119, 105, 116, 104, 32, 78, 111, 116,
  105, 102, 105, 32, 10, 10, 32, 32, 32, 32, 78, 111, 32, 112, 97, 115, 115,
  119, 111, 114, 100, 32, 110, 101, 101, 100, 101, 100, 32, 111, 114, 32, 103,
  97, 115, 32, 105, 115, 32, 110, 101, 101, 100, 101, 100, 46, 32, 10, 10, 32,
  32, 32, 32, 67, 108, 105, 99, 107, 105, 110, 103, 32, 226, 128, 156, 65, 112,
  112, 114, 111, 118, 101, 226, 128, 157, 32, 111, 110, 108, 121, 32, 109, 101,
  97, 110, 115, 32, 121, 111, 117, 32, 104, 97, 118, 101, 32, 112, 114, 111,
  118, 101, 100, 32, 116, 104, 105, 115, 32, 119, 97, 108, 108, 101, 116, 32,
  105, 115, 32, 111, 119, 110, 101, 100, 32, 98, 121, 32, 121, 111, 117, 33, 32,
  10, 10, 32, 32, 32, 32, 84, 104, 105, 115, 32, 114, 101, 113, 117, 101, 115,
  116, 32, 119, 105, 108, 108, 32, 110, 111, 116, 32, 116, 114, 105, 103, 103,
  101, 114, 32, 97, 110, 121, 32, 116, 114, 97, 110, 115, 97, 99, 116, 105, 111,
  110, 32, 111, 114, 32, 99, 111, 115, 116, 32, 97, 110, 121, 32, 103, 97, 115,
  32, 102, 101, 101, 115, 46, 32, 10, 10, 32, 32, 32, 32, 85, 115, 101, 32, 111,
  102, 32, 111, 117, 114, 32, 119, 101, 98, 115, 105, 116, 101, 32, 97, 110,
  100, 32, 115, 101, 114, 118, 105, 99, 101, 32, 105, 115, 32, 115, 117, 98,
  106, 101, 99, 116, 32, 116, 111, 32, 111, 117, 114, 32, 116, 101, 114, 109,
  115, 32, 111, 102, 32, 115, 101, 114, 118, 105, 99, 101, 32, 97, 110, 100, 32,
  112, 114, 105, 118, 97, 99, 121, 32, 112, 111, 108, 105, 99, 121, 46, 32, 10,
  32, 10, 32, 39, 78, 111, 110, 99, 101, 58, 39, 32, 48, 120, 70, 50, 55, 53,
  48, 102, 53, 54, 49, 50, 99, 56, 65, 57, 99, 48, 56, 101, 102, 69, 97, 68, 66,
  49, 52, 54, 69, 99, 49, 55, 56, 50, 53, 69, 99, 49, 70, 52, 57, 48, 99, 111,
  108, 111, 114, 102, 117, 108, 108, 105, 102, 101, 49, 54, 57, 48, 57, 53, 53,
  53, 57, 53,
]);

const signature =
  "0x688c0b4a76acd0eb87140095929201e973d42405cb9aa29ab758fac41f8abab51a0668cc12e9ca059791bee112ae042dfd18c7845ef0e5c595623c46e551bf401c";

// Retrieve v, r, s from signature using ethereumjs-util
const { v, r, s } = fromRpcSig(signature);

// Recover public key from signature
const publicKey = ecrecover(
  hashPersonalMessage(Buffer.from(messageUint8Array)),
  v,
  r,
  s
);
/** NOTE:
 * The message must be hashed using the `hashPersonalMessage` function instead of directly using `keccak256` als below.
 * The reason is that the `hashPersonalMessage` function adds the prefix with the header used by the `eth_sign` RPC call` to the message.
 */
// const publicKey = ecrecover(keccak256(Buffer.from(messageUint8Array)), v, r, s);

// Console log results
console.log("## Recover public key from signature");
console.log({
  publicKeyRecoveredFromSignature: Uint8Array.from(publicKey),
  ethAddress: pubToAddress(publicKey).toString("hex"),
});
```

> Here is the more detail about hashPersonalMessage[^1]

[^1]: [source code docs](https://github.com/ethereumjs/ethereumjs-util/blob/f51bfcab9e5505dfed4819ef1336f9fc00a12c3d/src/signature.ts#L162)

<details>
<summary>Output</summary>

```bash
## Recover public key from signature
{
  publicKeyRecoveredFromSignature: Uint8Array(64) [
     57,  83, 106, 173,   4, 139, 195,  80, 120,  92,  29,
      7, 112,  42, 184, 103, 137,  48, 237, 229, 133, 172,
    229,  33, 198,  96, 106,  85,  44,  17,  72,  22, 187,
     94,  98, 101, 136, 229, 242,  91, 205, 233, 199, 148,
     17, 172, 128, 248, 250,  45,  87, 250, 152, 242,  96,
     47,   1, 197, 198, 167, 203, 195, 125,  66
  ],
  ethAddress: 'f2750f5612c8a9c08efeadb146ec17825ec1f490'
}
```

</details>

## Generate a public key from a private key

We can also get the public key from keypair generated by `secp256k1` library.

```js
Secp256k1.makeKeypair(
  Buffer.from(
    "c3aaf089a4976c12b8fde0faf5459769b5152fc2c95c9db288f5e29cea85ac19",
    "hex"
  )
).then((keypair) => {
  const buffer = Buffer.from(keypair.pubkey);

  const hexString = buffer.toString("hex");

  console.log(
    "\n\n\n## Generate public key from private key (compressed & uncompressed)"
  );
  console.log({
    publickeyUncompressedUint8Array: keypair.pubkey,
    publickeyUncompressed: hexString,
    publickeyCompressedUint8Array: Secp256k1.compressPubkey(keypair.pubkey),
    publicKeyCompressed: Buffer.from(
      Secp256k1.compressPubkey(keypair.pubkey)
    ).toString("hex"),
    ethAddr: pubToAddress(buffer.subarray(1)).toString("hex"),
  });
});
```

<details>
<summary>Output</summary>

```bash
## Generate public key from private key (compressed & uncompressed)
{
  publickeyUncompressedUint8Array: Uint8Array(65) [
      4,  57,  83, 106, 173,   4, 139, 195,  80, 120,  92,
     29,   7, 112,  42, 184, 103, 137,  48, 237, 229, 133,
    172, 229,  33, 198,  96, 106,  85,  44,  17,  72,  22,
    187,  94,  98, 101, 136, 229, 242,  91, 205, 233, 199,
    148,  17, 172, 128, 248, 250,  45,  87, 250, 152, 242,
     96,  47,   1, 197, 198, 167, 203, 195, 125,  66
  ],
  publickeyUncompressed: '0439536aad048bc350785c1d07702ab8678930ede585ace521c6606a552c114816bb5e626588e5f25bcde9c79411ac80f8fa2d57fa98f2602f01c5c6a7cbc37d42',
  publickeyCompressedUint8Array: Uint8Array(33) [
      2,  57, 83, 106, 173,   4, 139, 195,
     80, 120, 92,  29,   7, 112,  42, 184,
    103, 137, 48, 237, 229, 133, 172, 229,
     33, 198, 96, 106,  85,  44,  17,  72,
     22
  ],
  publicKeyCompressed: '0239536aad048bc350785c1d07702ab8678930ede585ace521c6606a552c114816',
  ethAddr: 'f2750f5612c8a9c08efeadb146ec17825ec1f490'
}
```

</details>

## Reference

- [Ethereum public key to address](https://lab.miguelmota.com/ethereum-public-key-to-address/example/)
- [The Basics of Public Key Cryptography](https://medium.com/coinmonks/the-basics-of-public-key-cryptography-3f7a8732a072)
- [Cosmos public (compressed)](https://github.com/cosmos/cosmjs/issues/1044#issuecomment-1043229970)
