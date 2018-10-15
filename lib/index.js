const util = require("ethereumjs-util");
const solsha3 = require('solidity-sha3').default;
const leftPad = require('left-pad');
const _ = require('lodash');
const BigNumber = require('bignumber.js');

let isBigNumber = function (object) {
    return object instanceof BigNumber ||
        (object && object.constructor && object.constructor.name === 'BigNumber');
};

let _initHash = function (...args) {
    //contract.address, multiNonce, config.destination, amount, '0x'
    let input = '0x1900';
    _.each(args, (arg) => {
        if (_.isString(arg) && arg.indexOf('0x') === 0) {
            input += arg.slice(2);
        } else if (isBigNumber(arg)) {
            input += leftPad(arg.toString('16'), '64', '0');
        } else if (_.isString(arg) && arg.indexOf('0x') < 0) {
            input += arg;
        } else if (_.isNumber(arg)) {
            input += leftPad(new BigNumber(arg).toString('16'), '64', '0');
        }
    });
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
 * @param args Contract method arguments
 * @returns {{sigV: *, sigR: *, sigS: *}}
 */
let createSig = function (privateKey, ...args) {
    let hash = _initHash(...args);
    let sig = _signHash(hash, privateKey);
    return {sigV: sig.v, sigR: _hexSig(sig.r), sigS: _hexSig(sig.s)};
};

/**
 * Multiple private keys are signed
 * @param privateKeys
 * @param args Contract method arguments
 * @returns {{sigV: Array, sigR: Array, sigS: Array}}
 */
let createSigs = function (privateKeys, ...args) {
    if (!_.isArray(privateKeys)) {
        throw new Error('privateKeys must be an array.');
    }
    let hash = _initHash(...args);
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