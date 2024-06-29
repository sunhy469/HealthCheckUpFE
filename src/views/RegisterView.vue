<template>
  <h2 class="register-title">注册页面</h2>
  <a-card style="width: 500px; height: 400px; position: relative; left: 33%">
    <div class="register-container">
      <a-form :model="formState" name="register_form" class="register-form" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="账号" name="username"
                     :rules="[{ required: true, message: '请输入你的账号!' }]">
          <a-input v-model:value="formState.username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="姓名" name="fullname"
                     :rules="[{ required: true, message: '请输入你的姓名!' }]">
          <a-input v-model:value="formState.fullname">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>


        <a-form-item label="手机" name="phonenumber"
                     :rules="[{ required: true, message: '请输入你的手机号!' }]">
          <a-input v-model:value="formState.phonenumber">
            <template #prefix>
              <PhoneOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password"
                     :rules="[{ required: true, message: '请输入你的密码!' }]">
          <a-input-password v-model:value="formState.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon"/>
            </template>
          </a-input-password>
        </a-form-item>


        <a-form-item>
          <a-button type="primary" html-type="submit" class="register-form-button">
            注册
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons-vue';
import '../assets/register.css';

const { proxy } = getCurrentInstance();
const router = useRouter();

interface FormState {
  username: string;
  fullname: string;
  password: string;
  phonenumber: string;
}

const formState = reactive<FormState>({
  username: '',
  fullname: '',
  password: '',
  phonenumber: ''
});

const onFinish = async () => {
  try {
    let { data: { code, msg } } = await proxy.$axios.post("doctor/register", formState);
    if (code == 1 && msg == "SUCCESS") {
      proxy.$message.success('注册成功，请登录');
      router.push({ path: '/signin' });
    } else {
      proxy.$message.warning('注册失败，请重试');
    }
  } catch (error) {
    proxy.$message.warning('系统繁忙，请稍后再试');
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

