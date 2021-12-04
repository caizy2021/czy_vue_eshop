<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 查询输入框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="success" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <!-- 商品价格 -->
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="102px"
        ></el-table-column>
        <!-- 商品重量 -->
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="77px"
        ></el-table-column>
        <!-- 创建时间 -->
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 数据
  data() {
    return {
      // 查询参数
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10,
      },

      // 商品列表
      goodslist: [],

      // 总数据条数
      total: 0,
    };
  },

  // 挂载时加载...
  mounted() {
    // 获取对应的商品列表
    this.getGoodsList();
  },

  // 方法
  methods: {
    // 根据分页获取对应的商品列表的方法
    async getGoodsList() {
      // 向后端发送请求
      const { data: res } = await this.$axios.get("goods", {
        params: this.queryInfo,
      });
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }
      // 成功
      this.$message.success("获取商品列表成功！");
      // console.log(res.data);
      // 存入数据
      this.goodslist = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodslist);
      console.log(this.total);
    },

    // 分页大小发生改变时
    handleSizeChange(newSize) {
      // 将newSize最新数据保存到pagesize
      this.queryInfo.pagesize = newSize;
      // 重新获取数据
      this.getGoodsList();
    },

    // 分页页码发生改变时
    handleCurrentChange(newPage) {
      // 将newPage最新数据保存到pagenum
      this.queryInfo.pagenum = newPage;
      // 重新获取数据
      this.getGoodsList();
    },

    // 点击删除按钮，根据id删除对应商品
    async deleteById(id) {
      // 弹出提示框，询问用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 判断用户是否要删除
      if(confirmResult !== 'confirm'){
        // 不删除
        // 取消删除
        return this.$message.info('取消了删除操作！')
      }
      // 要删除
      // 向后端发送请求
      const {data:res}= await this.$axios.delete(`goods/${id}`)
      // 判断请求是否成功
      if(res.meta.status !== 200){
        // 失败
        return this.$message.error('删除失败！')
      }
      // 成功
      this.$message.success('删除成功！')
      // 刷新列表
      this.getGoodsList()
    },

    // 点击添加商品按钮，跳转到添加商品页
    goAddPage(){
      this.$router.push('/goods/add')
    },
  },
};
</script>

<style lang="less" scoped></style>
