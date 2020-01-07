<!-- 线索详情 -->
<template>
    <div class="container">
        <v-top>
            <a class="v-top-return" slot="return" href="javascript:;" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>返回</a>
            <div class="v-top-operation" slot="correlation">
                <el-button class="btn-transparent-ec0928" type="primary" icon="el-icon-check" @click="showDialogSwitchClientForm('dialogSwitchClientForm')">轉客戶</el-button>
                <el-button class="btn-transparent-ec0928" type="primary" icon="el-icon-edit-outline" @click="showFollowDialog">寫跟進</el-button>
                <el-button class="btn-transparent-ec0928" type="primary" icon="el-icon-edit" @click="showClueDialog">編輯</el-button>
                <el-button v-if="queryData.Busi_CFrom === '自建客戶'" class="btn-transparent-ec0928" type="primary" icon="el-icon-delete" @click="delClue">刪除</el-button>
                <el-button v-if="queryData.Busi_CFrom === '公海轉入'" class="btn-transparent-ec0928" type="primary" icon="el-icon-back" @click="returnClue">退回</el-button>
            </div>
        </v-top>
        <v-clue-info :clueData="clueData"></v-clue-info>
        <v-clue-details :clueData="clueData"></v-clue-details>
        <v-module>
            <div slot="module-head" class="module-head">
                <div class="title">銷售動態</div>
            </div>
            <div slot="module-body" class="module-body">
                <v-step :key="isUpdateStep" stepType="線索"></v-step>
            </div>
        </v-module>
        <!-- 转客户弹框 -->
        <el-dialog class="dialog-component" title="轉客戶" :visible.sync="dialogSwitchClientVisible" :close-on-click-modal="false">
            <el-form :model="dialogSwitchClientForm" ref="dialogSwitchClientForm" label-width="120px">
                <el-form-item label="姓名：">{{dialogSwitchClientForm.name}}</el-form-item>
                <el-form-item label="客戶狀態：" prop="Cst_Status" :rules="[
                    { required: true, message: '請選擇客戶狀態', trigger: 'change' }
                ]">
                    <el-select v-model="dialogSwitchClientForm.Cst_Status" placeholder="請選擇">
                        <el-option v-for="(item, index) in $store.state.customerStatusList" :key="index" :value="item.BO_Value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="備註：" prop="BF_Description">
                    <el-input v-model="dialogSwitchClientForm.BF_Description" type="textarea" rows="3" maxlength="500" />
                </el-form-item>
            </el-form>
            <div slot="footer" align="center">
                <el-button @click="dialogSwitchClientVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmDialogSwitchClientForm('dialogSwitchClientForm')">確定</el-button>
            </div>
        </el-dialog>
        <!-- 写跟进弹框 -->
        <v-follow-dialog v-if="isFollowDialog" dialogFollowTitle="寫跟進" dialogFollowTarget="線索" :dialogFollowStatus="clueData.Busi_CFollowStatus" @hideFollowDialog="hideFollowDialog"></v-follow-dialog>
        <!-- 编辑线索弹框 -->
        <v-clue-dialog v-if="isClueDialog" dialogClueTitle="編輯線索" :clueData="clueData" @hideClueDialog="hideClueDialog"></v-clue-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VClueInfo from '@/components/common/clue/VClueInfo.vue';
    import VClueDetails from '@/components/common/clue/VClueDetails.vue';
    import VModule from '@/components/common/VModule.vue';
    import VStep from '@/components/common/VStep.vue';
    import VFollowDialog from '@/components/common/clue/VFollowDialog.vue';
    import VClueDialog from '@/components/common/clue/VClueDialog.vue';
    export default {
        data() {
            return {
                clueData: {}, //线索信息
                queryData: JSON.parse(this.$route.query.obj),
                isShow: false,
                dialogSwitchClientVisible: false,
                dialogSwitchClientForm: {
                    Busi_CID: '',   //主键ID
                    name: '',   //姓名
                    Cst_Status: '意向客戶',   //客户状态
                    BF_Description: ''   //备注
                },
                isFollowDialog: false,  //写跟进
                isClueDialog: false,    //编辑
                isUpdateStep: 0
            }
        },
        components: {
            VTop,
            VClueInfo,
            VClueDetails,
            VModule,
            VStep,
            VFollowDialog,
            VClueDialog
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
            //添加更多标签
            showAddTag() {
                this.isShow = true;
            },
            //提交标签
            submitAddTag() {
                this.isShow = false;
            },
            //转客户弹框-显示
            showDialogSwitchClientForm(formName) {
                this.dialogSwitchClientForm.name = this.clueData.Busi_CName;
                this.$store.dispatch('getTypeData', '客戶狀態');
                this.$store.dispatch('getTypeData', '產品類型');
                this.dialogSwitchClientVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //转客户弹框-确定
            confirmDialogSwitchClientForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = Object.assign({}, this.dialogSwitchClientForm, { Busi_CID: this.queryData.Busi_CID });
                        this.$post('/api/CustomerApi/ConvertCustomer', params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: '轉客戶成功',
                                onClose: () => {
                                    this.$router.push({
                                        path: '/clueIndex'
                                    });
                                }
                            });
                            this.dialogSwitchClientVisible = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            //写跟进弹框-显示
            showFollowDialog() {
                this.isFollowDialog = true;
            },
            //写跟进弹框-隐藏
            hideFollowDialog(v) {
                if(v) {
                    this.isUpdateStep++;
                    this.getClueInfo();
                }
                this.isFollowDialog = false;
            },
            //编辑线索弹框-显示
            showClueDialog() {
                this.isClueDialog = true;
            },
            //编辑线索弹框-隐藏
            hideClueDialog(v) {
                if(v) {
                    this.getClueInfo();
                }
                this.isClueDialog = false;
            },
            //删除
            delClue() {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定要刪除客戶嗎? '),
                        h('div', {style: 'fontSize:12px;'}, '客戶刪除后將無法恢復，請謹慎操作！')
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
                                    path: '/clueIndex'
                                });
                            }
                        });
                    });
                }).catch(() => {
                        
                });
            },
            //退回
            returnClue() {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定要退回客戶嗎? '),
                        h('div', {style: 'fontSize:12px;'}, '客戶退回后將無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('api/ClueApi/ReturnClue', { Busi_CID: this.queryData.Busi_CID })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '退回成功',
                            onClose: () => {
                                this.$router.push({
                                    path: '/clueIndex'
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