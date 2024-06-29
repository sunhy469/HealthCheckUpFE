<script setup lang="ts">
</script>
<template>
    <a-descriptions
      title="个人信息"
      bordered
      :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
    >
      <a-descriptions-item label="姓名">Cloud Database</a-descriptions-item>
      <a-descriptions-item label="Billing">Prepaid</a-descriptions-item>
      <a-descriptions-item label="Time">18:00:00</a-descriptions-item>
      <a-descriptions-item label="Amount">$80.00</a-descriptions-item>
      <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
      <a-descriptions-item label="Official">$60.00</a-descriptions-item>
      <a-descriptions-item label="Config Info">
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1
      </a-descriptions-item>
    </a-descriptions>
  </template>
  
  
  