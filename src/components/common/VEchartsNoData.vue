<template>
    <div v-if="!isShow" class="echarts-no-data">
        <div align="center"><i class="echarts-icon el-icon-pie-chart"></i>暫無數據</div>
    </div>
</template>

<script>
    export default {
        name: 'VEchartsNoData',
        props: ['isShow']
    }
</script>

<style scoped>
    .echarts-no-data {
        display: flex;
        position: absolute;
        top: 60px;
        right: 0;
        bottom: 0;
        left: 0;
        color: #999999;
        background-color: #ffffff;
        justify-content: center;
        align-items: center;
    }
    .echarts-no-data .echarts-icon {
        display: block;
        margin-bottom: 10px;
        font-size: 32px;
    }
</style>