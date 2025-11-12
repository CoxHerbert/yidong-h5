import { reactive } from 'vue';

export function createPinia() {
  return {
    install(app) {
      app.provide('pinia', {});
    },
  };
}

export function defineStore(id, options = {}) {
  const stateFn = typeof options.state === 'function' ? options.state : () => ({});
  const actions = options.actions || {};
  const store = reactive({
    ...stateFn(),
  });

  Object.keys(actions).forEach((key) => {
    const action = actions[key];
    if (typeof action === 'function') {
      store[key] = (...args) => action.apply(store, args);
    }
  });

  return function useStore() {
    return store;
  };
}
