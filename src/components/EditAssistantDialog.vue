<template>
  <el-dialog :visible="visible" title="编辑助手">
    <el-form :model="localAssistant" ref="form">
      <el-form-item
        label="助手名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入助手名称', trigger: 'blur' },
        ]"
      >
        <el-input v-model="localAssistant.name" />
      </el-form-item>
      <el-form-item label="助手描述" prop="description">
        <el-input v-model="localAssistant.description" />
      </el-form-item>
      <el-form-item label="默认提示词" prop="defaultPrompt">
        <el-input v-model="localAssistant.defaultPrompt" />
      </el-form-item>
      <el-form-item label="单轮最大消息数" prop="maxMessages">
        <el-input-number v-model="localAssistant.maxMessages" :min="1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    assistant: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localAssistant: { ...this.assistant }, // 创建一个本地副本
    };
  },
  methods: {
    save() {
      this.$emit("save", { ...this.localAssistant }); // 通过事件通知父组件
      this.$emit("update:visible", false); // 使用 v-model 语法
    },
    cancel() {
      this.$emit("update:visible", false); // 使用 v-model 语法
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
