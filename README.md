# multi-wallet-sig
multisig for Ethereum using detached signatures

## Get Started
```bash
npm install multi-wallet-sig --save
```
## Test
```bash
npm test
```
### Functions
#### `createSig(s)(privateKey, multi, nonce, destination, value, data)`
Signs a sha3 message hash with the private key
##### Inputs
* `privateKey(s)`：  The ETH private key(s) to sign
* `multi`： Multi sig wallet contract address
* `nonce`：  Multi contract nonce eg: multiSigContract.nonce.call()
* `destination`： Transfer from contract to destination address
* `value`： Transfer amount eg: web3.toWei(1, 'ether')
* `data`： SHA3 hash to be signed

##### Return value
Signed hash as signature object with v, r and s values.

#### Usage
```bash
const multiWalletSig = require('multi-wallet-sig');

const privateKeys = [
    'B4D3CD82B474F9F050C1EC91606086FB8A4B41E82CC3D34566523A290FB653CE',
    'D3DE84FF6B6C020D0CF43251298FD40F54A2E4D6C043C8B3FF02AB1FF7F99B37'
];
const multi = '0x51b929f4cf7c7c95bffd3f9a1b0f8a512bf40c98';
const nonce = 0;
const destination = '0x5d6b33755202d5f3fda82dabb826fbc596a45cd9';
const value = 1000000000000000000;
const data = '0x';

//A single private key signature
multiWalletSig.createSig(privateKeys[0], multi, nonce, destination, value, data);
return:
{
    sigV: 27,
    sigR: '0xb0dfd906caa8f840148c83c3140085c77f7d60dc4740dd98270f6c12c43a7f6e',
    sigS: '0x4a5029dc9dbaf2fcc36b87e6705b3a31053bd5a0a067d8855d26324a82b97d60'
}

//Multiple private key signatures
multiWalletSig.createSigs(privateKeys, multi, nonce, destination, value, data);
return:
{
    sigV: [28, 27],
    sigR: [
        '0xf8529a11b5b817edfeb3e8bee6600d36873134f9b5a2f72561cf308578f2e004',
        '0x5bf1249e00bfe7d0e14b6b1003dca26ea31e6db73c2f6c189b2ba2e6411c06bd'
    ],
    sigS: [
        '0x4e1fb1d0641ccff474fdd461f5e871e42f5f245b0b4c5a203a43da794e1a7fb3',
        '0x5de1b2ba42e16b98b5f01d13fef0faf3443c4409e37889b3b0df98c5c6fbd7f6'
    ]
}
```