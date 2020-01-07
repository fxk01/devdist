<!-- 添加员工弹框、编辑员工弹框 -->
<template>
    <el-dialog class="dialog-component" :title="dialogStaffTitle" :visible.sync="dialogStaffVisible" :close-on-click-modal="false" @close="closeStaffDialog">
        <el-form :model="dialogStaffForm" ref="dialogStaffForm" label-width="100px">
            <template v-if="!dialogStaffType">
                <el-form-item v-if="this.dialogStaffTitle === '添加員工'" label="員工姓名：" prop="Stf_Name" :rules="[
                    { required: true, message: '請輸入員工姓名', trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5A-Za-z0-9 ]{1,20}$/, message: '請輸入格式為中文、英文、數字' }
                ]">
                    <el-input v-model="dialogStaffForm.Stf_Name" maxlength="20" />
                </el-form-item>
                <el-form-item v-else label="員工姓名：" prop="Stf_Name">{{dialogStaffForm.Stf_Name}}</el-form-item>
                <el-form-item v-if="this.dialogStaffTitle === '添加員工'" label="賬號：" prop="BS_LoginID" :rules="[
                    { required: true, message: '請輸入賬號', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9]{0,20}$/, message: '請輸入格式為英文、數字' }
                ]">
                    <el-input v-model="dialogStaffForm.BS_LoginID" maxlength="20" />
                </el-form-item>
                <el-form-item label="聯絡電話：" prop="Mobile" :rules="[
                    {required: true, validator: checkPhone, trigger: 'blur' }
                ]">
                    <el-input type="tel" v-model="dialogStaffForm.Mobile" :maxlength="mobileMaxLength">
                        <el-select class="w80" v-model="dialogStaffForm.AreaCode" slot="prepend" @change="changeAreaCode">
                            <el-option v-for="(item, index) in $store.state.areaCodeList" :key="index" :value="item.BO_Value"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="E-MAIL：" prop="BS_Email" :rules="[
                    { required: true, message: '請輸入E-MAIL', trigger: 'blur' },
                    { type: 'email', message: '請輸入正確的E-MAIL', trigger: ['blur','change'] }
                ]">
                    <el-input v-model="dialogStaffForm.BS_Email" maxlength="100" />
                </el-form-item>
            </template>
            <template v-if="dialogStaffType === '銷售主管'">
                <el-form-item label="員工姓名：" prop="BT_ManagerID" :rules="[
                    { required: true, message: '請選擇員工姓名', trigger: 'change' }
                ]">
                    <el-select v-model="dialogStaffForm.BT_ManagerID" filterable no-data-text="暫無數據" placeholder="請選擇">
                        <el-option v-for="(item, index) in dialogStaffList" :key="index" :label="item.Stf_Name" :value="item.Stf_ID"></el-option>
                    </el-select>
                </el-form-item>
            </template>
        </el-form>
        <div slot="footer" align="center">
            <el-button @click="closeStaffDialog">取消</el-button>
            <el-button type="primary" @click="confirmStaffDialog('dialogStaffForm')">確定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'VStaffDialog',
        props: ['dialogStaffTitle', 'dialogStaffType', 'dialogStaffData'],
        data() {
            return {
                dialogStaffVisible: false,    //员工弹框是否显示
                dialogStaffList: [],    //未分配员工列表
                mobileMaxLength: 8,  //联系电话最大长度
                mobileMinLength: 8,  //联系电话最小长度
                dialogStaffForm: {   //员工表单
                    Stf_Name: '',   //员工姓名
                    BS_LoginID: '',   //賬號
                    AreaCode: '+852',   //区号
                    Mobile: '',    //联络电话
                    BS_Email: '',  //email

                    BT_ManagerID: ''
                }
            }
        },
        mounted() {
            this.showStaffDialog('dialogStaffForm');
        },
        methods: {
            //获取未分配员工
            getStaffList() {
                this.$post('/api/BasicsApi/GetStafferList')
                .then((res) => {
                    this.dialogStaffList = res.Info;
                });
            },
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
            //添加员工弹框、编辑员工弹框-显示
            showStaffDialog(formName) {
                if(this.dialogStaffType === '銷售主管') {
                    this.getStaffList();
                } else {
                    this.$store.dispatch('getTypeData', '區號');
                    this.changeAreaCode(this.dialogStaffForm.AreaCode);
                }
                if(this.dialogStaffTitle === '編輯員工') {
                    this.dialogStaffForm = Object.assign({}, this.dialogStaffData);
                    this.changeAreaCode(this.dialogStaffForm.AreaCode);
                }
                this.dialogStaffVisible = true;
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                });
            },
            //添加员工弹框、编辑员工弹框-确定
            confirmStaffDialog(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '', params = {};
                        if(this.dialogStaffTitle === '添加員工') {
                            if(this.dialogStaffType === '銷售主管') {
                                url = '/api/BasicsApi/AddTeamMember';
                                params = {
                                    Stf_ID: this.dialogStaffForm.BT_ManagerID
                                };
                            } else {
                                url = '/api/BasicsApi/AddStaffer';
                                params = this.dialogStaffForm;
                            }
                        } else if(this.dialogStaffTitle === '編輯員工') {
                            url = '/api/BasicsApi/UpdStaffer';
                            params = Object.assign({}, this.dialogStaffForm, { Stf_ID: this.dialogStaffData.Stf_ID });
                        }
                        this.$post(url, params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: this.dialogStaffTitle + '成功'
                            });
                            this.dialogStaffVisible = false;
                            this.$emit('hideStaffDialog', true);
                        });
                    } else {
                        return false;
                    }
                });
            },
            //添加员工弹框、编辑员工弹框-关闭
            closeStaffDialog() {
                this.dialogStaffVisible = false;
                this.$emit('hideStaffDialog');
            }
        }
    }
</script>