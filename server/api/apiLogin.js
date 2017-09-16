"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidV1 = require('uuid/v1');
const uuidV4 = require('uuid/v4');
const model_1 = require("../model/model");
const request = require("request");
const app_utils_1 = require("../utils/app-utils");
const hri = require('human-readable-ids').hri;
let confirmIps = {};
function initLogin(app) {
    app.route("/api/login/reset-password-confirm/").post(function (req, resp) {
        let ip = app_utils_1.checkIp(req, 100);
        if (!ip) {
            resp.json({ error: 'annoying' });
            return;
        }
        let password = req.body.password;
        let passwordE = app_utils_1.encryptCTR(password);
        let uid = req.body.uid;
        let user = app_utils_1.decryptCustom(uid);
        model_1.UserModel.findOne({ where: user })
            .then(function (user2) {
            if (user2) {
                updateLastVisitByid(user2.id, { password: passwordE, status: 'newpassword' })
                    .then(function (res) {
                    resp.json({
                        success: 'password',
                        user: {
                            nickname: user2.nickname
                        }
                    });
                });
            }
            else {
                resp.json({ error: 'nouser' });
            }
        });
    });
    app.route("/api/login/reset-password").post(function (req, resp) {
        let ip = app_utils_1.checkIp(req, 100);
        if (!ip) {
            resp.json({ error: 'annoying' });
            return;
        }
        let email = req.body.email;
        let emailE = app_utils_1.encryptCTR(email);
        let host = req.get('host');
        let confirmUrl = req.protocol + '://' + req.get('host') + '/#/confirm-reset-password/';
        model_1.UserModel.findOne({ where: { email: emailE } })
            .then(function (result) {
            if (result) {
                confirmUrl = confirmUrl + app_utils_1.encryptCustom(emailE, result.password);
                let nickname = result.nicknamel;
                sendResetPasswordEmail(email, host, confirmUrl, nickname, function (error) {
                    if (error) {
                        resp.json({ error: 'email send error',
                            user: { nickname: result.nickname, email: email } });
                    }
                    else {
                        updateLastVisitByid(result.id, { status: 'reset-sent' }).then(function () {
                            resp.json({
                                success: 'reset-sent',
                                user: {
                                    email: email,
                                    nickname: nickname
                                }
                            });
                        });
                    }
                });
            }
            else {
                resp.json({ error: 'wrong' });
            }
        });
    });
    app.route("/api/login/login").post(function (req, resp) {
        let ip = app_utils_1.checkIp(req, 100);
        if (!ip) {
            resp.json({ error: 'annoying' });
            return;
        }
        let email = req.body.email;
        let password = req.body.password;
        let deviceid = req.headers['user-agent'];
        let user = {
            email: app_utils_1.encryptCTR(email),
            password: app_utils_1.encryptCTR(password),
            deviceid: deviceid
        };
        model_1.UserModel.findOne({ where: { email: user.email, password: user.password } })
            .then(function (user2) {
            if (user2) {
                if (user2.confirmed) {
                    resp.json({ success: 'logedin', user: {
                            token: app_utils_1.encryptCTR(user2.uid),
                            nickname: user2.nickname,
                            email: app_utils_1.decryptCTR(user2.email),
                            role: user2.role
                        } });
                    updateLastVisitByid(user2.id, { status: 'logedin' });
                }
                else {
                    let confirmUrl = req.protocol + '://' + req.get('host') + '/#/login-confirm/';
                    confirmUrl = confirmUrl + app_utils_1.encryptCustom(user2.email, user2.password);
                    let host = req.get('host');
                    sendConfirmationEmail(email, host, confirmUrl, user2, function (error) {
                        if (error) {
                            resp.json({ error: 'sendemail', message: 'Error sending email. Please try again later' });
                            console.error(error);
                            return;
                        }
                        ;
                        resp.json({
                            error: 'verification',
                            message: 'Email was sent to ' + app_utils_1.decryptCTR(user2.email) + '. Please ckick on a link "Confirm Registration" in email body'
                        });
                    });
                    updateLastVisitByid(user2.id, { status: 'verification-required' });
                }
            }
            else {
                resp.json({ error: 'wrong' });
            }
        });
    });
    app.route("/api/login/register").post(function (req, resp) {
        let ip = app_utils_1.checkIp(req, 60);
        if (!ip) {
            resp.json({ error: 'annoying' });
            return;
        }
        let email = req.body.email;
        let password = req.body.password;
        let deviceid = req.headers['user-agent'];
        let host = req.get('host');
        let passE = app_utils_1.encryptCTR(password);
        let emailE = app_utils_1.encryptCTR(email);
        let user = {
            email: emailE,
            password: passE,
            deviceid: deviceid,
            nickname: hri.random(),
            uid: uuidV1()
        };
        model_1.UserModel.findOne({ where: { email: user.email } })
            .then(function (result) {
            if (result) {
                if (result.confirmed) {
                    resp.json({ error: 'exists' });
                }
                else
                    resp.json({
                        error: 'need-confirm',
                        message: 'Email was sent to ' + app_utils_1.decryptCTR(result.email) + '.  Please ckick on a link "Confirm Registration" in email body'
                    });
                return;
            }
            createUser(user).then(function (result) {
                let user2 = result.get({ plain: true });
                console.log(user2);
                if (!user2 || !user2.uid) {
                    console.error('error create user ' + JSON.stringify(user));
                    resp.json({ error: 'dberror', message: 'Database error. Please try again later' });
                    return;
                }
                updateLastVisitByid(user2.id, { status: 'created' });
                let confirmUrl = req.protocol + '://' + req.get('host') + '/#/login-confirm/';
                confirmUrl = confirmUrl + app_utils_1.encryptCustom(emailE, passE);
                sendConfirmationEmail(email, host, confirmUrl, user2, function (error) {
                    if (error) {
                        model_1.UserModel.destroy({ where: { id: user2.id } });
                        resp.json({ error: 'sendemail', message: 'Error sending email. Please try again later' });
                        console.error('ERROR send confirmation email ' + error);
                        return;
                    }
                    updateLastVisitByid(user2.id, { status: 'confirmation sent' });
                    resp.json({
                        success: 'confirmation sent',
                        user: {
                            email: email,
                            nickname: user2.nickname
                        }
                    });
                });
            });
        });
    });
    app.route("/api/login/confirm/:uid").get(function (req, resp) {
        let uid = req.params.uid;
        console.log(uid);
        if (!uid) {
            resp.end('hacker');
            return;
        }
        let ip = app_utils_1.checkIp(req, 100);
        if (!ip) {
            resp.json({ error: 'annoying' });
            return;
        }
        let user = app_utils_1.decryptCustom(uid);
        console.log(user);
        console.log(ip);
        model_1.UserModel.findOne({ where: { email: user.email, password: user.password } })
            .then(function (result) {
            let user2 = result.get({ plain: true });
            if (user2) {
                if (user2.confirmed) {
                    resp.json({ success: 'confirmed-before', user: { nickname: user2.nickname } });
                }
                else {
                    updateLastVisitByid(user2.id, { status: 'confirmed', confirmed: 1 }).then(function () {
                        resp.json({ success: 'confirmed', user: {
                                nickname: user2.nickname
                            } });
                    });
                }
            }
            else {
                resp.json({ error: 'Now are you' });
            }
        });
    });
}
exports.initLogin = initLogin;
function updateLastVisitByid(id, user) {
    user.lastVisit = Date.now();
    return model_1.UserModel.update(user, { where: { id: id } })
        .then(function (result) {
        console.log(result);
    });
}
let user = {
    confirmed: 1,
    email: 'vladstitov@gmail.com',
    uid: '4476d200-6f1a-11e7-b958-a3fb439b8f27'
};
function createUser(user) {
    return model_1.UserModel.create(user);
}
function sendResetPasswordEmail(email, host, confirmUrl, nickname, callBack) {
    let message = 'Hello ' + nickname +
        '. <br/> You are requested reset password at  ' + host + '. <br/>' +
        '<p>Click link below <br/>' +
        '<h2><a href="' + confirmUrl +
        '">Re Register</a></h2></p><br/>' +
        '<p><b>Note: this link is valid within 24h since you requested</b> <br/>';
    let body = {
        user: 'uplight.ca@gmail.com',
        pass: 'uplight.ca@gmail.com',
        subject: 'Reset password form ' + host,
        message: message,
        to: email
    };
    let options = {
        url: 'http://callcenter.front-desk.ca/send-email.php',
        method: 'POST',
        body: JSON.stringify(body)
    };
    console.log('sendConfirmationEmail ', options);
    request(options, function (error, object, data) {
        console.log('sendConfirmationEmail  result ', data);
        if (error)
            callBack(error);
        else {
            let result;
            try {
                result = JSON.parse(data);
            }
            catch (e) {
                callBack(e);
            }
            if (result.success)
                callBack();
        }
    });
}
function sendConfirmationEmail(email, host, confirmUrl, user, callBack) {
    let message = 'Hello ' + user.nickname +
        '. <br/> You have registered at  ' + host + '. <br/>' +
        '<p>To finalize registration please click link below <br/>' +
        '<h2><a href="' + confirmUrl +
        '">Confirm Registration</a></h2></p><br/>' +
        '<p><b>Note: this link is valid within 24h since you are registered</b> <br/>' +
        'Registration is free and does not contains any contracts </p>';
    let body = {
        user: 'uplight.ca@gmail.com',
        pass: 'uplight.ca@gmail.com',
        subject: 'Email Verification form ' + host,
        message: message,
        to: email
    };
    let options = {
        url: 'http://callcenter.front-desk.ca/send-email.php',
        method: 'POST',
        body: JSON.stringify(body)
    };
    console.log('sendConfirmationEmail ', options);
    request(options, function (error, object, data) {
        console.log('sendConfirmationEmail  result ', data);
        if (error)
            callBack(error);
        else {
            let result;
            try {
                result = JSON.parse(data);
            }
            catch (e) {
                callBack(e);
            }
            if (result.success)
                callBack();
        }
    });
}
