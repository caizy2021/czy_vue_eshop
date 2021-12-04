<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <!-- form表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏 -->
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <!-- 商品名称 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <!-- 商品价格 -->
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <!-- 商品重量 -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <!-- 商品数量 -->
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 商品分类 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="element"
                  v-for="(element, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示要上传到的后台api地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button type="success">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button class="btnAdd" type="success" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <!-- 主体区域 -->
      <img :src="previewURL" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  // 页面数据
  data() {
    return {
      // 步骤条索引
      activeIndex: "0",

      // 添加商品表单的数据对象
      addForm: {
        // 商品名称
        goods_name: "",
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: [],
      },

      // 添加商品表单的验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      // 商品分类的数据列表
      cateList: [],

      // 商品分类的级联选择器的配置选项
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },

      // 动态参数的数据列表
      manyTableData: [],

      // 静态参数的数据列表
      onlyTableData: [],

      // 上传图片的URL地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",

      // 图片上传组件的headers请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },

      // 打开图兰图片的URL
      previewURL: "",

      // 控制图片预览对话框的显示与隐藏
      previewDialogVisible: false,
    };
  },

  // 页面挂载时...
  mounted() {
    // 获取商品分类数据列表
    this.getCateList();
  },

  // 页面方法
  methods: {
    // 获取商品分类数据列表的方法
    async getCateList() {
      // 向后端发送请求
      const { data: res } = await this.$axios.get(`categories`);
      // 判断请求是否成功
      if (res.meta.status !== 200) {
        // 失败
        return this.$message.error("获取商品分类数据失败！");
      }
      // 成功
      // 保存数据
      this.cateList = res.data;
      console.log(this.cateList);
    },

    // 级联选择器的选中项变化时，触发这个函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
      // console.log(this.addForm.goods_cat);
    },

    // tab切换时触发的方法
    beforeTabLeave(activeName, oldActiveName) {
      // console.log("lk" + oldActiveName);
      // console.log("jr" + activeName);
      // return false;

      // 判断：如果标签页是0，且商品分类无数据，则不能跳转
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        // 提示用户
        this.$message.error("请先选择商品分类！");
        // 返回false不跳转
        return false;
      }
      // 允许跳转
    },

    // tab点击时触发的方法
    async tabClicked() {
      // console.log(this.activeIndex);
      // 判断访问的是动态参数面板，索引为1
      if (this.activeIndex == "1") {
        // 向后端发送请求
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        // 判断请求是否成功
        if (res.meta.status !== 200) {
          // 失败
          return this.$message.error(`获取动态参数列表失败！`);
        }
        // 成功
        this.manyTableData = res.data;
        res.data.forEach((element) => {
          element.attr_vals =
            element.attr_vals.length == 0 ? [] : element.attr_vals.split(" ");
        });
        console.log(this.manyTableData);
      }
      // 判断访问的是静态属性面板，索引为2
      else if (this.activeIndex == "2") {
        // 向后端发送请求
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        // 判断请求是否成功
        if (res.meta.status !== 200) {
          // 失败
          return this.$message.error(`获取静态属性失败！`);
        }
        // 成功
        this.onlyTableData = res.data;
        console.log(this.onlyTableData);
      }
    },

    // 处理图片预览效果的方法
    handlePreview(file) {
      console.log(file);
      this.previewURL = file.response.data.url;
      this.previewDialogVisible = true;
    },

    // 处理移除图片操作的方法
    handleRemove(file) {
      console.log(file);
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pic数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },

    // 监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response);
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
    },

    // 点击按钮，添加商品
    add() {
      // console.log(this.addForm);
      // 预验证
      this.$refs.addFormRef.validate(async valid => {
        // 失败
        if (!valid) {
          // 提示用户
          return this.$message.error(`请填写必要的表单项！`);
        }
        // 成功
        // 执行添加的业务逻辑

        // ***0.深拷贝：
        // 使用lodash插件，调用cloneDeep(obj)方法，进行深拷贝！
        const form = _.cloneDeep(this.addForm);

        // 1.处理 goods_cat 数据，将其转成逗号分隔的字符串
        form.goods_cat = form.goods_cat.join(",");

        // 2.处理 attrs 数据
        // 2.1.处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 2.2处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        // 2.3.数据添加到form中
        form.attrs = this.addForm.attrs;
        console.log(form);

        // 向后端发送请求，发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$axios.post("goods", form);
        console.log(res);
        // 判断请求是否成功
        if(res.meta.status !== 201){
          // 失败
          return this.$message.error(`添加商品失败！`)
        }
        // 成功
        this.$message.success(`添加商品成功！`);

        this.$router.push('/goods')
      });
    },
  },

  // 计算属性
  computed: {
    // 计算商品分类id
    cateId() {
      // 判断是否存在分类数据
      if (this.addForm.goods_cat.length == 3) {
        // 存在
        return this.addForm.goods_cat[2];
      }
      // 不存在
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
