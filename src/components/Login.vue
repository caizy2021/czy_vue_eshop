<template>
  <div class="login_container">
    <div class="login_background">
      <!-- <img src="../../../public/img/gf.jpg" alt="" /> -->
      <!-- <img src="../../../assets/img/gf.jpg" alt="" /> -->
    </div>
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        class="login_form"
        :rules="loginFormRules"
        ref="loginFormRef"
        :model="form"
        label-width="80px"
      >
        <!-- 账号 -->
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="success" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      form: {
        username: "admin",
        password: "123456",
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证账号是否合法
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginFrom() {
      // 重置表单
      this.$refs.loginFormRef.resetFields();
    },

    // 点击登录按钮，发送登录请求，返回登录结果
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        await this.$axios.post("login", this.form).then((res) => {
          // 验证返回信息
          // 失败
          if (res.data.meta.status !== 200)
            return this.$message.error("登录失败");
          // 成功
          this.$message.success("登录成功");
          // 将token保存到客户端
          window.sessionStorage.setItem("token", res.data.data.token);
          // 跳转到主页index
          this.$router.push("/index");
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: green;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ddd;

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 8px;
    box-shadow: 0 0 30px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  text-align: end;
}

.login_background {
  background-size: contain;
  position: fixed;
  background-position: center;
  background-repeat: no-repeat;
  // left: 0;right: 0;top: 0;bottom: 0;
}
</style>
