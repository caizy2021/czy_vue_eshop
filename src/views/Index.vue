<template>
  <div class="about">
    <h1>我是Index.vue</h1>
    <div>
      账号：<el-input v-model="username" placeholder="请输入用户名"></el-input>
      <br /><br />
      密码：<el-input
        v-model="password"
        placeholder="请输入密码"
        show-password
      ></el-input>
      <hr />
      输入账号为：{{ username }}
      <br />
      输入密码为：{{ password }}
    </div>
    <hr>
    <el-button type="primary" @click="checkForm">登录</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    checkForm() {
      let username = this.username;
      let password = this.password;
      this.$axios.post('login',
      `username=${username}&password=${password}`)
      .then(res=>{
        console.log(res);
      })
    },
  },
};
</script>
<style scoped>
.el-input {
  width: 200px;
}
</style>
