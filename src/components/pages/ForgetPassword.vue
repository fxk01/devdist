<template>
    <!-- 忘记密码 -->
    <div class="reset-wrap">
        <div class="ms-title">
            <img src="static/images/logo_01.png" />
        </div>
        <div class="ms-reset">
            <!-- <h3 class="title">找回您的賬號或密碼</h3> -->
            <div class="reset-head">
                <el-radio-group v-model="switchRadio" @change="changeRadio">
                    <el-radio :label="1">重置密碼</el-radio>
                    <el-radio :label="2">找回登錄賬號</el-radio>
                </el-radio-group>
            </div>
            <div class="reset-main">
                <template v-if="switchRadio == 1">
                    <el-form :model="passwordForm" ref="passwordForm" :rules="passwordFormRules">
                        <el-form-item prop="pMobile" :rules="[
                            { required: true, message: '請輸入手提號碼', trigger: ['blur', 'change'] },
                            { pattern: /^[0-9]{0,11}$/, message: '请输入正确格式的手提號碼', trigger: ['blur', 'change'] }
                        ]">
                            <label class="label">手提號碼：</label>
                            <el-select class="w90" v-model="passwordForm.pAreaCode">
                                <el-option label="+86" value="86"></el-option>
                                <el-option label="+852" value="852"></el-option>
                                <el-option label="+853" value="853"></el-option>
                                <el-option label="+886" value="886"></el-option>
                            </el-select>
                            <el-input maxlength="11" v-model.trim="passwordForm.pMobile" auto-complete="new-password" placeholder="輸入您的手提號碼"></el-input>
                            <el-button class="code-btn" @click="sendPasswordCode('passwordForm')" :disabled="passwordForm.btnDisabled"><span v-html="passwordForm.btnText"></span></el-button>
                        </el-form-item>
                        <el-form-item prop="pCode" :rules="[
                            { required: true, message: '請輸入驗證碼', trigger: ['blur', 'change'] },
                            { pattern: /^[0-9]{0,6}$/, message: '请输入格式為數字的驗證碼', trigger: ['blur', 'change'] }
                        ]">
                            <label class="label">驗證碼：</label>
                            <el-input maxlength="6" v-model.trim="passwordForm.pCode" auto-complete="new-password" placeholder="輸入您收到的驗證碼"></el-input>
                        </el-form-item>
                        <el-form-item prop="pPassword1" :rules="[
                            { required: true, message: '請輸入新密碼', trigger: ['blur', 'change'] },
                            { pattern: /^[A-Za-z0-9]{6,16}$/, message: '请输入长度为6-16位的數字、字母', trigger: ['blur', 'change'] }
                        ]">
                            <label class="label">新密碼：</label>
                            <el-input maxlength="16" type="password" v-model.trim="passwordForm.pPassword1" auto-complete="new-password" placeholder="輸入新密碼"></el-input>
                        </el-form-item>
                        <el-form-item prop="pPassword2">
                            <label class="label">確認新密碼：</label>
                            <el-input maxlength="16" type="password" v-model.trim="passwordForm.pPassword2" auto-complete="new-password" placeholder="輸入確認新密碼"></el-input>
                        </el-form-item>
                        <el-button type="primary" class="reset-btn" @click="resetPassword('passwordForm')">重置密碼</el-button>
                    </el-form>
                </template>
                <template v-else-if="switchRadio == 2">
                    <el-form v-if="Object.keys(accountInfo).length" label-width="100px" label-position="right" style="padding:60px 0;">
                        <el-form-item label="姓名：">{{accountInfo.Stf_Name}}</el-form-item>
                        <el-form-item label="賬號：">{{accountInfo.BS_LoginID}}</el-form-item>
                    </el-form>
                    <el-form v-else :model="accountForm" ref="accountForm">
                        <el-form-item prop="aMobile" :rules="[
                            { required: true, message: '請輸入手提號碼', trigger: ['blur', 'change'] },
                            { pattern: /^[0-9]{0,11}$/, message: '请输入正确格式的手提號碼', trigger: ['blur', 'change'] }
                        ]">
                            <label class="label">手提號碼：</label>
                            <el-select class="w90" v-model="accountForm.aAreaCode">
                                <el-option label="+86" value="86"></el-option>
                                <el-option label="+852" value="852"></el-option>
                                <el-option label="+853" value="853"></el-option>
                                <el-option label="+886" value="886"></el-option>
                            </el-select>
                            <el-input maxlength="11" v-model.trim="accountForm.aMobile" placeholder="輸入您的手提號碼"></el-input>
                            <el-button class="code-btn" @click="sendAccountCode('accountForm')" :disabled="accountForm.btnDisabled"><span v-html="accountForm.btnText"></span></el-button>
                        </el-form-item>
                        <el-form-item prop="aCode" :rules="[
                            { required: true, message: '請輸入驗證碼', trigger: ['blur', 'change'] },
                            { pattern: /^[0-9]{0,6}$/, message: '请输入格式為數字的驗證碼', trigger: ['blur', 'change'] }
                        ]">
                            <label class="label">驗證碼：</label>
                            <el-input maxlength="6" v-model.trim="accountForm.aCode" placeholder="輸入您收到的驗證碼"></el-input>
                        </el-form-item>
                        <el-button type="primary" class="reset-btn" @click="retrievingAccount('accountForm')">找回登錄賬號</el-button>
                    </el-form>
                </template>
            </div>
            <router-link class="return-login" to="/login">返回登錄</router-link>
        </div>

        <el-dialog title="重置密碼" class="dialog-big" :visible.sync="sendVisible" :close-on-click-modal="false" width="400px">
            <div>您的賬號及密碼已經發送至您的手機，請登錄并及時修改您的密碼！</div>
            <div slot="footer">
                <router-link class="return-login" to="/login">返回登錄</router-link>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'forgetpassword',
        data() {
            
            let validatePPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('請輸入確認新密碼'));
                } else if (value !== this.passwordForm.pPassword1) {
                    callback(new Error('兩次輸入密碼不一致'));
                } else {
                    callback();
                }
            };

            return {
                sendVisible: false,
                switchRadio: 1,
                passwordForm: {
                    pAreaCode: '86',
                    pMobile: '',
                    pCode: '',
                    pPassword1: '',
                    pPassword2: '',
                    btnText: '發送驗證碼',
                    btnDisabled: false
                },
                passwordFormRules: {
                    pPassword2: [
                        { validator: validatePPassword, trigger: ['blur', 'change'] },
                        { pattern: /^[A-Za-z0-9]{6,16}$/, message: '请输入长度为6-16位的數字、字母', trigger: ['blur', 'change'] }
                    ]
                },
                accountForm: {
                    aAreaCode: '86',
                    aMobile: '',
                    aCode: '',
                    btnText: '發送驗證碼',
                    btnDisabled: false
                },
                accountInfo: {},
                headers: { 'Authorization': sessionStorage.getItem('fc_token') }    //请求头
            }
        },
        methods: {
            //切换（重置密码、找回登录账号）
            changeRadio(v) {
                this.$message.closeAll();
                this.accountInfo = [];
                if(v == 1) {
                   this.$refs['passwordForm'].resetFields();
                } else if(v == 2) {
                   this.$refs['accountForm'].resetFields();
                }
            },
            //发送验证码（重置密码）
            sendPasswordCode(formName) {
                let $this = this;
                $this.$message.closeAll();
                $this.$refs[formName].validateField('pMobile', (valid) => {
                    if (valid) {
                        return false;
                    } else {
                        $this.passwordForm.btnDisabled = true;
                        const params = {
                            Code: $this.passwordForm.pAreaCode,
                            Mobi: $this.passwordForm.pMobile
                        };
                        $this.$axios({
                            method: 'post',
                            url: '/api/LoginApi/SendVerificationCode',
                            data: params,
                            headers: $this.headers
                        }).then((res) => {
                            if(res.data.IsSuccess) {
                                let second = 60;
                                $this.passwordForm.btnText = '發送驗證碼(<span class="c-red">' + second + '</span>)';
                                let time = setInterval(function() {
                                    second--;
                                    if(second > 0) {
                                        $this.passwordForm.btnText = '發送驗證碼(<span class="c-red">' + second + '</span>)';
                                    } else {
                                        clearInterval(time);
                                        $this.passwordForm.btnText = '發送驗證碼';
                                        $this.passwordForm.btnDisabled = false;
                                    }
                                }, 1000);
                            } else {
                                $this.passwordForm.btnDisabled = false;
                                $this.$message({
                                    message: res.data.Message,
                                    type: 'error'
                                });
                            }
                        }).catch((err) => {
                            if(err.response.status == 401) {
                                $this.comm.commReturnLogin($this);
                            }
                        });
                    }
                });
            },
            //重置密码
            resetPassword(formName) {
                let $this = this;
                $this.$message.closeAll();
                $this.$refs[formName].validate((valid) => {
                    if (valid) {
                        $this.$axios.post('/api/LoginApi/GetLoginKey').then((res) => {
                            if(res.data.IsSuccess) {
                                const params = {
                                    Code: $this.passwordForm.pAreaCode,
                                    Mobi: $this.passwordForm.pMobile,
                                    Verification: $this.passwordForm.pCode,
                                    Password: $this.comm.commEncrypt($this.passwordForm.pPassword2, res.data.LK_Key),
                                    Guid: res.data.LK_Guid
                                };
                                $this.$axios({
                                    method: 'post',
                                    url: '/api/LoginApi/ResetPassword',
                                    data: params,
                                    headers: $this.headers
                                }).then((res) => {
                                    if(res.data.IsSuccess) {
                                        //$this.$refs[formName].resetFields();
                                        $this.$message({
                                            message: '重置密碼成功',
                                            type: 'success',
                                            onClose: function() {
                                                $this.$router.push('/login');
                                            }
                                        });
                                    } else {
                                        $this.$message({
                                            message: res.data.Message,
                                            type: 'error'
                                        });
                                    }
                                }).catch((err) => {
                                    if(err.response.status == 401) {
                                        $this.comm.commReturnLogin($this);
                                    }
                                });
                            } else {
                                $this.$message({
                                    message: res.data.Message,
                                    type: 'error'
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            //发送验证码（找回登录账号）
            sendAccountCode(formName) {
                let $this = this;
                $this.$message.closeAll();
                $this.$refs[formName].validateField('aMobile', (valid) => {
                    if (valid) {
                        return false;
                    } else {
                        $this.accountForm.btnDisabled = true;
                        const params = {
                            Code: $this.accountForm.aAreaCode,
                            Mobi: $this.accountForm.aMobile
                        };
                        $this.$axios({
                            method: 'post',
                            url: '/api/LoginApi/SendVerificationCode',
                            data: params,
                            headers: $this.headers
                        }).then((res) => {
                            if(res.data.IsSuccess) {
                                let second = 60;
                                $this.accountForm.btnText = '發送驗證碼(<span class="c-red">' + second + '</span>)';
                                let time = setInterval(function() {
                                    second--;
                                    if(second > 0) {
                                        $this.accountForm.btnText = '發送驗證碼(<span class="c-red">' + second + '</span>)';
                                    } else {
                                        clearInterval(time);
                                        $this.accountForm.btnText = '發送驗證碼';
                                        $this.accountForm.btnDisabled = false;
                                    }
                                }, 1000);
                            } else {
                                $this.accountForm.btnDisabled = false;
                                $this.$message({
                                    message: res.data.Message,
                                    type: 'error'
                                });
                            }
                        }).catch((err) => {
                            if(err.response.status == 401) {
                                $this.comm.commReturnLogin($this);
                            }
                        });
                    }
                });
            },
            //找回账号
            retrievingAccount(formName) {
                let $this = this;
                $this.$message.closeAll();
                $this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = {
                            Code: $this.accountForm.aAreaCode,
                            Mobi: $this.accountForm.aMobile,
                            Verification: $this.accountForm.aCode
                        };
                        $this.$axios({
                            method: 'post',
                            url: '/api/LoginApi/RetrieveAccountNumber',
                            data: params,
                            headers: $this.headers
                        }).then((res) => {
                            if(res.data.IsSuccess) {
                                // $this.$message({
                                //     message: '登錄賬號已發送到您手機，請注意查收',
                                //     type: 'success',
                                //     onClose: function() {
                                //         $this.$router.push('/login');
                                //     }
                                // });
                                $this.accountInfo = res.data.Info;
                            } else {
                                $this.$message({
                                    message: res.data.Message,
                                    type: 'error'
                                });
                            }
                        }).catch((err) => {
                            if(err.response.status == 401) {
                                $this.comm.commReturnLogin($this);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .reset-wrap{
        position: relative;
        width: 100%;
        height: 100%;
        background: url("../../assets/bg/login_bg.png") no-repeat top center;
        background-size: cover;
    }
    .ms-title{
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -360px;
        text-align: center;
    }
    .ms-reset{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 650px;
        height: 500px;
        margin: -250px 0 0 -325px;
        padding: 50px;
        background: #fff;
        box-sizing: border-box;
    }
    .ms-reset .title {
        margin-bottom: 50px;
        font-size: 24px;
        font-weight: 500;
        color: #616161;
        text-align: center;
    }
    .ms-reset .reset-head {
        margin-bottom: 40px;
        text-align: center;
    }
    .ms-reset .el-form-item {
        margin-bottom: 20px;
    }
    .ms-reset .el-form-item .label {
        display: inline-block;
        width: 90px;
        text-align: right;
    }
    .ms-reset .el-form-item .el-input {
        width: 220px;
    }
    .ms-reset .el-form-item >>> .el-form-item__error {
        margin-left: 95px;
    }
    .ms-reset .el-form-item .code-btn {
        margin-left: 15px;
    }
    .ms-reset .reset-btn{
        margin: 0 0 50px 95px;;
        width: 220px;
        height: 35px;
    }
    .return-login {
        float: right;
        display: block;
        width: 120px;
        height: 34px;;
        line-height: 34px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        background: #67C23A;
    }
    .w90 {
        width: 90px;
    }
</style>