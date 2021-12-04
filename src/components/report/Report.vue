<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2.为ECharts准备一个具有大小(宽高)的Dom -->
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入 echarts 组件
import * as echarts from "echarts";
// 导入 lodash 组件（深拷贝）
import _ from "lodash";

export default {
  // 页面数据
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },

  // 页面挂载时
  // 此时，页面上的元素，已经被渲染完毕了！
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 向后端发送请求，获取折线图数据
    const { data: res } = await this.$axios.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error(`获取折线图数据失败！`);
    }

    // 4.准备数据和配置项
    const result = _.merge(res.data, this.options);

    // 5.展示数据
    myChart.setOption(result);
  },

  // 页面方法
  methods: {},
};
</script>

<style lang="less" scoped></style>
