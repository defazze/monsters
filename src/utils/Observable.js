export const observable = target => {
  return new Proxy(target, new proxyObject());
};

class proxyObject {
  middlewares = [];
  subscribe = () => callback => {
    this.middlewares.push(callback);
  };

  unsubscribe = () => callback => {
    this.middlewares = this.middlewares.filter(c => c != callback);
  };

  get(target, prop) {
    if (prop == "subscribe") {
      return this.subscribe();
    }

    if (prop == "unsubscribe") {
      return this.unsubscribe();
    }
    return target[prop];
  }

  set(target, prop, val) {
    target[prop] = val;
    this.middlewares.forEach(m => m({ prop, val }));
    return true;
  }
}
