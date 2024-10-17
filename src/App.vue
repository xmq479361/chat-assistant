<template>
  <div id="app" style="background-color: #1e1e1e; color: white; height: 100vh">
    <router-view />
  </div>
</template>

<script>
export default {
  components: {},
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
