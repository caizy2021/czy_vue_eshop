<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="success"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 参数名称列 -->
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button
            type="success"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 参数名称列 -->
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框内容区域 -->
      <!-- 添加表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 对话框内容区域 -->
      <!-- 添加表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 数据
  data() {
    return {
      // 商品分类列表
      cateList: [],

      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      // 级联选择框的双向绑定数组
      selectedCateKeys: [],

      // 被选中的页签的名称
      activeName: "many",

      // 动态参数的数据列表
      manyTableData: [],

      // 静态属性的数据列表
      onlyTableData: [],

      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,

      // 添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },

      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },

      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,

      // 编辑的表单数据对象
      editForm: {},

      // 编辑表单的验证规则对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  // 挂载时
  mounted() {
    // 获取所有的商品分类列表
    this.getCateList();
  },
  // 方法
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      // 向后端发送请求
      const { data: res } = await this.$axios.get("categories");
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("获取商品分类失败！");
      }
      // 成功
      this.cateList = res.data;
      // console.log(this.cateList);
    },

    // 级联选择框的选中项变化时，触发这个函数
    handleChange() {
      this.getParamsData();
    },

    // tab页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },

    // 获取参数列表数据的方法
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        // 否
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 证明选中的是三级分类
      // console.log(this.selectedCateKeys);
      // 根据所选分类的id，和所处的面板，获取对应的参数
      // 向后端发送请求
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("获取参数列表失败！");
      }
      // 成功
      // 循环每一项，用空格分隔 attr_vals
      res.data.forEach((element) => {
        element.attr_vals = element.attr_vals
          ? element.attr_vals.split(" ")
          : [];
        this.$set(element, "inputVisible", false);
        this.$set(element, "inputValue", "");
      });
      // 打印返回结果
      console.log(res.data);
      // 判断数据是动态参数还是静态属性
      if (this.activeName == "many") {
        // 动态参数
        this.manyTableData = res.data;
      } else {
        // 静态属性
        this.onlyTableData = res.data;
      }
    },

    // 监听添加对话框关闭的事件
    addDialogClosed() {
      // 重置表单内容
      this.$refs.addFormRef.resetFields();
    },

    // 点击按钮，添加参数
    addParams() {
      // 预验证
      this.$refs.addFormRef.validate(async (valid) => {
        // 不通过
        if (!valid) return;
        // 通过
        // 向后端发送请求
        const { data: res } = await this.$axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        // 判断请求是否成功
        if (res.meta.status !== 201) {
          // 失败
          return this.$message.error("添加参数失败！");
        }
        // 成功
        this.$message.success("添加参数成功！");
        // 关闭对话框
        this.addDialogVisible = false;
        // 重新获取参数列表数据，刷新数据列表
        this.getParamsData();
      });
    },

    // 点击按钮，显示编辑对话框
    async showEditDialog(attr_id) {
      // 向后端发送请求
      // 查询当前参数的信息
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_id: this.activeName },
        }
      );
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        return this.$message.error("获取当前参数失败！");
      }
      this.editForm = res.data;
      // 显示编辑对话框
      this.editDialogVisible = true;
    },

    // 监听编辑对话框关闭的事件
    editDialogClosed() {
      // 重置编辑的表单
      this.$refs.editFormRef.resetFields();
    },

    // 点击按钮，编辑参数信息
    editParams() {
      // 预校验
      this.$refs.editFormRef.validate(async (valid) => {
        // 失败
        if (!valid) return;
        // 成功
        // 向后端发送请求
        const { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        // 判断请求是否成功
        if (res.meta.status !== 200) {
          // 失败
          return this.$message.error("编辑参数失败！");
        }
        // 成功
        this.$message.success("编辑参数成功！");
        // 隐藏对话框
        this.editDialogVisible = false;
        // 重新获取参数列表数据
        this.getParamsData();
      });
    },

    // 点击按钮，删除参数信息，根据id对应
    async deleteParams(attr_id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 用户取消了删除的操作
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }

      // 删除的业务逻辑
      // 向后端发送请求
      const { data: res } = await this.$axios.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("删除参数失败！");
      }
      // 成功
      this.$message.success("删除参数成功！");
      // 重新获取参数列表数据
      this.getParamsData();
    },

    // 文本框失去焦点或按enter时，触发的方法
    async handleInputConfirm(row) {
      // console.log("ok");
      // 判断文本框内容
      // trim()去除字符串两端的空格
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果没有return，则证明输入了内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 向后端发送请求，保存这次操作
      this.saveAttrVals(row);
    },

    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row) {
      // 向后端发送请求，保存这次操作
      const { data: res } = await this.$axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("修改参数项失败！");
      }
      // 成功
      this.$message.success("修改参数项成功！");
    },

    // 点击按钮，显示文本输入框
    showInput(row) {
      // 显示文本框
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // nextTick 方法的作用：当页面元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        // 第一个ref拿到el-input，第二个ref从el-input身上拿到原生DOM节点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 点击×，删除对应的参数项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
  },
  // 计算属性
  computed: {
    // 如果按钮要被禁用，则返回true；否则，返回false
    isBtnDisabled() {
      // 禁用按钮
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      // 启用按钮
      return false;
    },

    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },

    // 动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>
