<template>
  <h2 class="forgot-password-title">忘记密码</h2>
  <a-card style="width: 500px; height: 500px; position: relative; left: 33%">
    <div class="forgot-password-container">
      <a-form :model="forgetPasswordFormState" name="forgot_password_form" class="forgot-password-form">

        <a-form-item label="手机号" name="mobile"
                     :rules="[{ required: true, message: '请输入你的手机号!' }]" @blur='checkMobile'>
          <a-input v-model:value="forgetPasswordFormState.mobile">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="验证码" name="captcha"
                     :rules="[{ required: true, message: '请输入你的验证码!' }]" @blur='checkCaptcha'>
          <a-row gutter="8">
            <a-col span="15">
              <a-input v-model:value="forgetPasswordFormState.captcha"/>
            </a-col>
            <a-col span="9">
              <a-button @click="sendCaptcha">发送验证码</a-button>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="新密码" name="password"
                     :rules="[{ required: true, message: '请输入你的新密码!' }]">
          <a-input-password v-model:value="forgetPasswordFormState.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon"/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item label="确认密码" name="confirmPassword"
                     :rules="[{ required: true, message: '请确认你的密码!' }, { validator: validatePassword }]">
          <a-input-password v-model:value="forgetPasswordFormState.confirmPassword">
            <template #prefix>
              <LockOutlined class="site-form-item-icon"/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item class="mybutton">
          <a-button :disabled="isDisabled" type="primary" @click="modifyMethod" html-type="submit" class="forgot-password-form-button">
            修改
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

const modifyMethod = async () => {
  try {
    let { data } = await proxy.$axios.post("/user/modpwd", {
      mobile: forgetPasswordFormState.mobile,
      captcha: forgetPasswordFormState.captcha,
      password: forgetPasswordFormState.password,
    });
    if (data.code == 1) {
      proxy.$message.success(`密码修改成功！`);
      router.push({ path: '/signin' });
    } else {
      proxy.$message.warning(`密码修改失败：${data.message}`);
    }
  } catch (error) {
    proxy.$message.error(`系统繁忙。请稍后。`);
  }
};

const checkMobile = async () => {
  try {
    let { data: { code, msg } } = await proxy.$axios.post("user/checkMobile", 'mobile=' + forgetPasswordFormState.mobile);
    if (code == 1 && msg == "INVALID") {
      proxy.$message.info(`无效的手机号。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
  }
};

const checkCaptcha = async () => {
  try {
    let { data: { code, msg} } = await proxy.$axios.post("user/checkCaptcha", 'captcha=' + forgetPasswordFormState.captcha);
    if (code == 1 && msg == "INVALID") {
      proxy.$message.warning(`无效的验证码。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
  }
};

const sendCaptcha = async () => {
  let { data } = await proxy.$axios.post("user/captcha", forgetPasswordFormState);
  proxy.$message.success(`发送验证码成功！`);
};

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value !== forgetPasswordFormState.password) {
    callback(new Error('两次输入的密码不一致！'));
  } else {
    callback();
  }
};

interface forgetPasswordFormState {
  mobile: string;
  captcha: string;
  password: string;
  confirmPassword: string;
}

const forgetPasswordFormState = reactive<forgetPasswordFormState>({
  mobile: '',
  captcha: '',
  password: '',
  confirmPassword: '',
});

const isDisabled = computed(() => {
  return !(forgetPasswordFormState.mobile && forgetPasswordFormState.captcha && forgetPasswordFormState.password && forgetPasswordFormState.confirmPassword);
});
</script>

<style scoped>
.forgot-password-title {
  color: #535bf2;
  text-align: center;
  margin: 30px 0 40px 0; /* 调整上外边距 */
  font-size: 36px;
  font-family: Microsoft Yahei;
}

.forgot-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 30px; /* 增加顶部填充，将内容向上移动 */
}

.forgot-password-form {
  margin-top: 30px;
  margin-left: 50px;
  margin-right: 50px;
}

.options-container {
  display: flex;
  justify-content: space-between; /* 使选项对称 */
  align-items: center;
}

.forgot-password-form-button {
  width: 45%;
}

.mybutton {
  text-align: center;
}
</style>
