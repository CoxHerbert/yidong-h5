<template>
  <main class="home">
    <h1>移动端首页</h1>
    <p class="description">
      这是一个基于 Vue 3 与 Vant 4 构建的全新应用入口示例。
    </p>
    <van-space direction="vertical" fill>
      <van-button type="primary" block @click="handlePrimaryClick">
        查看全局提示
      </van-button>
      <van-cell title="当前提示语" :value="message" />
    </van-space>
  </main>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HomeView',
  setup() {
    const store = useStore();

    const message = computed(() => store.state.message);

    function handlePrimaryClick() {
      const nextMessage = message.value.includes('欢迎')
        ? 'Vant 4 已成功接入，快去构建你的业务页面吧！'
        : '欢迎使用全新的移动端应用框架！';
      store.commit('setMessage', nextMessage);
    }

    return {
      message,
      handlePrimaryClick,
    };
  },
};
</script>

<style scoped>
.home {
  padding: 24px 16px 64px;
  color: #323233;
}

h1 {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 600;
}

.description {
  margin: 0 0 24px;
  color: #646566;
  line-height: 1.6;
}
</style>
