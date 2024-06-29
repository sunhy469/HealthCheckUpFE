<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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
  <RouterView />

</template>
<style scoped></style>

<style scoped>
</style>
