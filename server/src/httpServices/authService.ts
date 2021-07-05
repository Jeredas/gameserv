import { regValidation } from '../utils/regValidation';
import { databaseService } from '../databaseService';
import { Router } from '../httpRouter';

function testAccess(params, userData) {
  return Promise.resolve({ params, userData });
}

function session(params) {
  console.log(params);
  return databaseService.db.collection('sessions').findOne({ session: params.sessionHash }, {}).then((res) => {
    console.log(res)
    if (res && params.sessionHash) {
      return { status: 'ok' };
    } else {
      return { status: 'error' }
    }
  });
};

function auth(params) {
  console.log(`${params} auth`);
  const decodedLogin = decodeURI(`${params.login}`)
  return databaseService.db.collection('users').findOne({ login: decodedLogin, password: params.password }, {}).then((res) => {
    if (res) {
      let sessionData = { login: decodedLogin, session: decodedLogin + (Math.random() * 1000).toFixed(0) };
      console.log(sessionData);
      return databaseService.db.collection('sessions').insertOne(sessionData).then(() => {
        return { status: 'ok', session: sessionData.session };
      });
    } else {
      return { status: 'error' }
    }
  });
};

function register(params) {
  console.log('request register')
  const decodedLogin = decodeURI(`${params.login}`);
  if (regValidation(params) == 'ok') {
    console.log('register done')
    return databaseService.db.collection('users').insertOne({ login: decodedLogin, password: params.password }).then(() => {
      return { status: 'ok' };
    });
  } else {
    console.log('register error')
    return { status: 'error' }
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
      return { status: 'error' };
    }
  });
}

function authValidation(params) {
  console.log(params);
  const decodedLogin = decodeURI(`${params.login}`)
  return databaseService.db.collection('users').findOne({ login: decodedLogin }, {}).then((res) => {
    if (res) {
      return { status: 'ok' };
    } else {
      return { status: 'error' };
    }
  });
}

function passwordValidation(params) {
  if (params.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
    return { status: 'ok' };
  } else {
    return { status: 'error' };
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

  start(router: Router) {
    this.router = router;
    this.addEndpoint('testAccess', testAccess);
    this.addEndpoint('session', session);
    this.addEndpoint('auth', auth);
    this.addEndpoint('register', register);
    this.addEndpoint('regValidation', registerValidation);
    this.addEndpoint('authValidation', authValidation);
    this.addEndpoint('passwordValidation', passwordValidation)
  }

  addEndpoint(name, func) {
    this.router.addRoute(this.serviceName + '/' + name, func);
  }
}

export const authService = new AuthService();