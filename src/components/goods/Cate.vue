<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="success" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 分类列表表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="medium" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="small"
            v-else-if="scope.row.cat_level == 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button size="medium" type="danger" icon="el-icon-delete"
          @click="deleteCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 内容主体区域 -->
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <!-- 分类名称 -->
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            style="width: 100%"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editlogVisible" width="50%">
      <!-- 对话框主体区域 -->
      <!-- 编辑分类的表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <!-- 分类名称 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editlogVisible = false">取 消</el-button>
        <el-button type="success" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      // 商品分类的数据列表，默认为空
      cateList: [],

      // 总数据条数
      total: 0,

      // 为 table 指定列的定义
      columns: [
        {
          //标题
          label: "分类名称",
          //数据属性
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示 当前列定义为模板列
          type: "template",
          // 表示 当前这一列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示 当前列定义为模板列
          type: "template",
          // 表示 当前这一列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示 当前列定义为模板列
          type: "template",
          // 表示 当前这一列使用的模板名称
          template: "opt",
        },
      ],

      // 控制添加分类的对话框的显示和隐藏
      addCateDialogVisible: false,

      // 添加分类的表单对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认添加1级分类
        cat_level: 0,
      },

      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类的名称",
            trigger: "blur",
          },
        ],
      },

      // 父级分类的数据列表
      parentCateList: [],

      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },

      // 选中的父级分类的id数组
      selectedKeys: [],

      // 控制编辑分类对话框的显示或隐藏
      editlogVisible: false,

      // 查询到的分类信息的对象
      editForm: {},

      // 编辑分类表单的验证规则的对象
      editFormRules: {
        // 分类名称验证规则
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    // 获取商品分类数据
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      // 向后端发送请求
      const { data: res } = await this.$axios.get(`categories`, {
        params: this.queryInfo,
      });
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error(`获取商品分类数据失败！`);
      }
      // 成功
      this.$message.success(`获取商品分类数据成功！`);
      // console.log(res);
      this.cateList = res.data.result;
      this.total = res.data.total;
      // console.log(this.cateList);
      // console.log(this.total);
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getCateList();
    },

    // 监听 pagenum 改变的事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getCateList();
    },

    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList();
      // 再展示对话框
      this.addCateDialogVisible = true;
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      // 向后端发送请求
      const { data: res } = await this.$axios.get("categories", {
        params: { type: 2 },
      });
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }

      // console.log(res.data);
      this.parentCateList = res.data;
    },

    // 选择项发生变化时触发的函数
    parentCateChange() {
      // console.log(this.selectedKeys);
      // 判断：
      // 如果数组中的length大于0，则证明选中了父级分类；否则，证明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0;
        // 为分类等级赋值
        this.addCateForm.cat_level = 0;
      }
    },

    // 点击确定按钮，添加新的分类
    addCate() {
      // console.log(this.addCateForm);
      // 预验证
      this.$refs.addCateFormRef.validate(async (valid) => {
        // 如果不存在验证结果，则return
        if (!valid) return;
        // 向后端发送请求
        const { data: res } = await this.$axios.post(
          "categories",
          this.addCateForm
        );
        // 判断请求是否成功
        if (res.meta.status !== 201) {
          // 失败
          return this.$message.error("添加分类失败！");
        }
        // 成功
        this.$message.success("添加分类成功！");
        // 刷新列表
        this.getCateList();
        // 隐藏对话框
        this.addCateDialogVisible = false;
      });
    },

    // 监听对话框关闭的事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },

    // 展示编辑分类的对话框
    async showEditDialog(id) {
      // 向后端发送get请求 查询分类信息
      // console.log(id);
      const { data: res } = await this.$axios.get("categories/" + id);
      // console.log(res);
      // 判断请求成功与否
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("查询分类信息失败！");
      }
      // 成功
      this.$message.success("查询分类信息成功！");
      // 存储查询到的用户信息
      this.editForm = res.data;
      // console.log(this.editForm);
      // 打开对话框
      this.editlogVisible = true;
    },

    // 点击确定按钮，编辑选中的分类
    editCateInfo() {
      // console.log(this.editForm);
      // 预校验
      this.$refs.editFormRef.validate(async (valid) => {
        // 失败则return
        if (!valid) return;
        // 成功则向后端发起编辑分类信息的请求
        const { data: res } = await this.$axios.put(
          "categories/" + this.editForm.cat_id,
          { cat_name: this.editForm.cat_name }
        );
        // 判断是否成功
        if (res.meta.status !== 200) {
          return this.$message.error("编辑分类信息失败！");
        }
        // 关闭对话框
        this.editlogVisible = false;
        // 刷新数据列表
        this.getCateList();
        // 提示修改成功
        this.$message.success("编辑分类信息成功！");
        // console.log(res);
      });
    },

    // 根据ID删除对应分类数据
    async deleteCateById(id){
      // console.log(id);
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      const { data: res } = await this.$axios.delete('categories/' + id)
      // 判断 如果失败
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败！");
      }
      // 如果成功
      this.$message.success("删除分类成功！");
      // 刷新列表
      this.getCateList();
    }
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
