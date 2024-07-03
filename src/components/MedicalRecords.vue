<template>
  <a-card
      title="体检记录"
      hoverable
      headStyle="background-color: #91caff"
  >
    <a-table :data-source="orderformState" :columns="columns">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'aname'">
          <span style="color: #1890ff">患者姓名</span>
        </template>
      </template>
      <template
          #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      >
        <div style="padding: 8px">
          <a-input
              ref="searchInput"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
              type="primary"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><SearchOutlined /></template>
            Search
          </a-button>
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
            Reset
          </a-button>
        </div>
      </template>
      <template #customFilterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #bodyCell="{ text, column, record }">
        <span v-if="state.searchText && state.searchedColumn === column.dataIndex">
          <template
              v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${state.searchText})|(?=${state.searchText})`, 'i'))"
          >
            <mark
                v-if="fragment.toLowerCase() === state.searchText.toLowerCase()"
                :key="i"
                class="highlight"
            >
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else-if="column.key === 'finish'">
          <a-button
              v-if="record.isFinished === 0"
              type="primary"
              size="small"
              @click="orderFinish(record)"
          >
            待完成
          </a-button>
          <span v-else>已完成</span>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
import { SearchOutlined } from '@ant-design/icons-vue';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';

const { proxy } = getCurrentInstance();
const currentid = localStorage.getItem('id');
const roleid = localStorage.getItem('roleid');

interface OrderFormState {
  id: number;
  aname: string;
  hospital_name: string;
  combo: string;
  dept_name: string;
  appointmentTime: string;
  doctor_name: string;
  isFinished: number;
}

const orderformState = ref<OrderFormState[]>([]);

const obtainDataMethodFororderList = async () => {
  try {
    let { data } = await proxy.$axios.post('home/recordtoday',
        {
          id : currentid , // 用户Id
          roleId : roleid
        });
    if (data.code == 1) {
      orderformState.value = data.data.map((item: any) => ({
        id: item.id,
        aname: item.name,
        hospital_name: item.hospitalName,
        combo: item.combo,
        dept_name: item.deptName,
        doctor_name:item.doctorName,
        appointmentTime: item.appointmentTime,
        isFinished: item.isFinished,
      }));

    } else {
      proxy.$message.warning('读取订单列表数据失败。');
    }
  } catch (error) {
    proxy.$message.warning('系统繁忙。请稍后。');
    console.log('error:', error);
  }
};

const orderFinish = (record: OrderFormState) => {
  Modal.confirm({
    title: '确认完成',
    content: `您确认完成该订单吗？`,
    onOk: async () => {
      try {
        let { data } = await proxy.$axios.post('main/finishrecord', { id: record.id });
        if (data.code == 1) {
          // 更新订单的完成状态
          const order = orderformState.value.find(item => item.id === record.id);
          if (order) {
            order.isFinished = 1;
          }
          message.success('订单完成');
        } else {
          message.error('完成订单失败');
        }
      } catch (error) {
        message.error('系统繁忙。请稍后。');
        console.log('error:', error);
      }
    },
    onCancel() {
      message.info('操作已取消');
    },
  });
};

onMounted(() => {
  obtainDataMethodFororderList();
});

const state = reactive({
  searchText: '',
  searchedColumn: '',
});

const searchInput = ref();

const columns = (roleid==='1'||roleid==='2')?[
    {
      title: '患者姓名',
      dataIndex: 'aname',
      key: 'aname',
      customFilterDropdown: true,
      onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: visible => {
        if (visible) {
          setTimeout(() => {
            searchInput.value.focus();
          }, 100);
        }
      },
    },
    {
      title: '预约类型',
      dataIndex: 'dept_name',
      key: 'dept_name',
    },
    {
      title: '体检套餐',
      dataIndex: 'combo',
      key: 'combo',
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
    },
    {
      title: '操作',
      key: 'finish',
    }
  ]
  :[
  {
    title: '体检机构',
    dataIndex: 'hospital_name',
  },
  {
    title: '体检套餐',
    dataIndex: 'combo',
  },
  {
    title: '预约类型',
    dataIndex: 'dept_name',
  },
  {
    title: '医生姓名',
    dataIndex: 'doctor_name',
  },
  {
    title: '申请日期',
    dataIndex: 'appointmentTime',
  }
];

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
};

const handleReset = clearFilters => {
  clearFilters({ confirm: true });
  state.searchText = '';
};

// const data = [
//   {
//     name: '王小明',
//     dept_name: '常规体检',
//     combo: '基础套餐',
//     createTime: '2024-07-01 09:00:00',
//     isFinished: 0
//   },
//   {
//     name: '王小明',
//     dept_name: '入职体检',
//     combo: '高级套餐',
//     createTime: '2024-07-01 10:00:00',
//     isFinished: 0
//   },
//   {
//     name: '张三',
//     dept_name: '常规体检',
//     combo: '基础套餐',
//     createTime: '2024-07-02 08:30:00',
//     isFinished: 0
//   },
//   {
//     name: '李四',
//     dept_name: '入职体检',
//     combo: '高级套餐',
//     createTime: '2024-07-02 11:00:00',
//     isFinished: 0
//   },
//   {
//     name: '王五',
//     dept_name: '常规体检',
//     combo: '基础套餐',
//     createTime: '2024-07-03 09:30:00',
//     isFinished: 0
//   },
//   {
//     name: '赵六',
//     dept_name: '常规体检',
//     combo: '高级套餐',
//     createTime: '2024-07-03 10:30:00',
//     isFinished: 0
//   },
//   {
//     name: '孙七',
//     dept_name: '入职体检',
//     combo: '基础套餐',
//     createTime: '2024-07-04 08:00:00',
//     isFinished: 0
//   },
//   {
//     name: '周八',
//     dept_name: '入职体检',
//     combo: '高级套餐',
//     createTime: '2024-07-04 10:45:00',
//     isFinished: 1
//   },
//   {
//     name: '吴九',
//     dept_name: '常规体检',
//     combo: '基础套餐',
//     createTime: '2024-07-05 09:15:00',
//     isFinished: 1
//   },
//   {
//     name: '郑十',
//     dept_name: '入职体检',
//     combo: '高级套餐',
//     createTime: '2024-07-05 11:30:00',
//     isFinished: 0
//   },
//   {
//     name: '木十一',
//     dept_name: '入职体检',
//     combo: '高级套餐',
//     createTime: '2024-07-06 11:30:00',
//     isFinished: 1
//   }
// ];

</script>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
