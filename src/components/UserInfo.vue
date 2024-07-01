<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const toComponentMethod = (subpath : any) => {
  router.push({ path: '/main/userinfo' + subpath });
}
let userid = Number(localStorage.getItem('roleid'))
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
const { proxy } = getCurrentInstance();
const obtainDataMethodForUserInfo = async () => {
  try {
    let { data } = await proxy.$axios.post("userinfo", 'userid' + userid);
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
    <a-form-item class="mybutton">
        <a-button :@click="toComponentMethod('/EditInfo')" html-type="submit" class="login-form-button">
          登入
        </a-button> 
    </a-form-item>
  </template>