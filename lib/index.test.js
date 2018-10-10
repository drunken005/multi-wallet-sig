const assert = require('assert');
const multiWalletSig = require('./index');

const privateKeys = [
    'B4D3CD82B474F9F050C1EC91606086FB8A4B41E82CC3D34566523A290FB653CE',
    'D3DE84FF6B6C020D0CF43251298FD40F54A2E4D6C043C8B3FF02AB1FF7F99B37'
];


describe('index.js', () => {

    let multi = '0x51b929f4cf7c7c95bffd3f9a1b0f8a512bf40c98';
    let nonce = 0;
    let destination = '0x5d6b33755202d5f3fda82dabb826fbc596a45cd9';
    let value = 1000000000000000000;
    let data = '0x';

    it('#method "createSig()"  should return one single  signature ', async () => {
        let sig = multiWalletSig.createSig(privateKeys[0], multi, nonce, destination, value, data);
        assert.ok(sig.hasOwnProperty('sigV'));
        assert.equal(sig.sigR.length, 66);
        assert.equal(sig.sigS.length, 66);
        console.log(sig);
    });

    it('#method "createSigs()" should return more signature ', async () => {
        let sig = multiWalletSig.createSigs(privateKeys, multi, nonce, destination, value, data);
        assert.ok(sig.hasOwnProperty('sigV'));
        assert.ok((sig.sigV.length === sig.sigR.length && sig.sigR.length === sig.sigS.length));
        console.log(sig)
    });

});