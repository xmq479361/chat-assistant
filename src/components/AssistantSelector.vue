<template>
  <div :class="['assistant-selector', { collapsed: isCollapsed }]">
    <div v-if="!isCollapsed" class="icon-collapsed">
      <div v-if="isMobile">
        <AssistantSelectorContent
          :assistants="assistants"
          @update-add="addAssistant"
          @update-selected="selectAssistant"
          @update-edit="editAssistant"
          @update-collapse="toggleCollapse"
        />
      </div>
      <AssistantSelectorContent
        v-else
        :assistants="assistants"
        @update-add="addAssistant"
        @update-selected="selectAssistant"
        @update-edit="editAssistant"
        @update-collapse="toggleCollapse"
      />
    </div>
    <div v-else>
      <div class="icon-collapsed">
        <el-icon @click="toggleCollapse" size="20px">
          <Expand />
        </el-icon>
      </div>
      <div style="margin: 10px 0px">
        <el-icon @click="addAssistant" size="20px" class="icon-collapsed">
          <Plus />
        </el-icon>
      </div>
      <el-divider style="margin: 0px" />
      <div class="assistant-list">
        <div
          v-for="assistant in assistants"
          :key="assistant.id"
          class="assistant-item"
          :class="{ selected: assistant.selected }"
          @click="selectAssistant(assistant)"
        >
          <span>{{ assistant.name.charAt(0) }}</span>
        </div>
      </div>
    </div>
    <el-dialog v-model="isDeleteDialogVisible" title="确认删除">
      <span>您确定要删除助手 {{ assistantToDelete?.name }} 吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDeleteDialogVisible = false">取消</el-button>
          <el-button :loading="commiting" type="danger" @click="deleteAssistant"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="isEditDialogVisible" :title="editDialogTitle">
      <el-form :model="localAssistant" ref="form">
        <el-form-item
          label="助手名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入助手名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="localAssistant.name"
            placeholder="请输入助手名称"
          />
        </el-form-item>
        <el-form-item label="助手描述" prop="description">
          <el-input
            v-model="localAssistant.description"
            placeholder="请输入助手描述"
          />
        </el-form-item>
        <el-form-item label="默认提示词" prop="defaultPrompt">
          <el-input
            v-model="localAssistant.defaultPrompt"
            placeholder="请输入默认提示词"
          />
        </el-form-item>
        <el-form-item label="单轮最大消息数" prop="maxMessages">
          <el-input-number v-model="localAssistant.maxMessages" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isEditDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSaveAssistant"
            :loading="commiting"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Assistant } from "@/models/models";
import {
  loadAssistants,
  createDefaultAssistant,
  saveAssistant,
  deleteAssistant,
} from "../utils/database"; // 导入数据库操作
import AssistantSelectorContent from "./AssistantSelectorContent.vue";

export default {
  components: { AssistantSelectorContent },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      assistants: [],
      isCollapsed: false, // 控制助手面板的收缩状态
      isEditDialogVisible: false, // 控制编辑对话框的显示状态
      isDeleteDialogVisible: false, // 控制删除对话框的显示状态
      assistantToDelete: null, // 当前选中的助手
      localAssistant: null, // 当前编辑的助手
      editDialogTitle: "编辑助手", // 编辑对话框的标题
      currentAssistant: null, // 当前选中的助手
      commiting: false, // 是否正在提交
      isMobile: false,
    };
  },
  mounted() {
    this.loadAssistants();
    this.checkDevice();
  },
  methods: {
    checkDevice() {
      const userAgent = navigator.userAgent;
      this.isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    },
    async loadAssistants() {
      this.assistants = await loadAssistants(this.userId); // 从 Firebase 加载助手信息
      if (this.assistants.length === 0) {
        this.createDefaultAssistant(); // 如果没有助手，创建默认助手
      } else {
        this.selectAssistant(
          this.assistants.find((assistant) => assistant.selected) ||
            this.assistants[0]
        );
      }
    },
    async createDefaultAssistant() {
      console.log("createDefaultAssistant", this.userId);
      const defaultAssistant = await createDefaultAssistant(this.userId); // 创建默认助手
      this.assistants.push(defaultAssistant); // 添加默认助手到助手列表
      this.selectAssistant(defaultAssistant);
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed; // 切换收缩状态
    },
    addAssistant() {
      this.localAssistant = new Assistant(
        this.userId + "_" + Date.now().toString(),
        "",
        "",
        "",
        10
      ); // 创建一个新的助手实例
      this.editDialogTitle = "新增助手"; // 编辑对话框的标题
      this.isEditDialogVisible = true; // 显示编辑对话框
    },
    selectAssistant(assistant) {
      if (
        null != this.currentAssistant &&
        this.currentAssistant.id === assistant.id
      ) {
        return;
      }
      this.currentAssistant = assistant;
      this.$emit("update-selected", assistant); // 使用 v-model 语法
    },
    editAssistant(assistant) {
      this.localAssistant = { ...assistant }; // 创建助手的本地副本
      this.editDialogTitle = "编辑助手"; // 编辑对话框的标题
      this.isEditDialogVisible = true; // 显示编辑对话框
    },
    confirmDelete(assistant) {
      this.assistantToDelete = assistant;
      this.isDeleteDialogVisible = true;
    },
    async handleDeleteAssistant() {
      this.commiting = true;
      deleteAssistant(this.userId, this.assistantToDelete);
      this.assistants = this.assistants.filter(
        (assistant) => assistant.id !== this.assistantToDelete.id
      );
      this.assistantToDelete = null;
      this.commiting = false;
      this.isDeleteDialogVisible = false;
    },
    async handleSaveAssistant() {
      this.commiting = true;
      const index = this.assistants.findIndex(
        (assistant) => assistant.id === this.localAssistant.id
      );
      saveAssistant(this.userId, this.localAssistant);
      if (index !== -1) {
        this.assistants.splice(index, 1, this.localAssistant); // 更新助手
      } else {
        this.assistants.push(this.localAssistant); // 新增助手
      }
      this.isEditDialogVisible = false; // 关闭编辑对话框
      this.commiting = false;
    },
  },
};
</script>

<style scoped>
.assistant-selector {
  width: 30vw; /* 展开时的宽度 */
  background-color: #2c3e50;
  color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: width 0.3s; /* 添加过渡效果 */
  min-width: 200px;
  max-width: 400px;
}
.assistant-selector.collapsed {
  min-width: 50px;
  max-width: 50px;
}
.icon-collapsed {
  padding: 8px 0;
}
.assistant-list {
  overflow-y: auto;
  flex: 1;
  height: 100%;
}
.assistant-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  margin: 10px 0;
  border-bottom: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;
}
.assistant-item:hover {
  background-color: #3a3a3a;
}
.assistant-item.selected {
  background-color: #4a4a4a; /* 选中效果 */
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
