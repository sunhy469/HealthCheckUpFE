<template>
  <h2 class="login-title">登陆页面</h2>
  <a-card style="width: 500px; height: 400px; position: relative; left: 33%">
    <a-tabs centered class="mytabs" v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="用户名登入">
        <div class="login-container">
          <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish"
                  @finishFailed="onFinishFailed">
            <a-form-item label="账号" name="username"
                         :rules="[{ required: true, message: '请输入你的账号!' }]">
              <a-input v-model:value="formState.username">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon"/>
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
              <a-form-item name="remember" no-style>
                <a-checkbox v-model:checked="formState.remember">记住我&nbsp;&nbsp;&nbsp;&nbsp;</a-checkbox>
              </a-form-item>
              <a class="login-form-forgot" href="">忘记密码</a>
            </a-form-item>

            <a-form-item class="mybutton">
              <a-button :disabled="disabled1" type="primary"  @click="signinMethod" html-type="submit" class="login-form-button">
                登入
              </a-button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a-button type="primary" @click="goToRegister" html-type="submit" class="login-form-button">
                注册
              </a-button>
            </a-form-item>

          </a-form>
        </div>
      </a-tab-pane>

      <a-tab-pane key="2" tab="手机号登入">
        <div class="login-container">
          <a-form :model="formState" name="phone_login" class="login-form"
                  @finishFailed="onFinishFailed">
            <a-form-item label="手机号" name="mobile"
                         :rules="[{ required: true, message: '请输入你的手机号!' }]" @blur='checkMethodFormobile()'>
              <a-input v-model:value="formState.mobile">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon"/>
                </template>
              </a-input>
            </a-form-item>

            <a-form-item label="验证码" name="captcha"
                         :rules="[{ required: true, message: '请输入你的验证码!' }]" @blur='checkcaptcha()'>
              <a-row gutter="8">
                <a-col span="15">
                  <a-input v-model:value="formState.captcha"/>
                </a-col>
                <a-col span="9">
                  <a-button @click="sendcaptcha">发送验证码</a-button>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item>
              <a-form-item name="remember" no-style>
                <a-checkbox v-model:checked="formState.remember">记住我&nbsp;&nbsp;&nbsp;&nbsp;</a-checkbox>
              </a-form-item>
            </a-form-item>
            <a-form-item class="mybutton">
              <a-button :disabled="disabled2" type="primary" html-type="submit" class="login-form-button">
                登入
              </a-button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a-button type="primary" @click="goToRegister" html-type="submit" class="login-form-button">
                注册
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script lang="ts" setup>
import {reactive, computed, getCurrentInstance, ref} from 'vue';
import { useRouter } from 'vue-router';
import '../assets/signin.css';

const activeKey = ref('1');
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';

const goToRegister = () => {
  router.push({ path: '/register' });
};

const { proxy } = getCurrentInstance();
// const checkMethodForUsername = async () => {
//   try {
//     let { data: { code, msg } } = await proxy.$axios.post("user/checkUsername", 'username=' + formState.username);
//     if (code == 1 && msg == "INVALID") {
//       proxy.$message.info(`无效的用户名。`);
//     }
//   } catch (error) {
//     proxy.$message.warning(`系统繁忙。请稍后。`);
//   }
// };

const checkMethodFormobile = async () => {
  try {
    let { data: { code, msg } } = await proxy.$axios.post("user/login", 'mobile=' + formState.mobile);
    if (code == 1 && msg == "INVALID") {
      proxy.$message.info(`无效的手机号。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
  }
};

const router = useRouter();
const signinMethod = async () => {
  try {
    let { data } = await proxy.$axios.post("/user/login", {
      username: formState.username,
      password: formState.password
    });
    console.log(data)
    if (data.code == 1 ) {
      sessionStorage.setItem("userid",data.id)
      localStorage.setItem('userid', data.id)
      localStorage.setItem('roleid', data.roleId)
      router.push({ path: '/main' });
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
    let { data: { code, msg, entity } } = await proxy.$axios.post("user/checkcaptcha", 'captcha=' + formState.captcha);
    if (code == 1 && msg == "INVALID") {
      proxy.$message.warning(`无效的验证码。`);
    } else if (code == 1 && msg == "SUCCESS") {
      sessionStorage.setItem('currentmobile', JSON.stringify(entity));
      router.push({ path: '/main' });
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
  }
};


interface FormState {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  mobile: '',
  captcha: '',
  remember: true,
});


const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const sendcaptcha = () => {
  console.log('发送验证码');
  // 这里可以添加发送验证码的逻辑
};

const disabled1 = computed(() => {
  return !(formState.username && formState.password);
});

const disabled2 = computed(() => {
  return !(formState.mobile && formState.captcha);
});
</script>
