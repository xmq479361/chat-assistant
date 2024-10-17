<template>
  <div
    class="assistant-selector"
    style="
      width: 30vw;
      background-color: #2c3e50;
      color: white;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      height: 100%;
    "
  >
    <div class="header">
      对话助手列表
      <el-icon @click="addAssistant" size="20px">
        <Plus />
      </el-icon>
    </div>
    <div class="assistant-list">
      <div
        v-for="assistant in localAssistants"
        :key="assistant.id"
        class="assistant-item"
        :class="{ selected: selectedAssistant === assistant.id }"
        @click="selectAssistant(assistant.id)"
      >
        <span>{{ assistant.name }}</span>
        <div class="actions">
          <el-button
            icon="Edit"
            type="primary"
            @click.stop="editAssistant(assistant)"
          />
          <el-button
            type="danger"
            icon="Delete"
            @click.stop="confirmDelete(assistant)"
          />
        </div>
      </div>
    </div>
    <el-dialog v-model="isDeleteDialogVisible" title="确认删除">
      <span>您确定要删除助手 {{ assistantToDelete?.name }} 吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDeleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteAssistant">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="isEditDialogVisible" title="编辑助手">
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
          <el-button type="primary" @click="saveAssistant">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Assistant } from "@/models/models";

export default {
  props: {
    selectedAssistant: {
      type: String,
      default: null,
    },
    assistants: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteDialogVisible: false,
      assistantToDelete: null,
      isEditDialogVisible: false,
      localAssistants: [...this.assistants],
      localAssistant: null, // 用于编辑助手的本地副本
    };
  },
  methods: {
    addAssistant() {
      this.localAssistant = new Assistant(
        Date.now().toString(),
        "",
        "",
        "",
        10
      ); // 创建一个新的助手实例
      this.isEditDialogVisible = true; // 显示编辑对话框
    },
    selectAssistant(id) {
      this.$emit("update-selected", id); // 使用 v-model 语法
    },
    editAssistant(assistant) {
      this.localAssistant = { ...assistant }; // 创建助手的本地副本
      this.isEditDialogVisible = true; // 显示编辑对话框
    },
    confirmDelete(assistant) {
      this.assistantToDelete = assistant;
      this.isDeleteDialogVisible = true;
    },
    deleteAssistant() {
      this.isDeleteDialogVisible = false;
      this.localAssistants = this.localAssistants.filter(
        (assistant) => assistant.id !== this.assistantToDelete.id
      );
      this.assistantToDelete = null;
      this.$emit("update-assistants", this.localAssistants); // 通知父组件更新助手列表
    },
    saveAssistant() {
      const index = this.assistants.findIndex(
        (assistant) => assistant.id === this.localAssistant.id
      );
      if (index !== -1) {
        this.localAssistants.splice(index, 1, this.localAssistant); // 更新助手
      } else {
        this.localAssistants.push(this.localAssistant); // 新增助手
      }
      this.isEditDialogVisible = false; // 关闭编辑对话框
      this.$emit("update-assistants", this.localAssistants); // 通知父组件更新助手列表
    },
  },
};
</script>

<style scoped>
.assistant-selector {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 16px;
  font-size: 16px;
}
.assistant-list {
  overflow-y: auto;
  flex: 1;
  height: 100%;
}
.assistant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #444;
  cursor: pointer;
}
.assistant-item:hover {
  background-color: #3a3a3a;
}
.assistant-item.selected {
  background-color: #4a4a4a; /* 选中效果 */
}
.actions {
  display: flex;
  gap: 5px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
