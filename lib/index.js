const util = require("ethereumjs-util");
const solsha3 = require('solidity-sha3').default;
const leftPad = require('left-pad');
const _ = require('lodash');


let _initHash = function (multi, nonce, destination, value, data) {
    let input = '0x19' + '00' + multi.slice(2) + destination.slice(2) + leftPad(value.toString('16'), '64', '0') + data.slice(2) + leftPad(nonce.toString('16'), '64', '0');
    return solsha3(input);
};

let _signHash = function (msgHash, privKey) {
    return util.ecsign(new Buffer(util.stripHexPrefix(msgHash), 'hex'), new Buffer(privKey, 'hex'));
};

let _hexSig = function (sig) {
    return '0x' + sig.toString('hex');
};

/**
 * A single private key signature
 * @param privateKey The ETH private key to sign
 * @param multi Multi contract address
 * @param nonce Multi contract nonce eg: multiSigContract.nonce.call()
 * @param destination Transfer from contract to destination address
 * @param value Transfer amount eg: web3.toWei(1, 'ether')
 * @param data 0x
 * @returns {{sigV: *, sigR: *, sigS: *}}
 */
let createSig = function (privateKey, multi, nonce, destination, value, data) {
    let hash = _initHash(multi, nonce, destination, value, data);
    let sig = _signHash(hash, privateKey);
    return {sigV: sig.v, sigR: _hexSig(sig.r), sigS: _hexSig(sig.s)};
};

/**
 * Multiple private keys are signed
 * @param privateKeys An array of private keys to sign
 * @param multi Multi contract address
 * @param nonce Multi contract nonce eg: multiSigContract.nonce.call()
 * @param destination Transfer from contract to destination address
 * @param value Transfer amount eg: web3.toWei(1, 'ether')
 * @param data 0x
 * @returns {{sigV: Array, sigR: Array, sigS: Array}}
 */
let createSigs = function (privateKeys, multi, nonce, destination, value, data) {
    if (!_.isArray(privateKeys)) {
        throw new Error('privateKeys must be an array.');
    }
    let hash = _initHash(multi, nonce, destination, value, data);

    let sigV = [], sigR = [], sigS = [];
    privateKeys.forEach((privateKey) => {
        let sig = _signHash(hash, privateKey);
        sigV.push(sig.v);
        sigR.push(_hexSig(sig.r));
        sigS.push(_hexSig(sig.s));
    });
    return {sigV, sigR, sigS}
};

module.exports.createSig = createSig;
module.exports.createSigs = createSigs;