<template>
  <a-layout-header class="header">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">nav 1</a-menu-item>
      </a-menu>
    </a-layout-header>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
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
          <a-menu-item key="3" v-if="currentUserObject.permission.id == 0">预约体检</a-menu-item>
          <a-menu-item key="4" v-if="currentUserObject.permission.id == 0">体检记录</a-menu-item>
          <a-menu-item key="5" v-if="currentUserObject.permission.id !=0">今日预约记录</a-menu-item>
          <a-menu-item key="6" v-if="currentUserObject.permission.id !=0">管理体检记录</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="7" v-if="currentUserObject.permission.id == 0">
          <contacts-outlined />
          <span>关于我们</span>
        </a-menu-item>
        <a-sub-menu key="2" v-if="currentUserObject.permission.id !=0">
          <template #title>
            <span>
              <contacts-outlined />
              <span>账户管理</span>
            </span>
          </template>
          <a-menu-item key="8" v-if="currentUserObject.permission.id == 1">患者信息</a-menu-item>
          <a-menu-item key="9" v-if="currentUserObject.permission.id == 2">管理用户</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header style="background: #fff; padding: 0" /> -->
      <a-layout-content style="margin: 0 16px" v-if="selectedKeys[0]=='5'">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          Bill is a cat.
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2024 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  HeartOutlined,
  UserOutlined,
  ContactsOutlined
} from '@ant-design/icons-vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const toComponentMethod = (subpath) => {
  router.push({ path: '/main' + subpath });
}
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
console.log(JSON.parse(sessionStorage.getItem('currentUser')))

let currentUserObject = reactive(JSON.parse(sessionStorage.getItem('currentUser')) || { username: '未知', permission: { id: 2 } });

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

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
