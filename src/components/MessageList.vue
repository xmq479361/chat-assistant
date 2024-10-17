<template>
  <div class="message-list">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message"
      :class="{
        'user-message': message.role === 'user',
        'ai-message': message.role === 'assistant',
      }"
      @mouseover="showActions = true"
      @mouseleave="showActions = false"
    >
      <span>{{ message.content }}</span>
      <div
        v-if="message.role === 'assistant' && showActions"
        class="action-buttons"
      >
        <el-button
          type="primary"
          icon="CopyDocument"
          @click="copyMessage"
          circle
        />
        <el-button type="primary" icon="Check" @click="bestResponse" circle />
        <el-button type="primary" icon="Close" @click="errorResponse" circle />
        <el-button type="primary" icon="Refresh" @click="reload" circle />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showActions: false,
    };
  },
  methods: {
    bestResponse() {
      // 处理最佳答复逻辑
      console.log("最佳答复");
    },
    errorResponse() {
      // 处理错误回复逻辑
      console.log("错误回复");
    },
    reload() {
      // 处理重新加载逻辑
      console.log("重新加载");
    },
    copyMessage() {
      // 处理复制消息逻辑
      console.log("复制消息");
    },
  },
};
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.message {
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
  max-width: 70%; /* 限制最大宽度 */
  position: relative; /* 使 action-buttons 相对定位 */
}
.user-message {
  align-self: flex-end; /* 用户消息右对齐 */
  background-color: #409eff; /* 用户消息背景色 */
  color: white; /* 用户消息文本颜色 */
}
.ai-message {
  align-self: flex-start; /* AI 消息左对齐 */
  background-color: #2c3e50; /* AI 消息背景色 */
  color: white; /* AI 消息文本颜色 */
}
.action-buttons {
  position: absolute; /* 绝对定位 */
  left: 0; /* 左侧对齐 */
  bottom: -30px; /* 底部偏移 */
  display: flex;
  gap: 5px;
}
</style>
