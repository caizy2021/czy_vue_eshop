<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索和添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 查询用户输入框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <!-- 查询用户按钮 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户按钮 -->
          <el-button type="success" @click="addlogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <!-- slot-scope接收数据 -->
          <template slot-scope="scope">
            <!-- scope.row拿到对应这一行的数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#67C23A"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="187px">
          <template slot-scope="scope">
            <el-button-group>
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="medium"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="medium"
                @click="deleteUserById(scope.row.id)"
              ></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="medium"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addlogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <!-- 用户名称 -->
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addlogVisible = false">取 消</el-button>
        <el-button type="success" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editlogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 对话框主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <!-- 用户名称 -->
        <el-form-item label="用户名称">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editlogVisible = false">取 消</el-button>
        <el-button type="success" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <!-- 内容主体区域 -->
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoledId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的校验规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+([\.a-zA-Z0-9_-])+/;

      // 验证
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }

      // 未通过
      callback(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的校验规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      // 验证
      if (regMobile.test(value)) {
        // 合法手机号
        return callback();
      }

      // 未通过
      callback(new Error("请输入合法的手机号"));
    };

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: "",

        // 当前的页数
        pagenum: 1,

        // 当前每页显示多少条数据
        pagesize: 2,
      },

      // 用户列表
      userlist: [],

      // 总数据条数
      total: 0,

      // 控制添加用户的对话框的显示或隐藏
      addlogVisible: false,

      // 添加用户的表单的数据对象
      addForm: {
        // 用户名称
        username: "",

        // 密码
        password: "",

        // 邮箱
        email: "",

        // 手机
        mobile: "",
      },

      // 添加用户的表单的验证规则对象
      addFormRules: {
        // 用户名称验证规则
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "用户名称长度在3~10个字符之间" },
        ],

        // 密码验证规则
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "密码称长度在6~15个字符之间" },
        ],

        // 邮箱验证规则
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],

        // 手机验证规则
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 控制修改用户对话框的显示或隐藏
      editlogVisible: false,

      // 查询到的用户信息的对象
      editForm: {},

      // 修改表单的验证规则的对象
      editFormRules: {
        // 邮箱验证规则
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],

        // 手机验证规则
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 控制分配角色的对话框的显示和隐藏
      setRoleDialogVisible: false,

      // 需要被分配角色的用户信息
      userInfo: {},

      // 所有角色的数据列表
      rolesList: [],

      // 已选择的角色id值
      selectedRoledId: "",
    };
  },

  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$axios.get("/users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 监听switch开关的状态变化
    async userStateChanged(userinfo) {
      const { data: res } = await this.$axios.put(
        `/users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        userinfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },

    // 监听添加用户对话框关闭的事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 点击确定按钮 添加用户
    addUser() {
      // 预校验表单
      this.$refs.addFormRef.validate(async (valid) => {
        // 不通过则return
        if (!valid) return;

        // 成功后向后端发起添加用户的请求
        const { data: res } = await this.$axios.post("users", this.addForm);

        // 判断添加的结果
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        // 成功
        this.$message.success("添加用户成功！");
        // 隐藏添加用户对话框
        this.addlogVisible = false;
        // 刷新页面 重新获取用户列表数据
        this.getUserList();
      });
    },

    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // 向后端发送get请求 查询用户信息
      const { data: res } = await this.$axios.get("users/" + id);

      // 判断
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }

      // 存储查询到的用户信息
      this.editForm = res.data;
      // console.log(this.editForm);
      // 打开对话框
      this.editlogVisible = true;
    },

    // 监听修改用户对话框关闭的事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 点击确定按钮 修改用户信息并提交
    editUserInfo() {
      // 预校验
      this.$refs.editFormRef.validate(async (valid) => {
        // 失败则return
        if (!valid) return;

        // 成功则向后端发起修改用户信息的请求
        const { data: res } = await this.$axios.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );

        // 判断成功与否
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败！");
        }

        // 关闭对话框
        this.editlogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success("更新用户信息成功！");
      });
    },

    // 根据ID删除对应用户数据
    async deleteUserById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel

      // 判断用户是否删除
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      // 如果用户确认删除，则向后端发送delete请求
      const { data: res } = await this.$axios.delete("users/" + id);
      // 判断 如果失败
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }
      // 如果成功
      this.$message.success("删除用户成功！");
      // 刷新列表
      this.getUserList();
    },

    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;

      // 在展示对话框前，获取所有角色的列表
      const { data: res } = await this.$axios.get("roles");
      // 判断
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("获取用户列表失败！");
      }
      // 成功
      this.$message.success("获取用户列表成功！");
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },

    // 点击按钮，分配角色
    async saveRoleInfo() {
      // 判断：用户有没有选择要分配的角色
      if (!this.selectedRoledId) {
        // 没有
        return this.$message.error("请选择要分配的角色！");
      }
      // 有
      // 向后端发送请求
      const { data: res } = await this.$axios.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedRoledId }
      );

      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error(`更新角色失败！`);
      }
      // 成功
      this.$message.success(`更新角色成功！`);
      // 刷新用户列表
      this.getUserList();
      // 关闭对话框
      this.setRoleDialogVisible = false;
    },

    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoledId = "";
      this.userInfo = {};
    },
  },

  // 页面挂载时
  mounted() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped></style>
