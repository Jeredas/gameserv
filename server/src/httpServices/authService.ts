import { regValidation } from '../utils/regValidation';
import { databaseService } from '../databaseService';
import { Router } from './httpRouter';

import DefaultResponse from './defaultResponse';
import UserModel from '../dataModels/userModel';
import SessionModel from '../dataModels/sessionModel';

class AuthResponse extends DefaultResponse{
  session: string;

  constructor(isSuccess:boolean, sessionModel:SessionModel){
    super(isSuccess);
    this.session = sessionModel.session;
  }
}

function testAccess(params, userData) {
  return Promise.resolve({ params, userData });
}

async function session(params) {
  try {
    const session = await SessionModel.buildBySessionHash(params.sessionHash);
    return new DefaultResponse(true);
  } catch (err) {
    return new DefaultResponse(false);
  }
};

async function auth(params) {
  try {
    const decodedLogin = decodeURI(`${params.login}`);
    const user = await UserModel.buildByCreds(decodedLogin, params.password);
    const sessionModel = await SessionModel.buildNewSession(user.login);
    const responseData = new AuthResponse(true, sessionModel)
    return new DefaultResponse(true, responseData);
  } catch (err) {
    return new DefaultResponse(false);
  }
};

async function register(params) {
  console.log('request register')
  const decodedLogin = decodeURI(`${params.login}`);
  if (regValidation(params) == 'ok') {
    console.log('register done')
    const user = await UserModel.buildNewUser(decodedLogin, params.password);
    return { status: 'ok' };
  } else {
    console.log('register error')
    return new DefaultResponse(false);
  }
}

function registerValidation(params) {
  console.log(params);
  const decoded = decodeURI(`${params.login}`);
  return databaseService.db.collection('users').findOne({ login: params.login }, {}).then((res) => {
    if (!res) {
      console.log(decoded)
      if (decoded.match(/^[a-zA-Z0-9а-яА-Я]+([._]?[a-zA-Z0-9а-яА-Я]+)*$/) && params.login.length >= 3) {
        console.log('ok')
        return { status: 'ok' };
      } else {
        console.log(`${decoded} -- error after validation`)
        return { status: 'error' };
      }
    } else {
      console.log('error user already exists')
      return new DefaultResponse(false);
    }
  });
}

function authValidation(params) {
  const decodedLogin = decodeURI(`${params.login}`)
  return databaseService.db.collection('users').findOne({ login: decodedLogin }, {}).then((res) => {
    if (res) {
      return new DefaultResponse(true);
    } else {
      return new DefaultResponse(false);
    }
  });
}

async function passwordValidation(params) {
  if (params.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
    return new DefaultResponse(true);
  } else {
    return new DefaultResponse(false);
  }
}

class AuthService {
  private router: Router;
  private serviceName: string = 'authService';

  getUserBySessionId(sessionId) {
    console.log(sessionId);
    return databaseService.db.collection('sessions').findOne({ session: sessionId }, {}).then((res) => {
      console.log(res);
      return res;
    });
  }

  async start(router: Router) {
    this.router = router;
    this.addEndpoint('testAccess', testAccess);
    this.addEndpoint('session', session);
    this.addEndpoint('auth', auth);
    this.addEndpoint('register', register);
    this.addEndpoint('regValidation', registerValidation);
    this.addEndpoint('authValidation', authValidation);
    this.addEndpoint('passwordValidation', passwordValidation);
    return true;
  }

  addEndpoint(name, func) {
    this.router.addRoute(this.serviceName + '/' + name, func);
  }
}

export const authService = new AuthService();