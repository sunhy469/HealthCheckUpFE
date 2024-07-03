<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';

let id = localStorage.getItem('id')?.toString()
console.log(id)
interface FormState {
  username: string;
  name: string;
  sex: string;
  roleId: string;
  password: string;
  createTime: string;
  mobile: string;
}

const formState = reactive<FormState>({
  username: '',
  name: '',
  sex: '',
  roleId: '',
  password: '',
  createTime: '',
  mobile: '',
});
const form = reactive({
  id: id,
  name: formState.name,
  sex: formState.sex,
  mobile: formState.mobile,
  password: '',
});
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入真实姓名' }],
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

const edit = async () => {
  try {
    let { data } = await proxy.$axios.post("user/editinfo", form);
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
    let { data } = await proxy.$axios.post("user/getinfo", {
      id
    });
    if (data.code == 1) {
      formState.username = data.data.username
      formState.name = data.data.name
      formState.sex = data.data.sex
      formState.roleId = data.data.roleId
      formState.createTime = data.data.createTime
      formState.mobile = data.data.mobile
      form.name= formState.name,
      form.sex= formState.sex,
      form.mobile= formState.mobile
    } else {
      proxy.$message.warning(`读取用户列表数据失败。`)
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`)
    console.log("error:", error);
  }
}
</script>
<template>

  <a-card title="个人信息" hoverable headStyle="background-color: #91caff">
    <template #extra><a-button type="primary" @click="showDrawer">修改信息</a-button></template>
    <a-descriptions bordered :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="用户名" :label-style="{ width: '20%' }">{{ formState.username }}</a-descriptions-item>
      <a-descriptions-item label="真实姓名">{{ formState.name }}</a-descriptions-item>
      <a-descriptions-item label="性别">{{ Number(formState.sex) === 0 ? '男' :Number(formState.sex) === 1 ? '女':'不愿透露' }}</a-descriptions-item>
      <a-descriptions-item label="联系方式">{{ formState.mobile }}</a-descriptions-item>
      <a-descriptions-item label="用户类型">{{
        Number(formState.roleId) === 0 ? '普通用户' :
          Number(formState.roleId) === 1 ? '医生' : '管理员'
      }}
      </a-descriptions-item>
      <a-descriptions-item label="注册时间">{{ formState.createTime }}</a-descriptions-item>
    </a-descriptions>
  </a-card>


  <a-drawer title="修改信息" :width=600 :open="open" :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }" @close="onClose">
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="姓名" name="name">
            <a-input v-model:value="form.name" placeholder="请输入真实姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="sex">
            <a-radio-group v-model:value="form.sex" button-style="solid">
              <a-radio-button value="0">男</a-radio-button>
              <a-radio-button value="1">女</a-radio-button>
              <a-radio-button value="2">不愿透露</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="联系方式" name="mobile">
            <a-input v-model:value="form.mobile" placeholder="请输入电话号码" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="密码" name="password">
            <a-input v-model:value="form.password" placeholder="不修改请留空" />
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
