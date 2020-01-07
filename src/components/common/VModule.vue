<!-- 组件-模块 -->
<template>
    <div class="module-box">
        <slot name="module-head"></slot>
        <slot name="module-body"></slot>
    </div>
</template>

<script>
    export default {
        name: 'VModule'
    }
</script>


<style scoped>
    .module-box {
        margin-bottom: 10px;
        padding: 20px;
        background-color: #ffffff;
    }
    .module-box .module-head {
        display: flex;
        margin-bottom: 20px;
        height: 40px;
        align-items: center;
        justify-content: space-between;
    }
    .module-box .module-head .title {
        padding-left: 10px;
        font-size: 16px;
        border-left: 2px solid red
    }
</style>
