<template>
  <a-card
      title="体检预约"
      hoverable
      headStyle="background-color: #91caff"
  >
    <a-descriptions
        bordered
        :column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }"
    >
      <a-form>
        <a-form-item label="预约选择">
          <a-cascader
              v-model:value="cascaderValue"
              :options="options"
              placeholder="请选择医院,类型,套餐,医生"
              change-on-select
          />
        </a-form-item>
        <a-form-item label="预约时间">
          <a-date-picker
              v-model:value="appointmentTime"
              format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              :disabled-time="disabledDateTime"
              :show-time="{ defaultValue: dayjs('07:00:00', 'HH:mm:ss') }"
              placeholder="请选择时间"
              style="width: 100%"
          />
        </a-form-item>
        <a-form-item>
          <a-button :disabled="disabled" type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
        </a-form-item>
      </a-form>
    </a-descriptions>
  </a-card>
</template>

<script setup lang="ts">
import dayjs, {Dayjs} from 'dayjs';
import {computed, getCurrentInstance, ref} from 'vue';
import type {CascaderProps} from 'ant-design-vue';
import {useRouter} from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();

const options: CascaderProps['options'] = [
  {
    value: '上海医院',
    label: '上海医院',
    children: [
      {
        value: '内科',
        label: '内科',
        children: [
          {
            value: '肾病检查',
            label: '肾病检查',
            children: [
              { value: '小菲医生', label: '小菲医生' },
            ],
          },
          {
            value: '肝病检查',
            label: '肝病检查',
            children: [
              { value: '小萧医生', label: '小萧医生' },
            ],
          },
        ],
      },
      {
        value: '眼科',
        label: '眼科',
        children: [
          {
            value: '视网膜检查',
            label: '视网膜检查',
            children: [
              { value: '小肖医生', label: '小肖医生' },
            ],
          },
          {
            value: '结膜炎治疗',
            label: '结膜炎治疗',
            children: [
              { value: '小萨医生', label: '小萨医生' },
            ],
          },
          {
            value: '老花眼检查',
            label: '老花眼检查',
            children: [
              { value: '小牧医生', label: '小牧医生' },
            ],
          },
        ],
      },
      {
        value: '耳鼻喉科',
        label: '耳鼻喉科',
        children: [
          {
            value: '鼻外伤治疗',
            label: '鼻外伤治疗',
            children: [
              { value: '小白医生', label: '小白医生' },
            ],
          },
          {
            value: '囊肿检查',
            label: '囊肿检查',
            children: [
              { value: '小敏医生', label: '小敏医生' },
            ],
          },
        ],
      },
    ],
  },
  {
    value: '北京医院',
    label: '北京医院',
    children: [
      {
        value: '外科',
        label: '外科',
        children: [
          {
            value: '腹壁疾病治疗',
            label: '腹壁疾病治疗',
            children: [
              { value: '小浒医生', label: '小浒医生' },
            ],
          },
          {
            value: '颈部疾病治疗',
            label: '颈部疾病治疗',
            children: [
              { value: '小斌医生', label: '小斌医生' },
            ],
          },
        ],
      },
      {
        value: '内科',
        label: '内科',
        children: [
          {
            value: '气管炎治疗',
            label: '气管炎治疗',
            children: [
              { value: '小凡医生', label: '小凡医生' },
            ],
          },
        ],
      },
      {
        value: '眼科',
        label: '眼科',
        children: [
          {
            value: '睑板腺检查',
            label: '睑板腺检查',
            children: [
              { value: '小艺医生', label: '小艺医生' },
            ],
          },
          {
            value: '眼睑腺炎检查',
            label: '眼睑腺炎检查',
            children: [
              { value: '小唐医生', label: '小唐医生' },
            ],
          },
          {
            value: '青光眼检查',
            label: '青光眼检查',
            children: [
              { value: '小连医生', label: '小连医生' },
            ],
          },
          {
            value: '色盲检查',
            label: '色盲检查',
            children: [
              { value: '小程医生', label: '小程医生' },
            ],
          },
        ],
      },
    ],
  },
];


const cascaderValue = ref<string[]>([]);
const appointmentTime = ref<Dayjs | null>(null);

const disabledDate = (current: Dayjs) => {
  // 不能选择今天之前的日期
  return current && current < dayjs().startOf('day').add(1, 'day');
};

const disabledDateTime = () => {
  return {
    disabledHours: () => range(0, 24).filter(h => h < 7 || h > 20 || (h > 10 && h < 13)),
    disabledMinutes: () => [],
    disabledSeconds: () => []
  };
};

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const onSubmit = async () => {
  try {
    const [,,, doctor_id] = cascaderValue.value;
    const requestData = {
      userId : localStorage.getItem('id'),
      doctorId : 0,
      appointmentTime: appointmentTime.value ? appointmentTime.value.format('YYYY-MM-DD HH:mm:ss') : null,
      doctorName: doctor_id,
    };

    const { data } = await proxy.$axios.post("/home/apply", requestData);
    if (data.code === 1) {
      proxy.$message.success('预约成功！');
    } else {
      proxy.$message.warning(`预约失败：${data.message}`);
    }
  } catch (error) {
    proxy.$message.error('系统繁忙');
  }
};



const resetForm = () => {
  cascaderValue.value = [];
  appointmentTime.value = null;
};

const disabled = computed(() => {
  return !(cascaderValue.value.length === 4 && appointmentTime.value);
});

</script>

<style scoped>
</style>
