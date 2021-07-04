export const regValidation = (params) => {
  const decodedLogin = decodeURI(`${params.login}`);
  if(params.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) && (decodedLogin.match(/^[a-zA-Z0-9а-яА-Я]+([._]?[a-zA-Z0-9а-яА-Я]+)*$/))) {
      return 'ok';
  } else {
      return 'error';
  }
}

(function test(){
  console.assert(regValidation({login:'gdfg', password:'gA123456789'}) === 'ok');
  console.assert(regValidation({login:'gdfg', password:'gA12345'}) === 'error', 'Short password test failed');
})();