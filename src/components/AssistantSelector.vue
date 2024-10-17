<template>
  <div
    class="assistant-selector"
    style="
      width: 30vw;
      background-color: #2c3e50;
      color: white;
      border-radius: 8px;
      padding: 10px;
    "
  >
    <div class="header">
      <el-button type="primary" icon="el-icon-plus" @click="addAssistant"
        >新增助手</el-button
      >
    </div>
    <div class="assistant-list">
      <div
        v-for="assistant in assistants"
        :key="assistant.id"
        class="assistant-item"
        :class="{ selected: selectedAssistant === assistant.id }"
        @click="selectAssistant(assistant.id)"
      >
        <span>{{ assistant.name }}</span>
        <div class="actions">
          <el-button icon="el-icon-edit" @click.stop="editAssistant(assistant)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click.stop="confirmDelete(assistant)"
            >删除</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog :visible="isDeleteDialogVisible" title="确认删除">
      <span>您确定要删除助手 {{ assistantToDelete?.name }} 吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDeleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteAssistant">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
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
    };
  },
  methods: {
    addAssistant() {
      this.$emit("add-assistant");
    },
    selectAssistant(id) {
      console.log("selectedAssistant", id);
      this.$emit("update:selectedAssistant", id); // 使用 v-model 语法
    },
    editAssistant(assistant) {
      this.$emit("edit-assistant", assistant);
    },
    confirmDelete(assistant) {
      this.assistantToDelete = assistant;
      this.isDeleteDialogVisible = true;
    },
    deleteAssistant() {
      this.$emit("delete-assistant", this.assistantToDelete.id); // 通过事件通知父组件
      this.isDeleteDialogVisible = false;
      this.assistantToDelete = null;
    },
  },
};
</script>

<style scoped>
.assistant-selector {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.assistant-list {
  max-height: 200px;
  overflow-y: auto;
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
</style>
