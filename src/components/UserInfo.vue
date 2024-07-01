<script setup lang="ts">
import { ref, reactive, getCurrentInstance,onMounted } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
let userid = Number(localStorage.getItem('userid'))
interface FormState {
  username: string;
  realname: string;
  sex: string;
  role: string;
  password: string;
  registerdate: string;
  mobile: string;
}

const formState = reactive<FormState>({
  username: '',
  realname: '',
  sex: '',
  role: '',
  password: '',
  registerdate: '',
  mobile: '',
});
const form = reactive({
  realname: formState.realname,
  sex: formState.sex,
  mobile:formState.mobile,
  password:''
});

const rules: Record<string, Rule[]> = {
  realname: [{ required: true, message: '请输入真实姓名' }],
  sex: [{ required: true, message: '请选择性别' }],
  mobile: [{ required: true, message: '请输入联系方式' }],
  password: [{ required: false, message: 'Please choose the type' }],
};

const open = ref<boolean>(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
const edit = async()=>{
  try {
    let { data } = await proxy.$axios.post("userinfo/editinfo", form);
    if (data.code == 1) {
      window.location.reload();
    } else {
      proxy.$message.warning(`读取用户列表数据失败。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
    console.log("error:", error);
  }
}
onMounted(() => {
  obtainDataMethodForUserInfo();
});
const { proxy } = getCurrentInstance();
const obtainDataMethodForUserInfo = async () => {
  try {
    let { data } = await proxy.$axios.post("userinfo/getinfo", 'userid' + userid);
    if (data.code == 1) {
      data.username = formState.username;
      data.realname = formState.realname;
      data.sex = formState.sex;
      data.role = formState.role;
      data.password = formState.password;
      data.registerdate = formState.registerdate;
      data.mobile = formState.mobile;
    } else {
      proxy.$message.warning(`读取用户列表数据失败。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
    console.log("error:", error);
  }
}
</script>
<template>
    <a-descriptions
      title="个人信息"
      bordered
      :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }"
      size="large"
    >
      <a-descriptions-item label="用户名">{{ formState.username }}</a-descriptions-item>
      <a-descriptions-item label="真实姓名">{{ formState.realname }}</a-descriptions-item>
      <a-descriptions-item label="性别">{{ formState.sex }}</a-descriptions-item>
      <a-descriptions-item label="联系方式">{{ formState.mobile }}</a-descriptions-item>
      <a-descriptions-item label="用户类型">{{ formState.role }}</a-descriptions-item>
      <a-descriptions-item label="注册时间">{{ formState.registerdate }}</a-descriptions-item>
    </a-descriptions>
    <a-button type="primary" @click="showDrawer" style="text-align: center">
    <template #icon><PlusOutlined /></template>
    修改信息
  </a-button>
  <a-drawer
    title="修改信息"
    :width="920"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="姓名" name="realname">
            <a-input v-model:value="form.realname" placeholder="请输入真实姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="sex">
            <a-radio-group v-model:value="form.sex" button-style="solid">
            <a-radio-button value="0">男</a-radio-button>
            <a-radio-button value="1">女</a-radio-button>
            <a-radio-button value="null">不愿透露</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系方式" name="mobile">
            <a-input v-model:value="form.mobile" placeholder="请输入电话号码"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="密码" name="password">
            <a-input v-model:value="form.password" placeholder="不修改请留空"/>
          </a-form-item>
        </a-col>
      </a-row>
      
    </a-form>
    <template #extra>
      <a-space>
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="edit">确定</a-button>
      </a-space>
    </template>
  </a-drawer>
  </template>