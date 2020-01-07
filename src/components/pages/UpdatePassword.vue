<template>
    <!-- 修改密码 -->
    <div class="reset-wrap">
        <div class="ms-title">
            <img src="static/images/logo_01.png" />
        </div>
        <div class="ms-reset">
            <h3 class="title">修改密碼</h3>
            <div class="reset-main">
                <el-form :model="passwordForm" ref="passwordForm" :rules="passwordFormRules">
                    <el-form-item prop="account" :rules="[
                        { required: true, message: '請輸入賬號', trigger: ['blur', 'change'] },
                        { pattern: /^[A-Za-z0-9]{0,20}$/, message: '請輸入格式為英文、數字', trigger: 'blur' }
                    ]">
                        <label class="label">賬號：</label>
                        <el-input v-model.trim="passwordForm.account" auto-complete="new-password" maxlength="20" placeholder="輸入賬號" disabled></el-input>
                    </el-form-item>
                    <el-form-item prop="oPassword" :rules="[
                        { required: true, message: '請輸入原密碼', trigger: ['blur', 'change'] },
                        { pattern: /^[A-Za-z0-9]{6,16}$/, message: '请输入长度为6-16位的數字、字母', trigger: ['blur', 'change'] }
                    ]">
                        <label class="label">原密碼：</label>
                        <el-input maxlength="16" type="password" v-model.trim="passwordForm.oPassword" auto-complete="new-password" placeholder="輸入原密碼"></el-input>
                    </el-form-item>
                    <el-form-item prop="nPassword1" :rules="[
                        { required: true, message: '請輸入新密碼', trigger: ['blur', 'change'] },
                        { pattern: /^[A-Za-z0-9]{6,16}$/, message: '请输入长度为6-16位的數字、字母', trigger: ['blur', 'change'] }
                    ]">
                        <label class="label">新密碼：</label>
                        <el-input maxlength="16" type="password" v-model.trim="passwordForm.nPassword1" auto-complete="new-password" placeholder="輸入新密碼"></el-input>
                    </el-form-item>
                    <el-form-item prop="nPassword2">
                        <label class="label">確認新密碼：</label>
                        <el-input maxlength="16" type="password" v-model.trim="passwordForm.nPassword2" auto-complete="new-password" placeholder="輸入確認新密碼"></el-input>
                    </el-form-item>
                    <el-button type="primary" class="reset-btn" @click="updatePassword('passwordForm')">修改密碼</el-button>
                </el-form>
            </div>
            <a class="return-login" href="javascript:window.history.go(-1);">返回</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'updatepassword',
        data() {
            
            let validatePPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('請輸入確認新密碼'));
                } else if (value !== this.passwordForm.nPassword1) {
                    callback(new Error('兩次輸入密碼不一致'));
                } else {
                    callback();
                }
            };

            return {
                passwordForm: {
                    account: sessionStorage.getItem('fc_username'),
                    oPassword: '',
                    nPassword1: '',
                    nPassword2: ''
                },
                passwordFormRules: {
                    nPassword2: [
                        { validator: validatePPassword, trigger: ['blur', 'change'] },
                        { pattern: /^[A-Za-z0-9]{6,16}$/, message: '请输入长度为6-16位的數字、字母', trigger: ['blur', 'change'] }
                    ]
                },
                headers: { 'Authorization': sessionStorage.getItem('fc_token') }    //请求头
            }
        },
        methods: {
            //修改密码
            updatePassword(formName) {
                let $this = this;
                $this.$message.closeAll();
                $this.$refs[formName].validate((valid) => {
                    if (valid) {
                        $this.$axios.post('/api/LoginApi/GetLoginKey').then((res) => {
                            if(res.data.IsSuccess) {
                                const params = {
                                    LoginName: $this.comm.commEncrypt($this.passwordForm.account, res.data.LK_Key),
                                    Password_Old: $this.comm.commEncrypt($this.passwordForm.oPassword, res.data.LK_Key),
                                    Password_New: $this.comm.commEncrypt($this.passwordForm.nPassword2, res.data.LK_Key),
                                    Guid: res.data.LK_Guid
                                };
                                $this.$axios({
                                    method: 'post',
                                    url: '/api/LoginApi/ModifyPassword',
                                    data: params,
                                    headers: $this.headers
                                }).then((res) => {
                                    if(res.data.IsSuccess) {
                                        $this.$message({
                                            message: '修改密碼成功',
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
        width: 350px;
    }
    .ms-reset .el-form-item >>> .el-form-item__error {
        margin-left: 95px;
    }
    .ms-reset .el-form-item .code-btn {
        margin-left: 15px;
    }
    .ms-reset .reset-btn{
        margin: 0 0 50px 95px;;
        width: 350px;
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