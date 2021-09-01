export const regValidation = (params) => {
  const decodedLogin = decodeURI(`${params.login}`);
  if (loginValidation(params.login) && passValidation(params.password)) {
    return true;
  } else {
    return false;
  }
}

export function loginValidation(login: string) {
  if (login.match(/^[a-zA-Z0-9а-яА-Я]+([._]?[a-zA-Z0-9а-яА-Я]+)*$/) && login.length >= 3) {
    return true
  } else {
    return false
  }
}
export function passValidation(password) {
  return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) ? true : false

}

(function test() {
  console.assert(regValidation({ login: 'gdfg', password: 'gA123456789' }) === true);
  console.assert(regValidation({ login: 'Qwerty11', password: 'Qwerty11' }) === true);
  console.assert(regValidation({ login: 'Иван', password: 'passWord1' }) === true);
  console.assert(regValidation({ login: 'gd', password: 'gA123456789' }) === false,'Login is too short');
  console.assert(regValidation({ login: 'gdfg', password: 'gA12345' }) === false, 'Short password test failed');
  console.assert(regValidation({ login: '_$gdfg', password: 'Qwerty11' }) === false, 'Restricted chartacters in login');
  console.assert(regValidation({ login: 'Alex', password: '$ta!ker01' }) === false, 'Restricted chartacters in password');
})();