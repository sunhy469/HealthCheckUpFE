<script setup lang="ts">
import { ref } from 'vue';
import { handleTest } from './api/home.ts';

const data = ref(null);

const fetchData = async () => {

  try {
    const response = await handleTest({
      id : 1
    });
    data.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
</script>

<template>
  <div>
    <a-button type="primary" @click="fetchData">测试按钮</a-button>
    <div v-if="data">{{ data }}</div>
  </div>
</template>

<style scoped>
</style>
