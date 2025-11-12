import { createStore } from 'vuex';

export interface RootState {
  message: string;
}

const store = createStore<RootState>({
  state: () => ({
    message: '欢迎使用全新的移动端应用框架！',
  }),
  mutations: {
    setMessage(state, payload: string) {
      state.message = payload;
    },
  },
  actions: {
    updateMessage({ commit }, payload: string) {
      commit('setMessage', payload);
    },
  },
});

export default store;
