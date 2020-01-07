<!-- 新建机会弹框、新增机会弹框、编辑机会弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogChanceTitle" :visible.sync="dialogChanceVisible" :close-on-click-modal="false" @close="closeChanceDialog">
        <el-form :model="dialogChanceForm" ref="dialogChanceForm" label-width="120px">
            <el-form-item v-if="dialogChanceTitle === '新增機會'" label="機會名稱：" prop="BC_Name" :rules="[
                { required: true, message: '請輸入機會名稱', trigger: 'blur' },
                { pattern: /^[\u4e00-\u9fa5A-Za-z0-9 ]{1,100}$/, message: '請輸入格式為中文、英文、數字' }
            ]">
                <el-input v-model="dialogChanceForm.BC_Name" maxlength="100" />
            </el-form-item>
            <el-form-item v-else label="機會名稱：" prop="BC_Name">{{dialogChanceForm.BC_Name}}</el-form-item>
            <el-form-item label="銷售階段：" prop="BC_Step" :rules="[
                { required: true, message: '請選擇銷售階段', trigger: 'change' }
            ]">
                <el-select v-model="dialogChanceForm.BC_Step" placeholder="請選擇">
                    <el-option value="推薦產品"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="關聯產品：" prop="BC_RelationProduct" :rules="[
                { required: true, message: '請選擇關聯產品', trigger: 'change' }
            ]">
                <el-select v-model="dialogChanceForm.BC_RelationProduct" placeholder="請選擇">
                    <el-option v-for="(item, index) in $store.state.relatedProductsList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="pr" label="預計保單金額：" prop="BC_MoneyEstimate" :rules="[
                { required: true, message: '請輸入預計保單金額', trigger: 'blur' },
                { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '請輸入正確的格式，數字或小數點為2位的小數' }
            ]">
                <el-input v-model.trim="dialogChanceForm.BC_MoneyEstimate" maxlength="14" />
                <div style="position:absolute;top:26px;right:0;font-size:12px;color:red;">單位：元　幣種：HKD</div>
            </el-form-item>
            <el-form-item label="預計簽單日期：" prop="BC_SignDateEstimate" :rules="[
                { required: true, message: '請選擇預計簽單日期', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogChanceForm.BC_SignDateEstimate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="limitSignDate"
                    placeholder="選擇日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="機會獲取日期：" prop="BC_CreateDate" :rules="[
                { required: true, message: '請選擇機會獲取日期', trigger: 'change' }
            ]">
                <el-date-picker
                    v-model="dialogChanceForm.BC_CreateDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="limitCreateDate"
                    placeholder="選擇日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="備註：" prop="BC_Description">
                <el-input v-model="dialogChanceForm.BC_Description" type="textarea" rows="3" maxlength="500" />
            </el-form-item>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeChanceDialog">取消</el-button>
            <el-button type="primary" @click="confirmChanceDialog('dialogChanceForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VChanceDialog',
        props: ['dialogChanceTitle', 'dialogChanceData'],
        data() {
            return {
                dialogChanceVisible: false,    //机会弹框是否显示
                dialogChanceForm: {   //机会表单
                    BC_Name: '',   //机会名称
                    BC_Step: '',   //销售阶段
                    BC_RelationProduct: '',    //关联产品
                    BC_MoneyEstimate: '',    //预计保单金额
                    BC_SignDateEstimate: this.comm.formatDate(new Date(), 'yyyy-MM-dd'),  //预计签单日期
                    BC_CreateDate: this.comm.formatDate(new Date(), 'yyyy-MM-dd'),  //机会获取日期
                    BC_Description: '' //备注
                },
                limitSignDate: {    //预计签单日期限制
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                limitCreateDate: {  //机会获取日期限制
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        mounted() {
            this.showChanceDialog('dialogChanceForm');
        },
        methods: {
            //机会弹框-显示
            showChanceDialog(formName) {
                this.$store.dispatch('getTypeData', '客戶狀態');
                this.$store.dispatch('getTypeData', '產品類型');
                if(this.dialogChanceTitle === '編輯機會') {
                    this.dialogChanceForm = Object.assign({}, this.dialogChanceData);
                }
                this.dialogChanceVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //机会弹框-确定
            confirmChanceDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '';
                        let params = {};
                        if(this.dialogChanceTitle === '新增機會') {
                            url = '/api/ChanceApi/AddChance';
                            params = Object.assign({}, this.dialogChanceForm, { Cst_Code: this.$route.query.Cst_Code });
                        } else if(this.dialogChanceTitle === '編輯機會') {
                            url = 'api/ChanceApi/UpdChance';
                            params = Object.assign({}, this.dialogChanceForm);
                        }
                        this.$post(url, params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: this.dialogChanceTitle === '新增機會' ? '新增成功': '編輯成功'
                            });
                            this.dialogChanceVisible = false;
                            this.$emit('hideChanceDialog', true);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //机会弹框-关闭
            closeChanceDialog() {
                this.dialogChanceVisible = false;
                this.$emit('hideChanceDialog');
            }
        }
    }
</script>