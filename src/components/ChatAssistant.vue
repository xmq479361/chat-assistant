<template>
  <div class="chat-assistant">
    <div class="assistant-selector" v-if="userId">
      <AssistantSelector
        :userId="userId"
        @update-selected="handleSelectAssistant"
      />
    </div>
    <div class="chat-area">
      <div class="header">
        <div class="current-assistant">
          <div v-if="currentAssistant">
            当前助手: {{ currentAssistant.name }} -
            {{ currentAssistant.description }}
          </div>
        </div>
        <div class="user-info">
          <el-dropdown>
            <span
              class="el-dropdown-link"
              style="display: flex; flex-direction: column; align-items: center"
            >
              <el-avatar :size="30" :src="userAvatar" class="avatar" />
              <span style="font-size: 12px; margin-top: 5px">{{
                userName
              }}</span>
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
      <div class="input-area">
        <textarea
          v-model="userInput"
          :rows="3"
          placeholder="输入您的问题..."
          class="input-textarea"
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
import { Message } from "../models/models"; // 导入模型
import AssistantSelector from "./AssistantSelector.vue";
import MessageList from "./MessageList.vue";
import { auth } from "../utils/firebase"; // 导入 Firebase auth
import { loadChatHistory, saveChatHistory } from "../utils/database"; // 导入数据库操作

export default {
  components: { AssistantSelector, MessageList },
  data() {
    return {
      userInput: "",
      messages: [],
      isLoading: false,
      currentAssistant: null,
      userId: "",
      userName: "", // 用户名称
      userAvatar: "", // 默认用户头像路径
      showMenu: false, // 控制用户菜单的显示
    };
  },
  created() {
    this.checkUserLoggedIn(); // 检查用户登录状态
  },
  methods: {
    async checkUserLoggedIn() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.userId = user.uid;
          // 获取用户信息并设置
          this.userName =
            user.displayName || user.email.split("@")[0] || "未设置"; // 从 Firebase 获取用户名称
          this.userAvatar = user.photoURL || "/images/default_avatar.png"; // 从 Firebase 获取用户头像
          return;
        }
        this.$router.push("/"); // 如果未登录，重定向到登录页面
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
        await saveChatHistory(this.userId, this.currentAssistant.id, {
          id: userMessage.id,
          request: userMessage.content,
          answer: assistantMessage.content,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        this.isLoading = false;
        this.userInput = ""; // 清空输入框
      }
    },
    handleSelectAssistant(currentAssistant) {
      this.currentAssistant = currentAssistant;
      this.messages = [];
      this.loadChatHistory(currentAssistant.id); // 加载助手的对话记录
    },
    async loadChatHistory(assistantId) {
      const chatHistories = await loadChatHistory(this.userId, assistantId); // 从 Firebase 加载对话记录
      chatHistories.forEach((message) => {
        this.messages.push(new Message(message.id, message.request, "user"));
        this.messages.push(
          new Message(message.id, message.answer, "assistant")
        );
      });
    },
    logout() {
      auth.signOut().then(() => {
        this.$router.push("/"); // 退出登录后重定向到登录页面
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
.input-area {
  display: flex;
  align-items: flex-start;
  background-color: #2c3e50;
  padding: 10px;
  border-radius: 4px;
}
.input-textarea {
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
