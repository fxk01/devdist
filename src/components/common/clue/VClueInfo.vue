<!-- 组件-线索信息 -->
<template>
    <div class="white-box">
        <div class="centent">
            <div class="mb10 o-hidden">
                <span class="fl">
                    <span style="display:block;margin-bottom:5px;font-weight:bold;">{{clueData.Busi_CName}}</span>
                </span>
                <span class="fl ml20" style="margin-top:4px;">
                    <img v-if="clueData.Busi_CSex === '男'" src="static/images/comm/icon_sex_boy.png" title="男" />
                    <img v-else-if="clueData.Busi_CSex === '女'" src="static/images/comm/icon_sex_she.png" title="女" />
                    <img  v-else-if="clueData.Busi_CSex === '未知'" src="static/images/comm/icon_sex_unknown.png" title="未知" />
                </span>
                <el-tag v-if="clueData.StfPostName === '保險代理人' && clueData.Busi_CFollowStatus === '可持續跟進'" class="fl ml20" type="warning">{{clueData.Busi_CFollowStatus}}</el-tag>
                <el-tag v-if="clueData.StfPostName === '保險代理人' && clueData.Busi_CFollowStatus === '拒絕關閉'" class="fl ml20" type="info">{{clueData.Busi_CFollowStatus}}</el-tag>
                <div style="clear:both;">{{clueData.Busi_CNickyName | returnStr}}</div>
            </div>
            <el-row v-if="clueData.StfPostName === '保險代理人'" :gutter="20">
                <el-col :span="8"><i class="el-icon-message c-ff6600"></i> {{clueData.Busi_CEmail | returnStr}}</el-col>
                <el-col :span="8"><i class="el-icon-phone c-0099ff"></i> {{clueData.Busi_CMobile | returnStr}}</el-col>
                <el-col :span="8"><i class="el-icon-location c-990000"></i> {{clueData.Busi_CAddress | returnStr}}</el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'VClueInfo',
        props: ['clueData']
    }
</script>