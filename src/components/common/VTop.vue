<!-- 公共顶部组件 -->
<template>
    <div class="v-top">
        <slot name="return"></slot>
        <slot name="leftTitle"></slot>
        <slot name="title"></slot>
        <slot name="correlation"></slot>
    </div>
</template>

<style scoped>
    .v-top {
        position: relative;
        margin-bottom: 10px;
        height: 32px;
    }
    .v-top .v-top-return {
        position: absolute;
        top: 0;
        left: 0;
        line-height: 32px;
        font-size: 16px;
        color: #666666;
    }
    .v-top .v-top-return i {
        font-weight: bold;
    }
    .v-top .v-top-left-title {
        position: absolute;
        top: 0;
        left: 0;
        line-height: 32px;
        font-size: 18px;
    }
    .v-top .v-top-left-title .icon {
        float: left;
        margin: 4px 8px 0 0;
    }
    .v-top .v-top-title {
        line-height: 32px;
        text-align: center;
    }
    .v-top .v-top-operation {
        position: absolute;
        top: 0;
        right: 0;
    }
    .v-top .v-top-operation .return-index {
        display: inline-block;
        margin-top: 6px;
        font-size: 14px;
        color: #409eff;
        text-decoration: underline;
    }
</style>