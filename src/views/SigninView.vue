<template>
  <h2 class="login-title">我的登陆页面</h2>
  <a-tabs class="mytabs" v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Tab 1">
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

          <a-form-item>
            <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
              登入
            </a-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a-button type="primary" html-type="submit" class="login-form-button">
              注册
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-tab-pane>

    <a-tab-pane key="3" tab="Tab 3">
      1
    </a-tab-pane>
  </a-tabs>

</template>
<script lang="ts" setup>
import {reactive, computed} from 'vue';
import {ref} from 'vue';

const activeKey = ref('1');
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.username && formState.password);
});
</script>
<style scoped>

.mytabs{
  position: relative;
  left: 40%;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.login-title {
  color: #535bf2;
  text-align: center;
  margin: 100px 0 60px 0;
  font-size: 36px;
  font-family: Microsoft Yahei;
}

.login-form {
  width: 565px;
  height: 372px;
  margin: 0 auto;
  padding: 40px 110px;
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}
</style>