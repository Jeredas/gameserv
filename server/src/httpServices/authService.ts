
import { loginValidation, passValidation, regValidation } from '../utils/regValidation';
import { databaseService } from '../databaseService';
import { Router } from './httpRouter';
import DefaultResponse from './defaultResponse';
import UserModel from '../dataModels/userModel';
import SessionModel from '../dataModels/sessionModel';
import StatModel from '../dataModels/statisticModel';
class AuthResponse {
  session: string;
  userData: {login:string,avatar:string};

  constructor(sessionModel: SessionModel, user: UserModel) {
    this.session = sessionModel.session;
    this.userData = {
      login: user.login,
      avatar: user.avatar
    }
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
    const responseData = new AuthResponse(sessionModel, user);
    return new DefaultResponse(true, responseData);
  } catch (err) {
    return new DefaultResponse(false);
  }
};



async function register(params) {
  const decodedLogin = decodeURI(`${params.login}`);
  if (regValidation(params)) {
    const user = await UserModel.buildNewUser(decodedLogin, params.password, params.avatar, params.name);
    return new DefaultResponse(true);
  } else {
    return new DefaultResponse(false);
  }
}

async function registerValidation(params) {
  const decodedLogin = decodeURI(`${params.login}`);
  try {
    const user = await UserModel.buildByLogin(decodedLogin);
    return new DefaultResponse(false);
  } catch (err) {
    if (loginValidation(params.login)) {
      return new DefaultResponse(true);
    } else {
      return new DefaultResponse(false);
    }
  };
}
async function authBySession(params) {
  try {
    const session = await SessionModel.buildBySessionHash(params.sessionId)
    const user = await UserModel.buildByLogin(session.login);
    const sessionModel = await SessionModel.buildNewSession(user.login);
    const responseData = new AuthResponse(sessionModel, user);
    return new DefaultResponse(true, responseData);
  } catch (err) {
    return new DefaultResponse(false);
  }
};

async function authValidation(params) {
  try {
    const decodedLogin = decodeURI(`${params.login}`)
    const user = await UserModel.buildByLogin(decodedLogin);
    return new DefaultResponse(true);
  } catch (err) {
    return new DefaultResponse(false);
  }
}

async function passwordValidation(params) {
  try {
    if (passValidation(params.password)) {
      return new DefaultResponse(true);
    } else {
      throw new Error('invalid password')
    }
  } catch (err) {
    return new DefaultResponse(false)
  }
}

class AuthService {
  private router: Router;
  private serviceName: string = 'authService';

  getUserBySessionId(sessionId) {
    return databaseService.db.collection('sessions').findOne({ session: sessionId }, {}).then((res) => {
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
    this.addEndpoint('authBySession', authBySession);
    return true;
  }

  addEndpoint(name, func) {
    this.router.addRoute(this.serviceName + '/' + name, func);
  }
}

export const authService = new AuthService();


