<template>
  <div class="auth-container">
    <el-form :model="form" ref="form" label-width="120px">
      <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register">注册</el-button>
        <el-button @click="login">登录</el-button>
      </el-form-item>
    </el-form>
    <el-button @click="loginWithGoogle">使用 Google 登录</el-button>
  </div>
</template>

<script>
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database'; // 导入 Firebase 数据库

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
      },
    };
  },
  created() {
    this.checkUserLoggedIn(); // 检查用户登录状态
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.form.email, this.form.password);
        this.$router.push('/chat'); // 登录成功后跳转到聊天页面
      } catch (error) {
        console.error('登录失败:', error);
      }
    },
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.form.email, this.form.password);
        const user = userCredential.user;

        // 存储用户信息到 Firebase 数据库
        const db = getDatabase();
        const userRef = ref(db, 'users/' + user.uid);
        await set(userRef, {
          name: this.form.name,
          email: this.form.email,
          avatar: 'path/to/default/avatar.png', // 默认头像路径
        });

        this.$router.push('/chat'); // 注册成功后跳转到聊天页面
      } catch (error) {
        console.error('注册失败:', error);
      }
    },
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        this.$router.push('/chat'); // 登录成功后跳转到聊天页面
      } catch (error) {
        console.error('Google 登录失败:', error);
      }
    },
    checkUserLoggedIn() {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.$router.push('/chat'); // 如果已登录，直接跳转到聊天页面
        }
      });
    },
  },
};
</script>

<style scoped>
.auth-container {
  padding: 20px;
}
</style>
