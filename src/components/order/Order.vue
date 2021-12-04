<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容">
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === 1"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              circle
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址的对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressDialogVisible"
        width="50%"
        @close="addressDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <!-- 省市区/县的输入框 -->
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cityData"
              v-model="addressForm.address1"
            ></el-cascader>
          </el-form-item>
          <!-- 详细地址的输入框 -->
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 展示物流进度的对话框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="50%"
      >
        <!-- 内容主体区域 -->
        <!-- timeline时间线组件 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from "./citydata.js";

export default {
  // 页面数据
  data() {
    return {
      // 查询订单数据列表的对象
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },

      // 订单数据列表的总数
      total: 0,

      // 订单数据列表的数据
      orderList: [],

      // 控制修改地址的对话框的显示与隐藏
      addressDialogVisible: false,

      // 修改地址表单的数据对象
      addressForm: {
        address1: [],
        address2: "",
      },

      // 修改地址表单的验证规则
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },

      // 省市区/县选择框内容的数据（外部引入）
      cityData,

      // 控制物流进度的对话框的显示与隐藏
      progressDialogVisible: false,

      // 物流进度数据的数组
      progressInfo: [],
    };
  },

  // 页面挂载时
  mounted() {
    // 获取订单数据列表
    this.getOrderList();
  },

  // 页面方法
  methods: {
    // 获取订单数据列表的方法
    async getOrderList() {
      // 向后端发送请求
      const { data: res } = await this.$axios.get(`orders`, {
        params: this.queryInfo,
      });
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error(`获取订单列表失败！`);
      }
      // 成功
      console.log(res);
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },

    // pagesize每页显示条数发生变化的方法
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },

    // pagenum当前页码发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },

    // 点击按钮，显示修改地址的对话框
    showBox() {
      this.addressDialogVisible = true;
    },

    // 监听修改地址的对话框关闭的时间
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },

    // 点击按钮，显示物流进度的对话框
    async showProgressBox() {
      // 向后端发送请求
      const { data: res } = await this.$axios.get(`/kuaidi/1106975712662`);
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        return this.$message.error(`获取物流进度失败！`);
      }
      // 成功
      this.progressInfo = res.data;
      // 显示对话框
      this.progressDialogVisible = true;
      console.log(this.progressInfo);
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
