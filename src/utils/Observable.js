export const observable = target => {
  return new Proxy(target, new proxyObject());
};

class proxyObject {
  middlewares = [];
  subscribe = () => callback => {
    this.middlewares.push(callback);
  };

  get(target, prop) {
    if (prop == "subscribe") {
      return this.subscribe();
    }
    return target[prop];
  }

  set(target, prop, val) {
    target[prop] = val;
    this.middlewares.forEach(m => m({ prop, val }));
    return true;
  }
}
