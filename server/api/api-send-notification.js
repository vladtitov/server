"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model/model");
const app_utils_1 = require("../utils/app-utils");
const request = require("request");
function apiSendNotification(app) {
    app.route("/api/give-me-all-users-from-db").get(function (req, resp) {
        model_1.UserModel.all().then(function (users) {
            resp.json(users);
        });
    });
    app.route("/api/send-notification").post(function (req, resp) {
        let email = req.body.email;
        let message = req.body.message;
        let subject = req.body.subject;
        let deviceid = req.headers['user-agent'];
        let ip = app_utils_1.checkIp(req, 300);
        if (!ip) {
            resp.json({ error: 'annoying' });
            return;
        }
        let user = {
            email: app_utils_1.encryptCTR(email),
            deviceid: deviceid,
            nickname: ''
        };
        model_1.UserModel.findOne({ where: { email: email } })
            .then(function (result) {
            if (result) {
                if (result.confirmed) {
                    user.nickname = result.nickname;
                    sendNotificationEmail(user, subject, message, function (res) {
                        res.ip = ip;
                        resp.json(res);
                    });
                }
                else {
                    resp.json({ error: 'need-confirmation' });
                }
            }
            else {
                resp.json({ error: 'notregistared', message: ' Please register first' });
            }
        });
    });
}
exports.apiSendNotification = apiSendNotification;
function sendNotificationEmail(user, subject, content, callBack) {
    let message = 'Hello ' + user.nickname +
        '. <br/>' + content +
        ' <br/>Notification form callcenter.front-desk.ca. <br/>';
    let body = {
        user: 'uplight.ca@gmail.com',
        pass: 'uplight.ca@gmail.com',
        subject: subject,
        message: message,
        to: user.email
    };
    let options = {
        url: 'http://callcenter.front-desk.ca/send-email.php',
        method: 'POST',
        body: JSON.stringify(body)
    };
    request(options, function (error, object, data) {
        if (error)
            callBack(error);
        else {
            try {
                let result = JSON.parse(data);
                if (result.success && result.success === 'success') {
                    callBack({ success: message });
                }
            }
            catch (e) {
                callBack({ error: e.toString() });
            }
        }
        console.log(data);
    });
}
