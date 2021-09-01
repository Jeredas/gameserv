import appStorage from "./storage";

export function digestMessage(message: string, key: string) {
    const msgUint8 = new TextEncoder().encode(message + key);
    return window.crypto.subtle.digest('SHA-256', msgUint8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    });
  }
  
  export function paramsFromObject(params: any):string {
    // TODO: use recursive for objects
    const pairs = Object.keys(params).map((param) => `${param}=${params[param]}`);
    return pairs.join('&');
  }
  
  export function apiRequest(apiUrl:string, service:string, params:any) {
    const sessionId = appStorage.getSession();
    if (sessionId) {
      params.sessionId = sessionId;
    }
    return fetch(`${apiUrl}${service}?${paramsFromObject(params)}`).then((response) => response.json());
  }
  
  export function apiPostRequest (apiUrl:string, service:string, params:any) {
    return fetch(`${apiUrl}${service}`, { 
      method: "POST",
      body: `login=${params.login}&password=${params.password}&avatar=${params.avatar}&name=${params.login}` 
      })


  }