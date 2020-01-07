<!-- 编辑客户弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogCustomerTitle" :visible.sync="dialogClueVisible" :close-on-click-modal="false" @close="closeCustomerDialog">
        <el-form :model="dialogCustomerForm" ref="dialogCustomerForm" label-width="80px">
            <div class="grouping">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="Cst_Name" :rules="[
                            { required: true, message: '請輸入姓名', trigger: 'blur' },
                            { pattern: /^(?!(\s+$))/, message: '請輸入姓名' },
                            { pattern: /^[\u4e00-\u9fa5A-Za-z ]{1,50}$/, message: '請輸入格式為中文、英文' }
                        ]">
                            <el-input v-model="dialogCustomerForm.Cst_Name" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="昵稱" prop="Cst_NickyName" :rules="[
                            { pattern: /^[\u4e00-\u9fa5A-Za-z ]{0,50}$/, message: '請輸入格式為中文、英文' }
                        ]">
                            <el-input v-model="dialogCustomerForm.Cst_NickyName" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="性別" prop="Cst_Sex">
                            <el-select v-model="dialogCustomerForm.Cst_Sex" placeholder="請選擇">
                                <el-option value="男"></el-option>
                                <el-option value="女"></el-option>
                                <el-option value="未知"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地區" prop="Cst_Location" :rules="[
                            { required: true, message: '請選擇地區', trigger: 'change' }
                        ]">
                            <el-select v-model="dialogCustomerForm.Cst_Location" placeholder="請選擇">
                                <el-option v-for="(item, index) in $store.state.regionList" :key="index" :value="item.BC_Name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="出生年月" prop="Cst_BirthDay">
                            <el-date-picker
                                v-model="dialogCustomerForm.Cst_BirthDay"
                                type="date"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                                placeholder="選擇日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="grouping">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="職業" prop="Cst_Occupation" :rules="[
                            { pattern: /^[\u4e00-\u9fa5A-Za-z0-9 ]{0,100}$/, message: '請輸入格式為中文、英文、數字' }
                        ]">
                            <el-input v-model="dialogCustomerForm.Cst_Occupation" maxlength="100" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年收入" prop="Cst_Income">
                            <el-select v-model="dialogCustomerForm.Cst_Income" no-data-text="暫無數據" placeholder="請選擇">
                                <el-option v-for="(item, index) in $store.state.annualIncomeList" :key="index" :value="item.BO_Value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="學歷" prop="Cst_Education" :rules="[
                            { pattern: /^[\u4e00-\u9fa5A-Za-z0-9 ]{0,100}$/, message: '請輸入格式為中文、英文、數字' }
                        ]">
                            <el-input v-model="dialogCustomerForm.Cst_Education" maxlength="100" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="婚姻狀況" prop="Cst_Marriage">
                            <el-select v-model="dialogCustomerForm.Cst_Marriage" placeholder="請選擇">
                                <el-option value="未婚"></el-option>
                                <el-option value="已婚"></el-option>
                                <el-option value="離婚"></el-option>
                                <el-option value="未知"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="grouping">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="聯絡電話" prop="Mobile" :rules="[
                            {required: true, validator: checkPhone, trigger: 'blur' }
                        ]">
                            <el-input type="tel" v-model="dialogCustomerForm.Mobile" :maxlength="mobileMaxLength">
                                <el-select class="w80" v-model.trim="dialogCustomerForm.AreaCode" slot="prepend" @change="changeAreaCode">
                                    <el-option v-for="(item, index) in $store.state.areaCodeList" :key="index" :value="item.BO_Value"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="E-MAIL" prop="Cst_Email" :rules="[
                            { type: 'email', message: '請輸入正確的E-MAIL', trigger: ['blur','change'] }
                        ]">
                            <el-input v-model.trim="dialogCustomerForm.Cst_Email" maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="詳細地址" prop="Cst_Address">
                            <el-input v-model="dialogCustomerForm.Cst_Address" maxlength="150" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="備註" prop="Cst_Description">
                            <el-input v-model="dialogCustomerForm.Cst_Description" type="textarea" rows="3" maxlength="500" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeCustomerDialog">取消</el-button>
            <el-button type="primary" @click="confirmCustomerDialog('dialogCustomerForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VCustomerDialog',
        props: ['dialogCustomerTitle', 'customerData'],
        data() {
            return {
                dialogClueVisible: false,    //客户弹框是否显示
                mobileMaxLength: 8,  //联系电话最大长度
                mobileMinLength: 8,  //联系电话最小长度
                dialogCustomerForm: {   //客户表单
                    Cst_Code: '',   //主键
                    Cst_Name: '',   //姓名
                    Cst_NickyName: '',   //昵称
                    Cst_Sex: '',    //性别
                    Cst_Location: '',    //地区
                    Cst_BirthDay: '',  //出生年月
                    Cst_Occupation: '', //职业
                    Cst_Income: '',   //年收入
                    Cst_Education: '',  //学历
                    Cst_Marriage: '',  //婚姻状况
                    AreaCode: '+852',   //区号
                    Mobile: '',    //联络电话
                    Cst_Email: '',  //email
                    Cst_Address: '',    //详情地址
                    Cst_Description: '' //备注
                },
                pickerOptions: {    //出生日期限制
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        mounted() {
            this.showCustomerDialog('dialogCustomerForm');
        },
        methods: {
            //选择区号
            changeAreaCode(v) {
                switch(v) {
                    case '+86':
                        this.mobileMinLength = 11;
                        this.mobileMaxLength = 11;
                    break;
                    case '+852':
                    case '+853':
                        this.mobileMinLength = 8;
                        this.mobileMaxLength = 8;
                    break;
                    case '+886':
                        this.mobileMinLength = 8;
                        this.mobileMaxLength = 12;
                    break;
                }
            },
            //手机号验证
            checkPhone(rule, value, callback) {
                if (!value) {
                    return callback(new Error('請輸入聯絡電話'));
                }
                if (!Number.isInteger(+value)) {
                    return callback(new Error('請輸入正確格式的聯絡電話'));
                }
                if(this.mobileMinLength === this.mobileMaxLength && value.length !== this.mobileMaxLength) {
                    return callback(new Error('請輸入長度為' + this.mobileMaxLength + '位的聯絡電話'));
                }
                if(this.mobileMinLength !== this.mobileMaxLength && (value.length < 8 && value > 12)) {
                    return callback(new Error('請輸入長度為' + this.mobileMinLength + '-' + this.mobileMaxLength + '位的聯絡電話'));
                }
                return callback();
            },
            //编辑客户弹框-显示
            showCustomerDialog(formName) {
                this.$store.dispatch('getRegionData', '中國香港');
                this.$store.dispatch('getTypeData', '區號');
                this.$store.dispatch('getTypeData', '年收入');
                this.dialogCustomerForm = Object.assign({}, this.customerData, { Cst_BirthDay: this.customerData.Cst_BirthDay === '0001-01-01T00:00:00' ? '' : this.customerData.Cst_BirthDay});
                this.changeAreaCode(this.dialogCustomerForm.AreaCode)
                this.dialogClueVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //编辑客户弹框-确定
            confirmCustomerDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$post('/api/CustomerApi/UpdCustomer', this.dialogCustomerForm)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: '編輯成功'
                            });
                            this.dialogClueVisible = false;
                            this.$emit('hideCustomerDialog', true);
                        })
                        .catch(err => {

                        });
                    } else {
                        return false;
                    }
                });
            },
            //编辑客户弹框-关闭
            closeCustomerDialog() {
                this.dialogClueVisible = false;
                this.$emit('hideCustomerDialog');
            }
        }
    }
</script>