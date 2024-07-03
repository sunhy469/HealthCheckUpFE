<template>
  <a-card
      title="当日订单"
      hoverable
      headStyle="background-color: #91caff"
      style="min-height: 350px "
  >
    <a-table :columns="columns" :data-source="orderformState" bordered :scroll="{ x: 'max-content' }">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'finish'">
          <span>操作</span>
        </template>
        <template v-else>
          <span>{{ column.title }}</span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>{{ record.username }}</a>
        </template>
        <template v-else-if="column.key === 'dept_name'">
          <span>{{ record.dept_name }}</span>
        </template>
        <template v-else-if="column.key === 'combo'">
          <span>{{ record.combo }}</span>
        </template>
        <template v-else-if="column.key === 'appointmentTime'">
          <span>{{ record.appointmentTime }}</span>
        </template>
        <template v-else-if="column.key === 'finish'">
          <a-button @click="orderFinish(record)">完成</a-button>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';

const router = useRouter();

interface OrderFormState {
  id: number;
  name: string;
  hospital_name: string;
  combo: string;
  dept_name: string;
  appointmentTime: string;
  doctor_name: string;
}

const orderformState = ref<OrderFormState[]>([]);

const { proxy } = getCurrentInstance();
const currentid = localStorage.getItem("id");
const roleid = localStorage.getItem("roleid");
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const obtainDataMethodFororderList = async () => {
  try {
    let { data } = await proxy.$axios.post("main/recordtoday", { currentid ,roleid });
    if (data.code == 1) {
      orderformState.value = data.list.map((item: any) => ({
        id: item.id,
        name: item.name,
        hospital_name: item.hospital_name,
        combo: item.combo,
        dept_name: item.dept_name,
        doctor_name:item.doctor_name,
        appointmentTime: item.appointmentTime,
      }));
    } else {
      proxy.$message.warning(`读取订单列表数据失败。`);
    }
  } catch (error) {
    proxy.$message.warning(`系统繁忙。请稍后。`);
    console.log("error:", error);
  }
}

const orderFinish = (record: OrderFormState) => {
  Modal.confirm({
    title: '确认完成',
    content: `您确认完成该订单吗？（${record.name}）`,
    onOk: async () => {
      try {
        let { data } = await proxy.$axios.post("main/finishrecord", { id: record.id });
        if (data.code == 1) {
          orderformState.value = orderformState.value.filter(item => item.id !== record.id);
          message.success('订单完成');
        } else {
          message.error('完成订单失败');
        }
      } catch (error) {
        message.error('系统繁忙。请稍后。');
        console.log("error:", error);
      }
    },
    onCancel() {
      message.info('操作已取消');
    }
  });
}

onMounted(() => {
  obtainDataMethodFororderList();
});

const columns = [
  {
    title: '患者姓名',
    dataIndex: 'name',
    key: 'name',
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
    title: '是否完成',
    key: 'finish',
  }
];
</script>
