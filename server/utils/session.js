"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const crypto = require('crypto');
const util = require('util');
exports.randomBytes = util.promisify(crypto.randomBytes);
class VOUser {
}
exports.VOUser = VOUser;
class Session {
    constructor(sessionId, user) {
        this.sessionId = sessionId;
        this.user = user;
        this.validUntil = moment().add(Session.VALIDITY_MINUTES, 'minutes');
    }
    isValid() {
        return moment().diff(this.validUntil, 'minutes') <= 0;
    }
}
Session.VALIDITY_MINUTES = 2;
class SessionStore {
    constructor() {
        this.sessions = {};
    }
    initializeUserSession(user, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = yield exports.randomBytes(32).then(bytes => bytes.toString('hex'));
            console.log("sessionId", sessionId);
            exports.sessionStore.createSession(sessionId, user);
            res.cookie("SESSIONID", sessionId, { httpOnly: true, secure: false });
            res.status(200).json({ id: user.id, email: user.email });
        });
    }
    createSession(sessionId, user) {
        this.sessions[sessionId] = new Session(sessionId, user);
    }
    destroySession(sessionId) {
        delete this.sessions[sessionId];
    }
    findUserbySession(sessionId) {
        const isSessionValid = this.isSessionValid(sessionId);
        return isSessionValid ? this.sessions[sessionId].user : undefined;
    }
    isSessionValid(sessionId) {
        const session = this.sessions[sessionId];
        const isSessionValid = session && session.isValid();
        return isSessionValid ? session.user : undefined;
    }
}
exports.sessionStore = new SessionStore();
