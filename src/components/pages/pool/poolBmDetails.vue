<!-- 公海池详情 -->
<template>
    <div class="container">
        <v-top>
            <a class="v-top-return" slot="return" href="javascript:;" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>返回</a>
            <div class="v-top-operation" slot="correlation">
                <el-button v-if="queryData.Busi_CStatus === '已分配主管' || queryData.Busi_CStatus === '退回' || queryData.Busi_CStatus === '回收'" class="btn-transparent-ec0928" type="primary" icon="el-icon-link" size="mini" plain @click="showAllocationDialog">分配客戶</el-button>
            </div>
        </v-top>
        <v-clue-info :clueData="clueData"></v-clue-info>
        <v-clue-details :clueData="clueData"></v-clue-details>
        <!-- 销售动态 -->
        <v-module v-if="queryData.Busi_CStatus !== '已分配主管'">
            <div slot="module-head" class="module-head">
                <div class="title">銷售動態</div>
            </div>
            <div slot="module-body" class="module-body">
                <v-step stepType="線索"></v-step>
            </div>
        </v-module>
        <!-- 处理日志 -->
        <v-module v-if="queryData.Busi_CStatus !== '已分配主管'">
            <div slot="module-head" class="module-head">
                <div class="title">處理日誌</div>
            </div>
            <div slot="module-body" class="module-body">
                <v-flow></v-flow>
            </div>
        </v-module>
        <!-- 分配客戶弹框 -->
        <v-allocation-dialog v-if="isAllocationDialog" :dialogAllocationData="dialogAllocationData" @hideAllocationDialog="hideAllocationDialog"></v-allocation-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VClueInfo from '@/components/common/clue/VClueInfo.vue';
    import VClueDetails from '@/components/common/clue/VClueDetails.vue';
    import VModule from '@/components/common/VModule.vue';
    import VStep from '@/components/common/VStep.vue';
    import VFlow from '@/components/common/VFlow.vue';
    import VAllocationDialog from '@/components/common/clue/VAllocationDialog.vue';
    export default {
        name: 'poolBmDetails',
        data() {
            return {
                clueData: {}, //客户信息
                queryData: JSON.parse(this.$route.query.obj),
                isAllocationDialog: false,  //分配客户弹框是否显示
                dialogAllocationData: [],   //分配客户弹框传入的数据
            }
        },
        components: {
            VTop,
            VClueInfo,
            VClueDetails,
            VModule,
            VStep,
            VFlow,
            VAllocationDialog
        },
        mounted() {
            this.getClueInfo();
        },
        methods: {
            //获取线索信息
            getClueInfo() {
                this.$post('/api/ClueApi/GetClueInfo', { Busi_CID: this.queryData.Busi_CID })
                .then((res) => {
                    this.clueData = res.Info;
                });
            },
            //分配客户弹框-显示
            showAllocationDialog() {
                this.dialogAllocationData = [this.queryData];
                this.isAllocationDialog = true;
            },
            //分配客户弹框-隐藏
            hideAllocationDialog(v) {
                if(v) {
                    this.$router.push({
                        path: '/poolBmIndex'
                    });
                }
                this.isAllocationDialog = false;
            }
        }
    }
</script>