declare module 'pinia' {
  export function createPinia(): { install(app: import('vue').App): void };
  export function defineStore<
    S extends Record<string, any>,
    A extends Record<string, (...args: any[]) => any>
  >(
    id: string,
    options: {
      state?: () => S;
      actions?: A;
    }
  ): () => S & A;
}
