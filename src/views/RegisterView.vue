<template>
  <h2 class="register-title">注册页面</h2>
  <a-card style="width: 500px; height: 500px; position: relative; left: 33%">
    <div class="register-container">
      <a-form :model="registerFormState" name="register_form" class="register-form">

        <a-form-item label="账号" name="username"
                     :rules="[{ required: true, message: '请输入你的账号!' }]">
          <a-input v-model:value="registerFormState.username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="真名" name="name"
                     :rules="[{ required: true, message: '请输入你的真名!' }]">
          <a-input v-model:value="registerFormState.name">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="手机号" name="mobile"
                     :rules="[{ required: true, message: '请输入你的手机号!' }]" @blur='checkMobile'>
          <a-input v-model:value="registerFormState.mobile">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="验证码" name="captcha"
                     :rules="[{ required: true, message: '请输入你的验证码!' }]" @blur='checkCaptcha'>
          <a-row gutter="8">
            <a-col span="15">
              <a-input v-model:value="registerFormState.captcha"/>
            </a-col>
            <a-col span="9">
              <a-button @click="sendCaptcha">发送验证码</a-button>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="密码" name="password"
                     :rules="[{ required: true, message: '请输入你的密码!' }]">
          <a-input-password v-model:value="registerFormState.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon"/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item label="确认密码" name="confirmPassword"
                     :rules="[{ required: true, message: '请确认你的密码!' }, { validator: validatePassword }]">
          <a-input-password v-model:value="registerFormState.confirmPassword">
            <template #prefix>
              <LockOutlined class="site-form-item-icon"/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item class="mybutton">
          <a-button :disabled="isDisabled" type="primary" @click="registerMethod" html-type="submit" class="register-form-button">
            注册
          </a-button>
        </a-form-item>

      </a-form>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { reactive, computed, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/register.css';

const { proxy } = getCurrentInstance();
const router = useRouter();
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const registerMethod = async () => {
  try {
    let { data } = await proxy.$axios.post("/user/register", {
      username: registerFormState.username,
      name: registerFormState.name,
      mobile: registerFormState.mobile,
      captcha: registerFormState.captcha,
      password: registerFormState.password,
    });
    if (data.code == 1) {
      sessionStorage.setItem("id", data.data.id)
      localStorage.setItem('id', data.data.id)
      localStorage.setItem('roleid', data.roleId)
      proxy.$message.success(`注册成功！`);
      router.push({ path: '/signin' });
    } else {
      proxy.$message.warning(`注册失败：${data.message}`);
    }
  } catch (error) {
    proxy.$message.error(`系统繁忙。请稍后。`);
  }
};

const checkMobile = async () => {
  try {
    let { data: { code, msg } } = await proxy.$axios.post("user/checkMobile", 'mobile=' + registerFormState.mobile);
    if (code == 1 && msg == "INVALID") {
      proxy.$message.info(`无效的手机号。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
  }
};
//
const checkCaptcha = async () => {
  try {
    console.log(123)
    let { data: { code, msg} } = await proxy.$axios.post("user/checkCaptcha", 'captcha=' + registerFormState.captcha);
    if (code == 1 && msg == "INVALID") {
      proxy.$message.warning(`无效的验证码。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
  }
};

const sendCaptcha = async () => {
  let { data } = await proxy.$axios.post("user/captcha", registerFormState);
  proxy.$message.success(`发送验证码成功！`);
};

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value !== registerFormState.password) {
    callback(new Error('两次输入的密码不一致！'));
  } else {
    callback();
  }
};

interface RegisterFormState {
  username: string;
  name: string;
  mobile: string;
  captcha: string;
  password: string;
  confirmPassword: string;
}

const registerFormState = reactive<RegisterFormState>({
  username: '',
  name: '',
  mobile: '',
  captcha: '',
  password: '',
  confirmPassword: '',
});

const isDisabled = computed(() => {
  return !(registerFormState.username && registerFormState.name && registerFormState.mobile && registerFormState.captcha && registerFormState.password && registerFormState.confirmPassword);
});
</script>
