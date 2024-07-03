<template>
  <div class="login-page-container">
    <a-card class="login-card">
      <a-tabs centered class="mytabs" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="用户名登入">
          <div class="login-container">
            <a-form :model="userformState" name="normal_login" class="login-form" @finishFailed="onFinishFailed">
              <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入你的账号!' }]">
                <a-input v-model:value="userformState.username">
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon"/>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入你的密码!' }]">
                <a-input-password v-model:value="userformState.password">
                  <template #prefix>
                    <LockOutlined class="site-form-item-icon"/>
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item>
                <div class="options-container">
                  <a-form-item name="remember" no-style>
                    <a-checkbox v-model:checked="userformState.remember">记住我</a-checkbox>
                  </a-form-item>
                  <a class="login-form-forgot" href="" @click.prevent="forgetPassword">忘记密码</a>
                </div>
              </a-form-item>
              <a-form-item class="mybutton">
                <a-button  type="primary" @click="SigninUserMethod" html-type="submit" class="login-form-button">登入</a-button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button type="primary" @click="goToRegister" html-type="submit" class="login-form-button">注册</a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="手机号登入">
          <div class="login-container">
            <a-form :model="phoneformState" name="phone_login" class="login-form" @finishFailed="onFinishFailed">
              <a-form-item label="手机号" name="mobile" :rules="[{ required: true, message: '请输入你的手机号!' }]" @blur='checkMethodFormobile()'>
                <a-input v-model:value="phoneformState.mobile">
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon"/>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="验证码" name="captcha" :rules="[{ required: true, message: '请输入你的验证码!' }]" @blur='checkcaptcha()'>
                <a-row gutter="8">
                  <a-col span="15">
                    <a-input v-model:value="phoneformState.captcha"/>
                  </a-col>
                  <a-col span="9">
                    <a-button @click="sendcaptcha">发送验证码</a-button>
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item>
                <div class="options-container">
                  <a-form-item name="remember" no-style>
                    <a-checkbox v-model:checked="phoneformState.remember">记住我</a-checkbox>
                  </a-form-item>
                </div>
              </a-form-item>
              <a-form-item class="mybutton">
                <a-button :disabled="disabled2" type="primary" html-type="submit" @click="SigninPhoneMethod" class="login-form-button">登入</a-button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button type="primary" @click="goToRegister" html-type="submit" class="login-form-button">注册</a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/signin.css';

const activeKey = ref('1');
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const goToRegister = () => {
  router.push({ path: '/register' });
};

const { proxy } = getCurrentInstance()as any;

const forgetPassword = () => {
  router.push({ path: '/ForgetPassword' });
};

const checkMethodFormobile = async () => {
  try {
    let { data: { code, msg } } = await proxy.$axios.post("user/login", 'mobile=' + phoneformState.mobile);
    if (code == 1 && msg == "INVALID") {
      proxy.$message.info(`无效的手机号。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
  }
};

const router = useRouter();
const SigninUserMethod = async () => {
  try {
    let { data } = await proxy.$axios.post("/user/login", {
      username: userformState.username,
      password: userformState.password,
    })
    if (data.code == 1 ) {
      sessionStorage.setItem("id",data.data.id)
      localStorage.setItem('id', data.data.id)
      localStorage.setItem('roleid', data.data.roleId)
      router.push({ path: '/main/userinfo' });
      proxy.$message.success(`登录成功！`);
    } else {
      proxy.$message.warning(`无效的用户名或密码。`);
    }
  } catch (error) {
    proxy.$message.error(`系统繁忙。请稍后。`);
  }
};

const SigninPhoneMethod = async () => {
  try {
    let { data } = await proxy.$axios.post("/user/login", {
      mobile: phoneformState.mobile,
      captcha: phoneformState.captcha
    });
    if (data.code == 1 ) {
      localStorage.setItem('id', data.data.id)
      localStorage.setItem('roleid', data.data.roleId)
      localStorage.setItem('token', data.data.token)
      router.push({ path: '/main/userinfo' });
      proxy.$message.success(`登录成功！`);
    } else {
      proxy.$message.warning(`无效的用户名或密码。`);
    }
  } catch (error) {
    proxy.$message.error(`系统繁忙。请稍后。`);
  }
};

const checkcaptcha = async () => {
  try {
    let { data: { code, msg, entity } } = await proxy.$axios.post("user/checkcaptcha", 'captcha=' + phoneformState.captcha);
    if (code == 1 && msg == "INVALID") {
      proxy.$message.warning(`无效的验证码。`);
    } else if (code == 1 && msg == "SUCCESS") {
      sessionStorage.setItem('currentmobile', JSON.stringify(entity));
      router.push({ path: '/main/userinfo' });
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
  }
};

interface UserFormState {
  username: string;
  password: string;
  remember: boolean;
}

const userformState = reactive<UserFormState>({
  username: '',
  password: '',
  remember: true,
});

interface PhoneFormState {
  mobile: string;
  captcha: string;
  remember: boolean;
}

const phoneformState = reactive<PhoneFormState>({
  mobile: '',
  captcha: '',
  remember: true,
});

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const sendcaptcha = async () => {
  let { data } = await proxy.$axios.post("user/captcha", phoneformState);
  console.log(data);
  proxy.$message.success(`发送验证码成功！`);
};


const disabled2 = computed(() => {
  return !(phoneformState.mobile && phoneformState.captcha);
});
</script>
