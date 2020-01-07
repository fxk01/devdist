<!-- 公海池详情 -->
<template>
    <div class="container">
        <v-top>
            <a class="v-top-return" slot="return" href="javascript:;" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>返回</a>
            <div class="v-top-operation" slot="correlation">
                <el-button v-if="queryData.Busi_CStatus === '有效'" class="btn-transparent-ec0928" type="primary" icon="el-icon-link" size="mini" @click="showAllocationDialog">分配客戶</el-button>
                <el-button v-if="queryData.Busi_CStatus === '無效'" class="btn-transparent-ec0928" type="danger" icon="el-icon-delete" size="mini" plain @click="delPool">刪除</el-button>
            </div>
        </v-top>
        <v-clue-info :clueData="clueData"></v-clue-info>
        <v-clue-details :clueData="clueData"></v-clue-details>
        <!-- 销售动态 -->
        <v-module v-if="queryData.Busi_CStatus !== '有效'">
            <div slot="module-head" class="module-head">
                <div class="title">銷售動態</div>
            </div>
            <div slot="module-body" class="module-body">
                <v-step stepType="線索"></v-step>
            </div>
        </v-module>
        <!-- 处理日志 -->
        <v-module v-if="queryData.Busi_CStatus !== '有效'">
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
        name: 'poolGmDetails',
        data() {
            return {
                clueData: {}, //线索信息
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
                        path: '/poolGmIndex'
                    });
                }
                this.isAllocationDialog = false;
            },
            //删除
            delPool() {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定刪除客戶記錄嗎? '),
                        h('div', {style: 'fontSize:12px;'}, '刪除后無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/ClueApi/DelClue', { Busi_CID: this.queryData.Busi_CID })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功',
                            onClose: () => {
                                this.$router.push({
                                    path: '/poolGmIndex'
                                });
                            }
                        });
                    });
                }).catch(() => {
                        
                });
            }
        }
    }
</script>