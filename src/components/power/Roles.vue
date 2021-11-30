<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="success" @click="addlogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 栅格系统 -->
            <!-- 使用for循环，嵌套渲染一级权限 -->
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限菜单 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="deleteRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限菜单 -->
              <el-col :span="19">
                <!-- 使用for循环，嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限菜单 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限菜单 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="deleteRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="336px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              size="medium"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="medium"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="medium"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
        :rules="editFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>

        <!-- 角色描述 -->
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addlogVisible = false">取 消</el-button>
        <el-button type="success" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editlogVisible" width="50%">
      <!-- 对话框主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>

        <!-- 角色描述 -->
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editlogVisible = false">取 消</el-button>
        <el-button type="success" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表的数据
      rolesList: [],
      // 控制分配权限对话框的显示或隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的ID值的数组
      defKeys: [],
      // 即将分配权限的角色id
      roleId: "",

      // 控制修改用户对话框的显示或隐藏
      editlogVisible: false,

      // 查询到的用户信息的对象
      editForm: {},

      // 修改表单的验证规则的对象
      editFormRules: {
        // 邮箱验证规则
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },

      // 控制添加角色的对话框的显示或隐藏
      addlogVisible: false,

      // 添加角色的表单的数据对象
      addForm: {
        // 角色名称
        roleName: "",

        // 角色描述
        roleDesc: "",
      },
    };
  },
  mounted() {
    // 获取所有角色的列表方法
    this.getRolesList();
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      // 向后端发送请求
      const { data: res } = await this.$axios.get("roles");
      // 判断返回值
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("获取角色列表失败！");
      }
      // 获取到的列表数据保存到rolesList
      this.rolesList = res.data;
      // 成功
      this.$message.success("获取角色列表成功！");
      // console.log(this.rolesList);
    },

    // 根据id删除对应权限
    async deleteRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 判断用户是否要删除
      if (confirmResult !== "confirm") {
        // 取消
        return this.$message.info("取消了删除！");
      }
      // 确认
      // console.log('确认了删除');
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      // 判断返回值
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("删除权限失败！");
      }
      // 成功
      this.$message.success("删除权限成功！");
      // 页面上更新数据
      // this.getRolesList();
      role.children = res.data;
    },

    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$axios.get("rights/tree");
      // 判断返回值
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("获取权限数据失败！");
      }
      // 成功
      this.$message.success("获取权限数据成功！");
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data;
      // console.log(this.rightsList);

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys);

      // 显示控制分配权限对话框
      this.setRightDialogVisible = true;
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 判断：如果当前 node 节点，不包含children属性，则是三级节点
      if (!node.children) {
        // 返回值：节点id入栈arr数组
        return arr.push(node.id);
      }
      // 如果当前 node 节点，包含children属性，则递归
      node.children.forEach((node) => {
        this.getLeafKeys(node, arr);
      });
    },

    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },

    // 点击为角色分配权限
    async allotRights() {
      // 角色权限 Keys 数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // console.log(keys);

      // 转化为字符串，用逗号拼接
      const idStr = keys.join(",");

      // 向后端发送请求
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );

      // 判断返回值
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("分配权限失败！");
      }
      // 成功
      this.$message.success("分配权限成功！");
      // 刷新列表
      this.getRolesList();
      // 隐藏对话框
      this.setRightDialogVisible = false;
    },

    // 展示编辑角色的对话框
    async showEditDialog(id) {
      // console.log(id);
      // 向后端发送get请求 查询角色信息
      const { data: res } = await this.$axios.get("roles/" + id);
      // console.log(res);

      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("查询角色信息失败！");
      }
      // 成功
      this.$message.success("查询角色信息成功！");
      // 存储查询到的角色信息
      this.editForm = res.data;
      // console.log(this.editForm);

      // 打开对话框
      this.editlogVisible = true;
    },

    // 点击确定按钮 编辑角色信息并提交
    editRoleInfo() {
      // 预校验
      this.$refs.editFormRef.validate(async (valid) => {
        // 失败则return
        if (!valid) return;
        // 成功则向后端发起编辑角色信息的请求
        const { data: res } = await this.$axios.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        // console.log(res);
        // 判断成功与否
        if (res.meta.status !== 200) {
          return this.$message.error("编辑角色信息失败！");
        }
        // 关闭对话框
        this.editlogVisible = false;
        // 刷新数据列表
        this.getRolesList();
        // 提示修改成功
        this.$message.success("编辑角色信息成功！");
      });
    },

    // 根据ID删除对应用户数据
    async deleteUserById(id) {
      // console.log(id);
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      // console.log(confirmResult);

      // 判断用户是否删除
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      // 如果用户确认删除，则向后端发送delete请求
      const { data: res } = await this.$axios.delete("roles/" + id);
      // 判断 如果失败
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败！");
      }
      // 如果成功
      this.$message.success("删除角色成功！");
      // 刷新列表
      this.getRolesList();
    },

    // 监听添加用户对话框关闭的事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.addForm.roleDesc = "";
    },

    // 点击确定按钮 添加角色
    addRole() {
      // console.log(this.addForm);
      // 预校验表单
      this.$refs.addFormRef.validate(async valid =>{
        // 不通过则return
        if (!valid) return;
        // 成功后向后端发起添加角色的请求
        const { data: res } = await this.$axios.post("roles", this.addForm);
        // 判断添加的结果
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败！");
        }
        // 成功
        this.$message.success("添加用户成功！");
        // 隐藏添加用户对话框
        this.addlogVisible = false;
        // 刷新页面 重新获取用户列表数据
        this.getRolesList();
      })
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
