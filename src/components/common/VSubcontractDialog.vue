<!-- 转合同弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogSubcontracTitle" :visible.sync="dialogSubcontractVisible" :close-on-click-modal="false" @close="closeSubcontractDialog">
        <el-form :model="dialogSubcontractForm" ref="dialogSubcontractForm" label-width="100px">
            <el-form-item label="合同名稱" prop="BC_OrderName" :rules="[
                { required: true, message: '請輸入合同名稱', trigger: 'blur' }
            ]">
                <el-input v-model="dialogSubcontractForm.BC_OrderName" maxlength="100" />
            </el-form-item>
            <el-form-item label="產品名稱" prop="BC_OrderProductType" :rules="[
                { required: true, message: '請輸入產品名稱', trigger: 'blur' }
            ]">
                <el-select v-model="dialogSubcontractForm.BC_OrderProductType" placeholder="請選擇">
                    <el-option v-for="(item, index) in $store.state.relatedProductsList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="保單費用" prop="BC_OrderMoney" :rules="[
                { required: true, message: '請輸入保單費用', trigger: 'blur' },
                { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '請輸入正確的格式，數字或小數點為2位的小數' }
            ]">
                <el-input v-model.trim="dialogSubcontractForm.BC_OrderMoney" maxlength="14" />
            </el-form-item>
            <el-form-item label="體檢要求" prop="BC_PHExam" :rules="[
                { required: true, message: '請選擇體檢要求', trigger: 'change' }
            ]">
                <el-select v-model="dialogSubcontractForm.BC_PHExam" placeholder="請選擇">
                    <el-option v-for="(item, index) in $store.state.physicalRequirementsList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="簽發日期" prop="BC_OrderSignDate" :rules="[
                { required: true, message: '請選擇簽發日期', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogSubcontractForm.BC_OrderSignDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="limitOrderSignDate"
                    placeholder="選擇日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="產品描述" prop="BC_OrderDescription">
                <el-input v-model="dialogSubcontractForm.BC_OrderDescription" type="textarea" rows="3" maxlength="500" />
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeSubcontractDialog">取消</el-button>
            <el-button type="primary" @click="confirmSubcontractDialog('dialogSubcontractForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VSubcontractDialog',
        props: ['dialogSubcontracTitle', 'dialogSubcontractData'],
        data() {
            return {
                dialogSubcontractVisible: false,    //转合同弹框是否显示
                dialogSubcontractForm: {   //转合同表单
                    BC_ID: '',
                    BC_OrderName: '',   //合同名称
                    BC_OrderProductType: '',    //产品类型
                    BC_OrderMoney: '', //保单费用
                    BC_PHExam: '',   //体检要求
                    BC_OrderSignDate: this.comm.formatDate(new Date(), 'yyyy-MM-dd'),    //签发日期
                    BC_OrderDescription: '' //产品描述
                },
                limitOrderSignDate: {    //签发日期限制
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        mounted() {
            this.showSubcontractDialog('dialogSubcontractForm');
        },
        methods: {
            //转合同弹框-显示
            showSubcontractDialog(formName) {
                this.$store.dispatch('getTypeData', '體檢要求');
                this.$store.dispatch('getTypeData', '產品類型');
                this.dialogSubcontractForm.BC_ID = this.dialogSubcontractData.BC_ID;
                this.dialogSubcontractForm.BC_OrderProductType = this.dialogSubcontractData.BC_RelationProduct;
                this.dialogSubcontractVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //转合同弹框-确定
            confirmSubcontractDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$post('/api/ChanceApi/ConvertContract', this.dialogSubcontractForm)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: '轉合同成功'
                            });
                            this.dialogSubcontractVisible = false;
                            this.$emit('hideSubcontractDialog', true);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //机会弹框-关闭
            closeSubcontractDialog() {
                this.dialogSubcontractVisible = false;
                this.$emit('hideSubcontractDialog');
            }
        }
    }
</script>