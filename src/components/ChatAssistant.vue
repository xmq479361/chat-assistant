<template>
  <div class="chat-assistant">
    <AssistantSelector
      v-model:assistants="assistants"
      :userId="userId"
      :selectedAssistant="currentAssistant?.id"
      @update-selected="handleSelectAssistant"
      @update-assistants="onUpdateAssistants"
    />
    <div class="chat-area">
      <div class="header">
        <div class="current-assistant" v-if="currentAssistant">
          当前助手: {{ currentAssistant.name }} -
          {{ currentAssistant.description }}
        </div>
        <div class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="50" :src="userAvatar" class="avatar" />
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
import { Assistant, Message } from "../models/models"; // 导入模型
import AssistantSelector from "./AssistantSelector.vue";
import MessageList from "./MessageList.vue";
import { auth } from "../utils/firebase"; // 导入 Firebase auth
import { getDatabase, ref, set, get, child } from "firebase/database"; // 导入 Firebase 数据库

export default {
  components: { AssistantSelector, MessageList },
  data() {
    return {
      userInput: "",
      messages: [],
      isLoading: false,
      currentAssistant: null,
      assistants: [],
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
    checkUserLoggedIn() {
      auth.onAuthStateChanged((user) => {
        if (!user) {
          this.$router.push("/"); // 如果未登录，重定向到登录页面
        } else {
          this.userId = user.uid;
          // 获取用户信息并设置
          this.userName = user.displayName || "未设置"; // 从 Firebase 获取用户名称
          this.userAvatar =
            user.avatar ||
            "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"; // 从 Firebase 获取用户头像
          this.loadAssistants(); // 加载助手信息
        }
      });
    },
    async loadAssistants() {
      const db = getDatabase();
      const userRef = ref(db, "users/" + this.userId + "/assistants");

      try {
        const snapshot = await get(child(userRef, ""));
        if (snapshot.exists()) {
          this.assistants = snapshot.val(); // 加载助手信息
          if (this.assistants.length > 0) {
            this.currentAssistant =
              this.assistants.find(
                (assistant) => assistant.selected === true
              ) || this.assistants[0];
            return;
          }
        }
      } catch (error) {
        console.error("加载助手失败:", error);
      }
      this.createDefaultAssistant(); // 如果没有助手，创建默认助手
    },
    async createDefaultAssistant() {
      const defaultAssistant = new Assistant(
        `${this.userId}_default`,
        "默认助手",
        "这是默认助手的描述",
        "",
        10
      );
      this.assistants.push(defaultAssistant); // 添加默认助手到助手列表
      this.currentAssistant = defaultAssistant;
      const db = getDatabase();
      const userRef = ref(
        db,
        "users/" + this.userId + "/assistants/" + defaultAssistant.id
      );
      await set(userRef, defaultAssistant); // 将默认助手存储到 Firebase 数据库
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
    onUpdateAssistants(assistants) {
      console.log("onUpdateAssistants", assistants);
      this.assistants = assistants;
    },
    handleSelectAssistant(id) {
      this.currentAssistant = this.assistants.find(
        (assistant) => assistant.id === id
      );
      console.log(`当前选择的助手 ID: ${id}`);
      this.loadChatHistory(id); // 加载助手的对话记录
    },
    async loadChatHistory(assistantId) {
      const db = getDatabase();
      const userId = auth.currentUser.uid; // 获取当前用户的 UID
      const chatRef = ref(
        db,
        "users/" + userId + "/chatHistory/" + assistantId
      );

      try {
        const snapshot = await get(child(chatRef, ""));
        if (snapshot.exists()) {
          this.messages = snapshot.val(); // 加载对话记录
        } else {
          this.messages = []; // 如果没有记录，初始化为空
        }
      } catch (error) {
        console.error("加载对话记录失败: ", error);
      }
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
