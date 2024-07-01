<template>
    <a-table :columns="columns" :data-source="dataSource" :scroll="{ x: 1500, y: 600 }" :pagination="pagination":loading="loading" @change="handleTableChange">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'operation'">
          <a>编辑</a>
          <a>删除</a>
        </template>
      </template>
    </a-table>
  </template>

  <script lang="ts" setup>
  import type { TableColumnsType,TableProps } from 'ant-design-vue';
  import { computed } from 'vue';
  import { usePagination } from 'vue-request';
  import axios from 'axios';

  const columns: TableColumnsType = [
    { title: '用户名', width: 100, dataIndex: 'username', key: 'username', fixed: 'left' },
    { title: '真实姓名', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: '性别', width: 100, dataIndex: 'sex', key: 'age',
    filters: [
        { text:'男', value:'0' },
        { text:'女', value:'1' },
        { text:'未知', value:'2'}
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.startsWith(value)},
    { title: '联系方式', dataIndex: 'mobile', key: 'mobile', width: 150 },
    { title: '注册日期', dataIndex: 'rdate', key: 'createTime', width: 150,sorter:true },
    { title: '上次登录日期', dataIndex: 'ldate', key: 'lastloginTime', width: 200,sorter:true },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
    },
  ];
  
  type APIParams = {
  results: number;
  page?: number;
  sortField?: string;
  sortOrder?: number;
  [key: string]: any;
};

type APIResult = {
  results: {
    username: string;
    name: string;
    sex: 0|1|2;
    mobile: string;
    createTime: string;
    lastloginTime: string;
  }[];
};

const queryData = (params: APIParams) => {
  return axios.get<APIResult>('usermanage/get', { params });
};

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
} = usePagination(queryData, {

  formatResult: res => res.data.results,

  pagination: {
    currentKey: 'page',
    pageSizeKey: 'results',
  },

});

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
  </script>