<template>
  <div class="header">
    <span>对话助手列表</span>
    <el-icon @click="toggleCollapse" size="20px">
      <Fold />
    </el-icon>
  </div>
  <div style="margin: 10px 0px">
    <div @click="addAssistant">
      <el-icon><Plus /></el-icon>
      新增助手
    </div>
  </div>
  <div class="assistant-list">
    <!-- <el-button v-else @click="addAssistant" size="20px" icon="Plus" /> -->
    <!-- <el-divider style="margin: 10px 10px 10px 0; color: red" /> -->
    <div
      v-for="assistant in assistants"
      :key="assistant.id"
      @click="selectAssistant(assistant)"
    >
      <div class="assistant-item" :class="{ selected: assistant.selected }">
        <span>{{ assistant.name }}</span>
        <div class="actions">
          <el-icon @click.stop="editAssistant(assistant)" size="20px">
            <Edit />
          </el-icon>
          <el-icon
            @click.stop="confirmDelete(assistant)"
            size="20px"
            color="red"
          >
            <Delete />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    assistants: {
      type: Array,
      required: true,
    },
  },
  methods: {
    addAssistant() {
      this.$emit("update-add"); // 使用 v-model 语法
    },
    selectAssistant(assistant) {
      this.$emit("update-selected", assistant); // 使用 v-model 语法
    },
    editAssistant(assistant) {
      this.$emit("update-edit", assistant); // 使用 v-model 语法
    },
    toggleCollapse() {
      this.$emit("update-collapse", true); // 切换收缩状态
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
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
.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
