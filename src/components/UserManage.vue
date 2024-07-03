<template>
  <a-card
      title="管理用户"
      hoverable
      headStyle="background-color: #91caff"
      style="min-height: 350px "
  >
    <a-table :columns="columns" :data-source="dataSource" :scroll="{ x: 1500, y: 900 }" bordered
             :pagination="pagination" :loading="loading" @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button @click="() => showDrawer(record)" v-if="roleid == 1">显示详细信息</a-button>
          <a-button @click="() => showDrawer(record)" v-if="roleid == 2">修改</a-button>
          <a-button @click="() => deleteConfirm(record)" v-if="roleid == 2">删除</a-button>
        </template>
      </template>
    </a-table>
  </a-card>

  <a-drawer title="详细信息" :width="600" :open="open" :body-style="{ paddingBottom: '80px' }"
            :footer-style="{ textAlign: 'right' }" @close="onClose">
    <a-form :model="form" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="姓名" name="name">
            <a-input v-model:value="form.name" :disabled=access2 placeholder="请输入真实姓名"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="sex" >
            <a-radio-group v-model:value="form.sex" :disabled=access2 button-style="solid">
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
            <a-input v-model:value="form.mobile" :disabled=access2 placeholder="请输入电话号码" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="密码" name="password" v-if="roleid==2">
            <a-input v-model:value="form.password" placeholder="不修改请留空" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="用户类型" name="roleid" v-if="roleid==2">
            <a-radio-group v-model:value="form.roleId" button-style="solid" >
              <a-radio-button value="0">普通用户</a-radio-button>
              <a-radio-button value="1">医生</a-radio-button>
              <a-radio-button value="2">管理员</a-radio-button>
            </a-radio-group>
          </a-form-item>
         </a-col>
        <!--<a-col :span="12">
          <a-form-item label="所在科室" name="deptid" v-if="form.roleId=='1'">
            <a-cascader v-model:value="value" :options="options" :load-data="loadData" placeholder="Please select" change-on-select/>
          </a-form-item>
        </a-col> -->
      </a-row>
    </a-form>
    <template #extra>
      <a-space>
        <a-button @click="onClose" v-if="roleid == 2">取消</a-button>
        <a-button type="primary" @click="edit" v-if="roleid == 2">确定</a-button>
      </a-space>
    </template>
  </a-drawer>

  <a-modal
      title="确认删除"
      v-model:open="showDeleteConfirm"
      @ok="confirmDelete"
      @cancel="cancelDelete"
  >
    <p>确定要删除这条记录吗？</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, getCurrentInstance} from 'vue';
import type { TableColumnsType, TablePaginationConfig, TableProps } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import axios from 'axios';
import { FilterValue } from 'ant-design-vue/es/table/interface';
const { proxy } = getCurrentInstance() as any;

let roleid = Number(localStorage.getItem('roleid'))
let access2 = roleid == 2 ? false : true
const columns: TableColumnsType = [
  { title: '用户名', width: 100, dataIndex: 'username', key: 'username', fixed: 'left' },
  { title: '真实姓名', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
  {
    title: '性别', width: 100, dataIndex: 'sex', key: 'sex',
    // render: (text) => {
    //   if (text === '0') return '男';
    //   if (text === '1') return '女';
    //   return '不愿透露';
    // },
    filters: [
      { text: '男', value: '0' },
      { text: '女', value: '1' },
      { text: '不愿透露', value: '2' }
    ],
    filterMode: 'tree',
    onFilter: (value, record) => record.sex === value,
  },
  { title: '联系方式', dataIndex: 'mobile', key: 'mobile', width: 150 },
  { title: '注册日期', dataIndex: 'createTime', key: 'createTime', width: 150, sorter: true },
  { title: '上次登录日期', dataIndex: 'lastLoginTime', key: 'lastLoginTime', width: 150, sorter: true },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
  },
];

const currentRecord = ref<any>(null);
const open = ref<boolean>(false);//抽屉状态
const showDeleteConfirm = ref<boolean>(false); // 删除确认对话框状态
const recordToDelete = ref<any>(null); // 要删除的记录

//提交表单
const form = ref({
  name: '',
  sex: 0,
  mobile: '',
  password: null,
  roleId: ''
});

//显示抽屉
const showDrawer = (record: any) => {
  currentRecord.value = record;
  console.log(record)
  form.value = { ...record };
  open.value = true;
};

const onClose = () => {
  open.value = false;
};

//显示删除确认对话框
const deleteConfirm = (record: any) => {
  recordToDelete.value = record.id;
  showDeleteConfirm.value = true
};

//确认删除
const confirmDelete = async () => {
  showDeleteConfirm.value = false;
  if (recordToDelete.value) {
    try {
      const { data } = await axios.post("user/delete", { id: recordToDelete.value }, { headers: { token: localStorage.getItem('token') } });
      if (data.code === 1) {
        window.location.reload();
      } else {
        proxy.$message.warning(`删除失败。`);
      }
    } catch (error) {
      proxy.$message.warning(`系统繁忙。请稍后。`);
      console.log("error:", error);
    }
  }
};

//取消删除
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  recordToDelete.value = null;
};

//编辑信息
const edit = async () => {
  try {
    const { data } = await axios.post("user/editinfo", form.value, { headers: { token: localStorage.getItem('token') } });
    if (data.code === 1) {
      window.location.reload();
    } else {
      proxy.$message.warning(`读取用户列表数据失败。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
    console.log("error:", error);
  }
};

//请求格式
type APIParams = {
  results: number;
  page?: number;
  sortField?: string;
  sortOrder?: number;
  [id: string]: any;
};

type APIResult = {
  data: {
    id: string;
    username: string;
    name: string;
    sex: string;
    mobile: string;
    roleId: string;
    createTime: string;
    lastLoginTime: string;
  }[];
};

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
} = usePagination(queryData, {
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'results',
  },
});

async function queryData(params: APIParams) {
  try {
    let response;
    if (roleid == 1) {
      response = await axios.get<APIResult>('/user/getpatient', { params });
    } else {
      response = await axios.get<APIResult>('/user/getall', { params });
    }
    return response.data.data.map(item => ({
      id: item.id,
      username: item.username,
      name: item.name,
      sex: item.sex,
      mobile: item.mobile,
      roleId: item.roleId,
      createTime: item.createTime,
      lastLoginTime: item.lastLoginTime || 'N/A', // 假设如果没有 lastLoginTime，就填充为 'N/A'
    }));
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
    console.log("error:", error);
    return [];
  }
}

//表格筛选变化
const pagination = computed(() => ({
  total: 200,
  current: current.value,
  pageSize: pageSize.value,
}));

const handleTableChange: TableProps<any>['onChange'] = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
) => {
  const { pageSize = 10, current = 1 } = pagination;
  run({
    results: pageSize,
    page: current,
    ...filters,
  });
};
</script>
