export const observable = target => {
  return new Proxy(target, new observableObject());
};

export class observableObject {
  middlewares = [];
  subscribe = () => (callback, prop = null) => {
    this.middlewares.push({ prop, callback });
  };

  unsubscribe = () => (callback, prop = null) => {
    this.middlewares = this.middlewares.filter(
      c => c.prop != prop || c.callback != callback
    );
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
    this.middlewares.forEach(m => {
      if (m.prop == prop || !m.prop) {
        m.callback({ prop, val });
      }
    });
    return true;
  }
}
