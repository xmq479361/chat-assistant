<template>
  <div id="app" style="background-color: #1e1e1e; color: white; height: 100vh;">
    <ChatAssistant />
  </div>
</template>

<script>
import ChatAssistant from './components/ChatAssistant.vue';

export default {
  components: {
    ChatAssistant,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: white; /* 统一文本颜色为白色 */
  margin: 0; /* 移除外部 margin */
  padding: 0; /* 移除外部 padding */
}
</style>
