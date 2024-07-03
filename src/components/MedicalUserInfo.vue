<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface OrderFormState {
  institution: string;
  setMeal: string;
  type: string;
  doctor: string;
  createTime: string;
}

const orderformState = ref<OrderFormState[]>([]);

const { proxy } = getCurrentInstance();
const id = localStorage.getItem("id");

const obtainDataMethodFororderList = async () => {
  try {
    let { data } = await proxy.$axios.post("order/orderlist", { id });
    if (data.code == 1) {
      // 假设 data.list 是获取到的订单列表数据
      orderformState.value = data.list.map((item: any) => ({
        institution: item.institution,
        setMeal: item.setMeal,
        type: item.type,
        doctor: item.doctor,
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


onMounted(() => {
  obtainDataMethodFororderList();
});

const columns = [
  {
    title: '体检机构',
    dataIndex: 'institution',
  },
  {
    title: '体检套餐',
    dataIndex: 'setMeal',
  },
  {
    title: '预约类型',
    dataIndex: 'type',
  },
  {
    title: '医生姓名',
    dataIndex: 'doctor',
  },
  {
    title: '申请日期',
    dataIndex: 'createTime',
  }
];
</script>

<template>
  <a-card
      title="个人信息"
      hoverable
      headStyle="background-color: #91caff"
      style="min-height: 350px "
  >
    <a-table :columns="columns" :data-source="orderformState" bordered :scroll="{ x: 'max-content' }">
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'institution'">
          <a>{{ text }}</a>
        </template>
        <template v-else-if="column.dataIndex === 'setMeal'">
          <a>{{ text }} </a>
        </template>
        <template v-else-if="column.dataIndex === 'type'">
          <a>{{ text }} </a>
        </template>
        <template v-else-if="column.dataIndex === 'doctor'">
          <a>{{ text }} </a>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          <a>{{ text }}</a>
        </template>
        <template v-else>
          <a>{{ text }}</a>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped>
.mybutton {
  margin-top: 20px;
  text-align: center;
}
</style>
