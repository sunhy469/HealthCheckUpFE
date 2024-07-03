<template>
  <a-table :columns="columns" :row-selection=access1 :data-source="dataSource" :scroll="{ x: 1500, y: 900 }" bordered
    :pagination="pagination" :loading="loading" @change="handleTableChange">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operation'">
        <a-button @click="() => showDrawer(record)" v-if="roleid == 1">显示详细信息</a-button>
        <a-button @click="() => showDrawer(record)" v-if="roleid == 2">修改</a-button>
        <a-button @click="() => deleteRecord(record.key)" v-if="roleid == 2">删除</a-button>
      </template>
    </template>
  </a-table>
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
              <a-radio-button value="男">男</a-radio-button>
              <a-radio-button value="女">女</a-radio-button>
              <a-radio-button value="不愿透露">不愿透露</a-radio-button>
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
            <a-radio-group v-model:value="form.roleid" button-style="solid">
              <a-radio-button value="0">普通用户</a-radio-button>
              <a-radio-button value="1">医生</a-radio-button>
              <a-radio-button value="2">管理员</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="所在科室" name="deptid" v-if="form.roleid=='1'">
            <a-cascader v-model:value="value":options="options":load-data="loadData"placeholder="Please select" change-on-select/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #extra>
      <a-space>
        <a-button @click="onClose" v-if="roleid == 2">取消</a-button>
        <a-button type="primary" @click="edit" v-if="roleid == 2">确定</a-button>
      </a-space>
    </template>
  </a-drawer>
  <a-button @click="deleteSelectedRecords" :disabled="!selectedRowKeys.length" v-if="roleid==2">批量删除</a-button>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
import type { TableColumnsType, TableProps,CascaderProps  } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import { Table } from 'ant-design-vue';
import axios from 'axios';
//const { proxy } = getCurrentInstance();

let roleid = Number(localStorage.getItem('roleid'))
let access1 = roleid == 2?"rowSelection":null 
let access2 = roleid == 2?false:true
const columns: TableColumnsType = [
  { title: '用户名', width: 100, dataIndex: 'username', key: 'username', fixed: 'left' },
  { title: '真实姓名', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
  {
    title: '性别', width: 100, dataIndex: 'sex', key: 'sex',
    filters: [
      { text: '男', value: '男' },
      { text: '女', value: '女' },
      { text: '不愿透露', value: '不愿透露' }
    ],
    filterMode: 'tree',
    onFilter: (value, record) => record.sex === value,
  },
  { title: '联系方式', dataIndex: 'mobile', key: 'mobile', width: 150 },
  { title: '注册日期', dataIndex: 'createTime', key: 'createTime', width: 150, sorter: true },
  { title: '上次登录日期', dataIndex: 'lastloginTime', key: 'lastloginTime', width: 150, sorter: true },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
  },
];

const currentRecord = ref<any>(null);
const open = ref<boolean>(false);//抽屉状态
//提交表单
const form = ref({
  name: '',
  sex: '',
  mobile: '',
  password: '',
  roleid: ''
});

//显示抽屉
const showDrawer = (record: any) => {
  currentRecord.value = record;
  form.value = { ...record };
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
//编辑信息
const edit = async () => {
  try {
    const { data } = await axios.post("user/editinfo", form.value);
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
//删除与批量删除
const deleteRecord = async (key: string) => {
  try {
    const { data } = await axios.post("user/delete", { key });
    if (data.code === 1) {
      window.location.reload();
    } else {
      proxy.$message.warning(`删除失败。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
    console.log("error:", error);
  }
};

const deleteSelectedRecords = async () => {
  try {
    const { data } = await axios.post("user/deleteBatch", { keys: selectedRowKeys.value });
    if (data.code === 1) {
      window.location.reload();
    } else {
      proxy.$message.warning(`批量删除失败。`);
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
    roleid: string;
    createTime: string;
    lastloginTime: string;
  }[];
};
//请求数据（老）
// const queryData = async (params: APIParams) => {
//   if(roleid == 1)
//     return axios.get<APIResult>('/user/getpatient', { params });
//   else
//     return axios.get<APIResult>('/user/getall', { params });
// };
//返回数据写入
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
      sex: Number(item.sex)===0?'男':Number(item.sex)===1?'女':'不愿透露',
      mobile: item.mobile,
      roleid: item.roleid,
      createTime: item.createTime,
      lastloginTime: item.lastloginTime || 'N/A', // 假设如果没有 lastloginTime，就填充为 'N/A'
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

const handleTableChange: TableProps['onChange'] = (
  pag: { pageSize: number; current: number },
  filters: any,
  sorter: any,
) => {
  run({
    results: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters,
  });
};
//表格多选框
const selectedRowKeys = ref<string[]>([]);
const onSelectChange = (changableRowKeys: string[]) => {
  console.log('selectedRowKeys changed: ', changableRowKeys);
  selectedRowKeys.value = changableRowKeys;
};

const rowSelection = computed(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: onSelectChange,
  hideDefaultSelections: true,
  selections: [
    Table.SELECTION_ALL,
    Table.SELECTION_INVERT,
    Table.SELECTION_NONE,
  ],
}));
// //动态级联选择器
// const options = ref<CascaderProps['options']>([
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//     isLeaf: false,
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//     isLeaf: false,
//   },
// ]);

// const loadData: CascaderProps['loadData'] = selectedOptions => {
//   const targetOption = selectedOptions[selectedOptions.length - 1];
//   targetOption.loading = true;

//   setTimeout(() => {
//     targetOption.loading = false;
//     targetOption.children = [
//       {
//         label: `${targetOption.label} Dynamic 1`,
//         value: 'dynamic1',
//       },
//       {
//         label: `${targetOption.label} Dynamic 2`,
//         value: 'dynamic2',
//       },
//     ];
//     options.value = [...options.value];
//   }, 1000);
// };

// const value = ref<string[]>([]);
</script>
