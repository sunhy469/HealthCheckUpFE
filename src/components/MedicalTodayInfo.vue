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
        <template v-if="column.key === 'username'">
          <a>{{ record.username }}</a>
        </template>
        <template v-else-if="column.key === 'type'">
          <span>{{ record.type }}</span>
        </template>
        <template v-else-if="column.key === 'setMeal'">
          <span>{{ record.setMeal }}</span>
        </template>
        <template v-else-if="column.key === 'createTime'">
          <span>{{ record.createTime }}</span>
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
  username: string;
  institution: string;
  setMeal: string;
  type: string;
  createTime: string;
}

const orderformState = ref<OrderFormState[]>([]);

const { proxy } = getCurrentInstance();
const id = localStorage.getItem("id");

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const obtainDataMethodFororderList = async () => {
  try {
    let { data } = await proxy.$axios.post("order/doctorTodaylist", { id, date: formattedDate });
    if (data.code == 1) {
      // 假设 data.list 是获取到的订单列表数据
      orderformState.value = data.list.map((item: any) => ({
        username: item.username,
        institution: item.institution,
        setMeal: item.setMeal,
        type: item.type,
        createTime: item.createTime
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
    content: `您确认完成该订单吗？（${record.username}）`,
    onOk: async () => {
      try {
        let { data } = await proxy.$axios.post("order/finishOrder", { id: record.username });
        if (data.code == 1) {
          // 更新订单状态
          orderformState.value = orderformState.value.filter(item => item.username !== record.username);
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
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '预约类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '体检套餐',
    dataIndex: 'setMeal',
    key: 'setMeal',
  },
  {
    title: '预约时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '是否完成',
    key: 'finish',
  }
];
</script>

<style scoped>
/* 添加必要的样式 */
</style>
