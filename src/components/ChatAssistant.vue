<template>
  <div class="chat-assistant">
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
      <div class="header">
        <div class="current-assistant" v-if="currentAssistant">
          当前助手: {{ currentAssistant.name }} -
          {{ currentAssistant.description }}
        </div>
        <div class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="userAvatar" alt="User Avatar" class="avatar" />
              <span>{{ userName }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
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
          icon="ChatRound"
          >发送
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
import { auth } from "../utils/firebase"; // 导入 Firebase auth

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
      userName: "用户名称", // 用户名称
      userAvatar: "path/to/default/avatar.png", // 默认用户头像路径
      showMenu: false, // 控制用户菜单的显示
    };
  },
  created() {
    this.checkUserLoggedIn(); // 检查用户登录状态
    this.currentAssistant = this.assistants[0];
  },
  methods: {
    checkUserLoggedIn() {
      auth.onAuthStateChanged((user) => {
        if (!user) {
          this.$router.push("/auth"); // 如果未登录，重定向到登录页面
        } else {
          // 获取用户信息并设置
          this.userName = user.name || "用户名称"; // 从 Firebase 获取用户名称
          this.userAvatar = user.avatar || "path/to/default/avatar.png"; // 从 Firebase 获取用户头像
        }
      });
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
    onUpdateAssistants(assistants) {
      console.log("onUpdateAssistants", assistants);
      this.assistants = assistants;
    },
    logout() {
      auth.signOut().then(() => {
        this.$router.push("/auth"); // 退出登录后重定向到登录页面
      });
    },
  },
};
</script>

<style scoped>
.chat-assistant {
  display: flex;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
  height: 100vh;
  display: flex;
}
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.user-info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
