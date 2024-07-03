<template>
  <a-card
      title="体检记录"
      hoverable
      headStyle="background-color: #91caff"
  >
    <a-table :data-source="data" :columns="columns">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'username'">
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
          <a-button type="primary" size="small" @click="orderFinish(record)">完成</a-button>
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
const id = localStorage.getItem('id');

interface OrderFormState {
  username: string;
  hospital_name: string;
  combo: string;
  dept_name: string;
  appointmentTime: string;
  doctor_name: string;
}

const orderformState = ref<OrderFormState[]>([]);

const obtainDataMethodFororderList = async () => {
  try {
    let { data } = await proxy.$axios.post('main/doctorManage', { id });
    if (data.code == 1) {
      // 假设 data.list 是获取到的订单列表数据
      orderformState.value = data.list.map((item: any) => ({
        username: item.username,
        hospital_name: item.hospital_name,
        combo: item.combo,
        dept_name: item.dept_name,
        appointmentTime: item.appointmentTime,
        doctor_name:item.doctor_name,
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
        let { data } = await proxy.$axios.post('order/finishOrder', { id: record.username });
        if (data.code == 1) {
          // 更新订单状态
          orderformState.value = orderformState.value.filter(item => item.username !== record.username);
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

const data = [
  {
    username: '王小明',
    type: '常规体检',
    setmeal: '基础套餐',
    createTime: '2024-07-01 09:00:00',
  },
  {
    username: '王小明',
    type: '入职体检',
    setmeal: '高级套餐',
    createTime: '2024-07-01 10:00:00',
  },
  {
    username: '张三',
    type: '常规体检',
    setmeal: '基础套餐',
    createTime: '2024-07-02 08:30:00',
  },
  {
    username: '李四',
    type: '入职体检',
    setmeal: '高级套餐',
    createTime: '2024-07-02 11:00:00',
  },
  {
    username: '王五',
    type: '常规体检',
    setmeal: '基础套餐',
    createTime: '2024-07-03 09:30:00',
  },
  {
    username: '赵六',
    type: '常规体检',
    setmeal: '高级套餐',
    createTime: '2024-07-03 10:30:00',
  },
  {
    username: '孙七',
    type: '入职体检',
    setmeal: '基础套餐',
    createTime: '2024-07-04 08:00:00',
  },
  {
    username: '周八',
    type: '入职体检',
    setmeal: '高级套餐',
    createTime: '2024-07-04 10:45:00',
  },
  {
    username: '吴九',
    type: '常规体检',
    setmeal: '基础套餐',
    createTime: '2024-07-05 09:15:00',
  },
  {
    username: '郑十',
    type: '入职体检',
    setmeal: '高级套餐',
    createTime: '2024-07-05 11:30:00',
  },
  {
    username: '木十一',
    type: '入职体检',
    setmeal: '高级套餐',
    createTime: '2024-07-06 11:30:00',
  }
];

const state = reactive({
  searchText: '',
  searchedColumn: '',
});

const searchInput = ref();

const columns = [
  {
    title: '患者姓名',
    dataIndex: 'username',
    key: 'username',
    customFilterDropdown: true,
    onFilter: (value, record) => record.username.toString().toLowerCase().includes(value.toLowerCase()),
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
    dataIndex: 'type',
    key: 'type',
    customFilterDropdown: true,
    onFilter: (value, record) => record.type.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: '体检套餐',
    dataIndex: 'setmeal',
    key: 'setmeal',
    customFilterDropdown: true,
    onFilter: (value, record) => record.setmeal.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: '预约时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'finish',
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
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
