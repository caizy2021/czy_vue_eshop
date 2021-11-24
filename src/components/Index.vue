<template>
  <el-container class="index-container">
    <!-- header区域 -->
    <el-header>
      <div>
        <img src="favicon.ico" alt="" />
        <span>Caizy电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i class="el-icon-s-operation"></i>
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#67C23A"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$router.path ? $router.path : '/welcome'"
        >
          <!-- 主菜单 -->
          <el-menu-item index="/welcome">
            <i class="el-icon-loading"></i>
            <span slot="title">主菜单</span>
          </el-menu-item>

          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span v-text="item.authName"></span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-copy-document"></i>
                <!-- 文本 -->
                <span v-text="subItem.authName"></span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 左侧菜单图标
      iconObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },
      // 是否折叠
      isCollapse: false,
    };
  },
  methods: {
    logout() {
      // 清除token
      window.sessionStorage.clear();
      // 跳转到登录页
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList() {
      // 请求返回promise对象
      // 用async/await优化，结构出data到res中
      const { data: res } = await this.$axios.get("menus");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      // console.log(this.menulist);
    },
    // 点击按钮，企鹅话
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath)
    },
  },
  mounted() {
    this.getMenuList();
  },
};
</script>

<style lang="less" scoped>
.index-container {
  height: 100%;
}
.el-header {
  background-color: #222;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding-left: 0;
  color: #fff;
  font-weight: bold;
  font-size: 25px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #545c64;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eee;
}
.toggle-button {
  background-color: #67C23A;
  font-size: 30px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
}
</style>
