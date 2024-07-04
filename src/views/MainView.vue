<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" breakpoint="lg" style="height: 98vh; background-color: white">
      <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
        <a-menu-item key="1" @click="toComponentMethod('/userinfo')">
          <user-outlined />
          <span>用户中心</span>
        </a-menu-item>
        <a-sub-menu key="2">
          <template #title>
            <span>
              <heart-outlined />
              <span>体检中心</span>
            </span>
          </template>
          <a-menu-item key="3" v-if="roleid == 0" @click="toComponentMethod('/MedicalApply')">预约体检</a-menu-item>
          <a-menu-item key="4" v-if="roleid == 0" @click="toComponentMethod('/MedicalRecords')">体检记录</a-menu-item>
          <a-menu-item key="5" v-if="roleid !=0" @click="toComponentMethod('/MedicalRecordsToday')">今日预约记录</a-menu-item>
          <a-menu-item key="6" v-if="roleid !=0" @click="toComponentMethod('/MedicalRecords')">管理体检记录</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="3" v-if="roleid != 0">
          <template #title>
            <span>
              <contacts-outlined />
              <span>账户管理</span>
            </span>
          </template>
          <a-menu-item key="7" v-if="roleid == 1" @click="toComponentMethod('/usermanage')">患者信息</a-menu-item>
          <a-menu-item key="8" v-if="roleid == 2" @click="toComponentMethod('/usermanage')">管理用户</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9" @click="logout">
          <PoweroffOutlined />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-main>
        <router-view />
      </a-main>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  HeartOutlined,
  UserOutlined,
  ContactsOutlined,
  PoweroffOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const toComponentMethod = (subpath: any) => {
  router.push({ path: '/main' + subpath });
}
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);

let roleid = Number(localStorage.getItem('roleid'))
const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
};
</script>
<style scoped>
.logo {
  float: left;
  width: 140px;
  height: 32px;
  margin: 16px 30px;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}
</style>
