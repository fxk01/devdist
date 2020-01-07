<!-- 组件-客户信息 -->
<template>
    <div class="white-box">
        <div class="centent">
            <div class="mb10 o-hidden">
                <span class="fl">
                    <span style="display:block;margin-bottom:5px;font-weight:bold;">{{customerData.Cst_Name}}</span>
                </span>
                <span class="fl ml20" style="margin-top:4px;">
                    <img v-if="customerData.Cst_Sex === '男'" src="static/images/comm/icon_sex_boy.png" title="男" />
                    <img v-else-if="customerData.Cst_Sex === '女'" src="static/images/comm/icon_sex_she.png" title="女" />
                    <img v-else-if="customerData.Cst_Sex === '未知'" src="static/images/comm/icon_sex_unknown.png" title="未知" />
                </span>
                <el-tag class="fl ml20" type="warning">{{customerData.Cst_Status}}</el-tag>
                <div style="clear:both;">{{customerData.Cst_NickyName | returnStr}}</div>
            </div>
            <el-row v-if="customerData.StfPostName === '保險代理人'" :gutter="20">
                <el-col :span="8"><i class="el-icon-message c-ff6600"></i> {{customerData.Cst_Email | returnStr}}</el-col>
                <el-col :span="8"><i class="el-icon-phone c-0099ff"></i> {{customerData.Cst_Mobile | returnStr}}</el-col>
                <el-col :span="8"><i class="el-icon-location c-990000"></i> {{customerData.Cst_Address | returnStr}}</el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'VCustomerInfo',
        props: ['customerData']
    }
</script>