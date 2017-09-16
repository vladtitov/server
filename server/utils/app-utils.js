"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const algorithmCTR = 'aes-256-ctr', algorithmGSM = 'aes-256-gcm', PASSWORD = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';
exports.EXPIRATION_TIME = 180;
function encryptCustom(email, password) {
    let n = password.length + '';
    if (n.length == 1)
        n = '0' + n;
    return n + password + email;
}
exports.encryptCustom = encryptCustom;
function decryptCustom(url) {
    let index = +url.substr(0, 2);
    if (isNaN(index))
        return null;
    url = url.substr(2);
    let email = url.substr(index);
    let password = url.substr(0, index);
    return {
        email: email,
        password: password
    };
}
exports.decryptCustom = decryptCustom;
function encryptCTR(text) {
    var cipher = crypto.createCipher(algorithmCTR, PASSWORD);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
exports.encryptCTR = encryptCTR;
function decryptCTR(text) {
    var decipher = crypto.createDecipher(algorithmCTR, PASSWORD);
    var dec;
    try {
        dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
    }
    catch (e) {
        console.error(e);
    }
    return dec;
}
exports.decryptCTR = decryptCTR;
let ips = {};
function checkIp(req, max) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!ips[ip])
        ips[ip] = 0;
    ips[ip]++;
    if (ips[ip] > max) {
        setTimeout(() => {
            ips[ip] = 0;
        }, 60000);
        return null;
    }
    return ip;
}
exports.checkIp = checkIp;
