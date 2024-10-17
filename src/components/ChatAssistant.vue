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
      @select-assistant="handleSelectAssistant"
      @edit-assistant="openEditDialog"
      @delete-assistant="deleteAssistant"
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
          @input="adjustHeight"
          style="
            background-color: black;
            color: white;
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
      <EditAssistantDialog
        :visible="isEditDialogVisible"
        :assistant="editAssistant"
        @save="saveAssistant"
      />
    </div>
  </div>
</template>

<script>
import { sendMessageToDeepSeek } from "../utils/api";
import { Assistant, Message } from "../models/models";
import AssistantSelector from "./AssistantSelector.vue";
import MessageList from "./MessageList.vue";
import EditAssistantDialog from "./EditAssistantDialog.vue";

export default {
  components: { AssistantSelector, MessageList, EditAssistantDialog },
  data() {
    return {
      userInput: "",
      messages: [],
      isLoading: false,
      currentAssistant: null,
      editAssistant: null,
      isEditDialogVisible: false,
      assistants: [
        new Assistant("1", "助手1", "这是助手1的描述", "默认提示词1", 10),
        new Assistant("2", "助手2", "这是助手2的描述", "默认提示词2", 10),
      ],
    };
  },
  methods: {
    adjustHeight() {
      const lines = this.userInput.split("\n").length;
      if (lines > 10) {
        this.userInput = this.userInput.split("\n").slice(0, 10).join("\n"); // 限制为10行
      }
    },
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
    openEditDialog(assistant) {
      this.editAssistant = assistant;
      this.isEditDialogVisible = true;
    },
    saveAssistant(updatedAssistant) {
      const index = this.assistants.findIndex(
        (assistant) => assistant.id === updatedAssistant.id
      );
      if (index !== -1) {
        this.assistants.splice(index, 1, updatedAssistant);
      }
    },
    deleteAssistant(id) {
      this.assistants = this.assistants.filter(
        (assistant) => assistant.id !== id
      );
      if (this.currentAssistant && this.currentAssistant.id === id) {
        this.currentAssistant = null; // 清空当前助手
      }
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
