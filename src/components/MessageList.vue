<template>
  <div class="message-list">
    <div v-for="message in messages" :key="message.id" class="message">
      <span>{{ message.content }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: Array,
  },
};
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
}
.message {
  margin: 5px 0;
}
</style>
