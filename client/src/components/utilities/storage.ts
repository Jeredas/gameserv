class Storage {
  private storageSessionKey: string;
  constructor() {
    this.storageSessionKey = 'todoListApplicationSessionId';
  }

  setSession(sessionId: string): void {
    window.localStorage.setItem(this.storageSessionKey, sessionId);
  }

  getSession(): string {
    return window.localStorage.getItem(this.storageSessionKey);
  }

  removeSession(): void {
    window.localStorage.removeItem(this.storageSessionKey);
  }
}

const appStorage = new Storage();
export default appStorage;
