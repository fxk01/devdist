<!-- 新建线索弹框、编辑线索弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogClueTitle" :visible.sync="dialogClueVisible" :close-on-click-modal="false" @close="closeClueDialog">
        <el-form :model="dialogClueForm" ref="dialogClueForm" label-width="80px">
            <div class="grouping">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="Busi_CName" :rules="[
                            { required: true, message: '請輸入姓名', trigger: 'blur' },
                            { pattern: /^(?!(\s+$))/, message: '請輸入姓名' },
                            { pattern: /^[\u4e00-\u9fa5A-Za-z ]{1,50}$/, message: '請輸入格式為中文、英文' }
                        ]">
                            <el-input v-model="dialogClueForm.Busi_CName" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="昵稱" prop="Busi_CNickyName" :rules="[
                            { pattern: /^[\u4e00-\u9fa5A-Za-z ]{0,50}$/, message: '請輸入格式為中文、英文' }
                        ]">
                            <el-input v-model="dialogClueForm.Busi_CNickyName" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="性別" prop="Busi_CSex">
                            <el-select v-model="dialogClueForm.Busi_CSex" placeholder="請選擇">
                                <el-option value="男"></el-option>
                                <el-option value="女"></el-option>
                                <el-option value="未知"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地區" prop="Busi_CLocation" :rules="[
                            { required: true, message: '請選擇地區', trigger: 'change' }
                        ]">
                            <el-select v-model="dialogClueForm.Busi_CLocation" placeholder="請選擇">
                                <el-option v-for="(item, index) in $store.state.regionList" :key="index" :value="item.BC_Name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="出生年月" prop="Busi_CBirthDay">
                            <el-date-picker
                                v-model="dialogClueForm.Busi_CBirthDay"
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
                        <el-form-item label="職業" prop="Busi_COccupation" :rules="[
                            { pattern: /^[\u4e00-\u9fa5A-Za-z0-9 ]{0,100}$/, message: '請輸入格式為中文、英文、數字' }
                        ]">
                            <el-input v-model="dialogClueForm.Busi_COccupation" maxlength="100" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年收入" prop="Busi_CIncome">
                            <el-select v-model="dialogClueForm.Busi_CIncome" no-data-text="暫無數據" placeholder="請選擇">
                                <el-option v-for="(item, index) in $store.state.annualIncomeList" :key="index" :value="item.BO_Value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="學歷" prop="Busi_CEducation" :rules="[
                            { pattern: /^[\u4e00-\u9fa5A-Za-z0-9 ]{0,100}$/, message: '請輸入格式為中文、英文、數字' }
                        ]">
                            <el-input v-model="dialogClueForm.Busi_CEducation" maxlength="100" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="婚姻狀況" prop="Busi_CMarriage">
                            <el-select v-model="dialogClueForm.Busi_CMarriage" placeholder="請選擇">
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
                            <el-input type="tel" v-model.trim="dialogClueForm.Mobile" :maxlength="mobileMaxLength">
                                <el-select class="w80" v-model="dialogClueForm.AreaCode" slot="prepend" @change="changeAreaCode">
                                    <el-option v-for="(item, index) in $store.state.areaCodeList" :key="index" :value="item.BO_Value"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="E-MAIL" prop="Busi_CEmail" :rules="[
                            { type: 'email', message: '請輸入正確的E-MAIL', trigger: ['blur','change'] }
                        ]">
                            <el-input v-model.trim="dialogClueForm.Busi_CEmail" maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="詳細地址" prop="Busi_CAddress">
                            <el-input v-model="dialogClueForm.Busi_CAddress" maxlength="150" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="備註" prop="Busi_CDescription">
                            <el-input v-model="dialogClueForm.Busi_CDescription" type="textarea" rows="3" maxlength="500" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeClueDialog">取消</el-button>
            <el-button type="primary" @click="confirmClueDialog('dialogClueForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VClueDialog',
        props: ['dialogClueTitle', 'clueData'],
        data() {
            return {
                dialogClueVisible: false,    //线索弹框是否显示
                dialogRegionList: [],   //地区列表
                mobileMaxLength: 8,  //联系电话最大长度
                mobileMinLength: 8,  //联系电话最小长度
                dialogClueForm: {   //线索表单
                    Busi_CID: '',   //主键
                    Busi_CName: '',   //姓名
                    Busi_CNickyName: '',   //昵称
                    Busi_CSex: '',    //性别
                    Busi_CLocation: '',    //地区
                    Busi_CBirthDay: '',  //出生年月
                    Busi_COccupation: '', //职业
                    Busi_CIncome: '',   //年收入
                    Busi_CEducation: '',  //学历
                    Busi_CMarriage: '',  //婚姻状况
                    AreaCode: '+852',   //区号
                    Mobile: '',    //联络电话
                    Busi_CEmail: '',  //email
                    Busi_CAddress: '',    //详情地址
                    Busi_CDescription: '' //备注
                },
                pickerOptions: {    //出生日期限制
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                }
            }
        },
        mounted() {
            this.showClueDialog('dialogClueForm');
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
            //线索弹框-显示
            showClueDialog(formName) {
                this.$store.dispatch('getRegionData', '中國香港');
                this.$store.dispatch('getTypeData', '區號');
                this.$store.dispatch('getTypeData', '年收入');
                if(this.dialogClueTitle === '編輯線索') {
                    this.dialogClueForm = Object.assign({}, this.clueData, { Busi_CBirthDay: this.clueData.Busi_CBirthDay === '0001-01-01T00:00:00' ? '' : this.clueData.Busi_CBirthDay});
                }
                this.changeAreaCode(this.dialogClueForm.AreaCode)
                this.dialogClueVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //线索弹框-确定
            confirmClueDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = Object.assign({}, this.dialogClueForm);
                        let url = '';
                        if(this.dialogClueTitle === '新建線索') {
                            url = '/api/ClueApi/AddClue';
                        } else {
                            url = 'api/ClueApi/UpdClue';
                        }
                        this.$post(url, params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: this.dialogClueForm.Busi_CID ? '編輯成功' : '新建成功'
                            });
                            this.dialogClueVisible = false;
                            this.$emit('hideClueDialog', true);
                        })
                        .catch(err => {

                        });
                    } else {
                        return false;
                    }
                });
            },
            //线索弹框-关闭
            closeClueDialog() {
                this.dialogClueVisible = false;
                this.$emit('hideClueDialog');
            }
        }
    }
</script>