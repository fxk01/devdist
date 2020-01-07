<!-- 补充保单弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogPolicyInfoTitle" :visible.sync="dialogPolicyInfoVisible" :close-on-click-modal="false" @close="closePolicyInfoDialog">
        <el-form :model="dialogPolicyInfoForm" ref="dialogPolicyInfoForm" label-width="100px">
            <el-form-item label="保單號" prop="BC_OrderNo" :rules="[
                { required: true, message: '請輸入保單號', trigger: 'blur' },
                { pattern: /^[a-zA-Z0-9~!@#$%^&*/|+-_()<>{}\\\[\] ]{1,30}$/, message: '請輸入格式為英文、數字、特殊字符' }
            ]">
                <el-input v-model="dialogPolicyInfoForm.BC_OrderNo" maxlength="30" />
            </el-form-item>
            <el-form-item label="生效日期" prop="BC_OrderStartDate" :rules="[
                { required: true, message: '請選擇生效日期', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogPolicyInfoForm.BC_OrderStartDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="limitOrderStartDate"
                    placeholder="選擇日期">
                </el-date-picker>
            </el-form-item>
             <el-form-item label="過期日期" prop="BC_OrderEndDate" :rules="[
                { required: true, message: '請選擇過期日期', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogPolicyInfoForm.BC_OrderEndDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="limitOrderEndDate"
                    placeholder="選擇日期">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closePolicyInfoDialog">取消</el-button>
            <el-button type="primary" @click="confirmPolicyInfoDialog('dialogPolicyInfoForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VPolicyInfoDialog',
        props: ['dialogPolicyInfoTitle', 'dialogPolicyInfoId'],
        data() {
            return {
                dialogPolicyInfoVisible: false,    //补充保单资料弹框是否显示
                dialogPolicyInfoForm: {   //补充保单资料表单
                    BC_OrderNo: '',   //保单号
                    BC_OrderStartDate: this.comm.formatDate(new Date(), 'yyyy-MM-dd'),  //生效日期
                    BC_OrderEndDate: '' //过期日期
                },
                limitOrderStartDate: {    //生效日期限制
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
                limitOrderEndDate: {    //过期日期限制
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                }
            }
        },
        mounted() {
            this.showPolicyInfoDialog('dialogPolicyInfoForm');
        },
        methods: {
            //补充保单资料弹框-显示
            showPolicyInfoDialog(formName) {
                this.dialogPolicyInfoVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //补充保单资料弹框-确定
            confirmPolicyInfoDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = Object.assign({}, this.dialogPolicyInfoForm, { BC_ID: this.dialogPolicyInfoId })
                        this.$post('/api/ChanceApi/WaitingPass', params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: '設置成功'
                            });
                            this.dialogPolicyInfoVisible = false;
                            this.$emit('hidePolicyInfoDialog', true);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //补充保单资料弹框-关闭
            closePolicyInfoDialog() {
                this.dialogPolicyInfoVisible = false;
                this.$emit('hidePolicyInfoDialog');
            }
        }
    }
</script>