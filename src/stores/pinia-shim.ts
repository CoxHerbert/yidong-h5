import type { App } from 'vue';
import { reactive } from 'vue';

type StateTree = Record<string, any>;

type StoreOptions<S extends StateTree, A extends Record<string, any>> = {
  state?: () => S;
  actions?: A;
};

export function createPinia() {
  return {
    install(app: App) {
      app.provide('pinia', {});
    },
  };
}

export function defineStore<S extends StateTree, A extends Record<string, any>>(
  id: string,
  options: StoreOptions<S, A>
) {
  const stateFn = options.state || (() => ({} as S));
  const actions = options.actions || ({} as A);
  const store = reactive({
    ...stateFn(),
  }) as S & A;

  Object.keys(actions).forEach((key) => {
    const action = (actions as Record<string, any>)[key];
    if (typeof action === 'function') {
      (store as Record<string, any>)[key] = (...args: any[]) => action.apply(store, args);
    }
  });

  return function useStore() {
    return store;
  };
}
