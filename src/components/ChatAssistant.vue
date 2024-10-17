<template>
  <div
    class="chat-assistant"
    style="
      background-color: #1e1e1e;
      color: white;
      height: 100vh;
      display: flex;
    "
  >
    <AssistantSelector
      :assistants="assistants"
      :selectedAssistant="currentAssistant?.id"
      @update-selected="handleSelectAssistant"
      @update-assistants="onUpdateAssistants"
    />
    <div
      class="chat-area"
      style="flex: 1; display: flex; flex-direction: column; padding: 10px"
    >
      <div class="current-assistant" v-if="currentAssistant">
        当前助手: {{ currentAssistant.name }} -
        {{ currentAssistant.description }}
      </div>
      <MessageList :messages="messages" />
      <div
        class="input-area"
        style="
          display: flex;
          align-items: flex-start;
          background-color: #2c3e50;
          padding: 10px;
          border-radius: 4px;
        "
      >
        <textarea
          v-model="userInput"
          :rows="3"
          placeholder="输入您的问题..."
          style="
            background-color: #f0f0f0;
            color: black;
            border: none;
            border-radius: 4px;
            resize: none;
            overflow-y: auto;
            max-height: 300px;
            flex: 1;
            margin-right: 10px;
            max-width: 100%;
          "
          :maxlength="5000"
        />
        <el-button
          :loading="isLoading"
          :disabled="!userInput || isLoading"
          @click="sendMessage"
          style="background-color: #409eff; color: white; width: 100px"
          icon="el-icon-sent"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessageToDeepSeek } from "../utils/api"; // 导入工具类
import { Assistant, Message } from "../models/models"; // 导入模型
import AssistantSelector from "./AssistantSelector.vue";
import MessageList from "./MessageList.vue";

export default {
  components: { AssistantSelector, MessageList },
  data() {
    return {
      userInput: "",
      messages: [],
      isLoading: false,
      currentAssistant: null,
      assistants: [
        new Assistant("1", "助手1", "这是助手1的描述", "默认提示词1", 10),
        new Assistant("2", "助手2", "这是助手2的描述", "默认提示词2", 10),
      ],
    };
  },
  methods: {
    async sendMessage() {
      this.isLoading = true;
      const userMessage = new Message(Date.now(), this.userInput, "user");
      this.messages.push(userMessage);

      try {
        const aiResponse = await sendMessageToDeepSeek(
          this.messages.map((msg) => ({ role: msg.role, content: msg.content }))
        );
        const assistantMessage = new Message(
          Date.now() + 1,
          aiResponse,
          "assistant"
        );
        this.messages.push(assistantMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        this.isLoading = false;
        this.userInput = ""; // 清空输入框
      }
    },
    handleSelectAssistant(id) {
      this.currentAssistant = this.assistants.find(
        (assistant) => assistant.id === id
      );
      console.log(`当前选择的助手 ID: ${id}`);
    },
    onUpdateAssistants(assistants) {
      console.log("onUpdateAssistants", assistants);
      this.assistants = assistants;
    },
  },
};
</script>

<style scoped>
.chat-assistant {
  display: flex;
  height: 100vh;
}
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.input-area {
  display: flex;
  align-items: flex-start;
  background-color: #2c3e50; /* 深色背景 */
  padding: 10px;
  border-radius: 4px;
}
.current-assistant {
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
