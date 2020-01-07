<!-- 新增财务分析弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogAccountsTitle" :visible.sync="dialogAccountsVisible" :close-on-click-modal="false" @close="closeAccountsDialog">
        <el-form :model="dialogAccountsForm" ref="dialogAccountsForm" label-width="120px">
            <el-form-item v-if="dialogAccountsTitle !== '編輯財務分析'" label="完成時間：" prop="BFA_FinAnalysisDate" :rules="[
                { required: true, message: '請選擇完成時間', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogAccountsForm.BFA_FinAnalysisDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="limitAnalysisDate"
                    placeholder="選擇日期"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="分析結果：" prop="BFA_FinAnalysisResult" :rules="[
                { required: true, message: '請輸入分析結果', trigger: 'blur' }
            ]">
                <el-input v-model="dialogAccountsForm.BFA_FinAnalysisResult" maxlength="100" />
            </el-form-item>
            <el-form-item label="分析說明：" prop="BFA_FinAnalysisDescription">
                <el-input v-model="dialogAccountsForm.BFA_FinAnalysisDescription" type="textarea" rows="3" maxlength="500" />
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeAccountsDialog">取消</el-button>
            <el-button type="primary" @click="confirmAccountsDialog('dialogAccountsForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VAccountsDialog',
        props: ['dialogAccountsTitle', 'dialogAccountsData'],
        data() {
            return {
                dialogAccountsVisible: false,    //账务分析弹框是否显示
                dialogAccountsForm: {   //账务分析表单
                    BFA_FinAnalysisDate: new Date(),  //完成时间
                    BFA_FinAnalysisResult: '',   //分析结果
                    BFA_FinAnalysisDescription: '' //备注
                },
                limitAnalysisDate: {    //完成日期限制
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        mounted() {
            this.showAccountsDialog('dialogAccountsForm');
        },
        methods: {
            //新增财务分析弹框-显示
            showAccountsDialog(formName) {
                if(this.dialogAccountsTitle === '編輯財務分析') {
                    this.dialogAccountsForm = Object.assign({}, this.dialogAccountsData);
                }
                this.dialogAccountsVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //新增财务分析弹框-确定
            confirmAccountsDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '', params = {};
                        if(this.dialogAccountsTitle === '新增財務分析' || this.dialogAccountsTitle === '更新財務分析') {
                            url = '/api/CustomerApi/AddFinAnalysis';
                            params = Object.assign({}, this.dialogAccountsForm, { Cst_ID: this.$route.query.Cst_Code });
                        } else if(this.dialogAccountsTitle === '編輯財務分析') {
                            url = '/api/CustomerApi/UpdFinAnalysis';
                            params = Object.assign({}, this.dialogAccountsForm);
                        }
                        this.$post(url, params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: this.dialogAccountsTitle + '成功'
                            });
                            this.dialogAccountsVisible = false;
                            this.$emit('hideAccountsDialog', true);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //新增财务分析弹框-关闭
            closeAccountsDialog() {
                this.dialogAccountsVisible = false;
                this.$emit('hideAccountsDialog');
            }
        }
    }
</script>