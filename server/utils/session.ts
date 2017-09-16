
import * as moment from "moment";
import {Moment} from "moment";
const crypto = require('crypto');
import {Response} from "express";
const util = require('util');




export const randomBytes = util.promisify(crypto.randomBytes);

export class VOUser{
  id:string;
  email:string;
}

class Session {

  static readonly VALIDITY_MINUTES = 2;

  private validUntil: Moment;

  constructor(
    public  sessionId:string,
    public user:VOUser) {

    this.validUntil = moment().add(Session.VALIDITY_MINUTES, 'minutes');
  }

  isValid() {
    return moment().diff(this.validUntil, 'minutes') <= 0;
  }

}



class SessionStore {

  private sessions: {[key:string]: Session} = {};

  async  initializeUserSession(user:VOUser, res:Response) {

    const sessionId = await randomBytes(32).then(bytes => bytes.toString('hex'));

    console.log("sessionId", sessionId);

    sessionStore.createSession(sessionId, user);

    res.cookie("SESSIONID", sessionId, {httpOnly: true, secure: false});

    res.status(200).json({id: user.id, email: user.email});
  }

  createSession(sessionId:string, user: VOUser) {
    this.sessions[sessionId] = new Session(
      sessionId,
      user
    );
  }

  destroySession(sessionId:string) {
    delete this.sessions[sessionId];
  }


  findUserbySession(sessionId:string) : VOUser {

    const isSessionValid = this.isSessionValid(sessionId);

    return isSessionValid ? this.sessions[sessionId].user : undefined;
  }

  isSessionValid(sessionId:string) {

    const session = this.sessions[sessionId];

    const isSessionValid = session && session.isValid();

    return isSessionValid ? session.user : undefined;

  }

}

export const sessionStore = new SessionStore();


