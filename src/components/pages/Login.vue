<!-- 登录 -->
<template>
    <div class="login-wrap">
        <div class="ms-title">
            <img src="static/images/logo_01.png" />
        </div>
        <div class="ms-login">
            <h3 class="title">欢迎 登錄CRM系統</span></h3>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
                <el-form-item prop="username">
                    <input class="text" type="text" v-model.trim="ruleForm.username" maxlength="20" @keyup.enter="submitForm('ruleForm')" placeholder="賬號" />
                </el-form-item>
                <el-form-item prop="password">
                    <input class="text" :type="isType ? 'password' : 'text'" v-model.trim="ruleForm.password" maxlength="16" @keyup.enter="submitForm('ruleForm')" placeholder="密碼" />
                    <i style="display:flex;position:absolute;top:1px;right:0;width:30px;height:46px;text-align:center;align-items:center;" @click="changeType">
                        <img :src="isType ? 'static/images/comm/icon_close.png' : 'static/images/comm/icon_open.png'" />
                    </i>
                    <span style="position:absolute;top:40px;right:0;font-size:12px;color:#F56C6C;">密碼區分大小寫</span>
                </el-form-item>
                <div id="slide_box" style="width:100%">
                    <div id="slide_xbox">
                        <div id="btn">
                            <i class="iconfont icon-double-right"></i>
                            <img src="" alt="">
                        </div>
                    </div>
                    请按住滑块，拖动到最右边
                </div>
                <input class="login-btn" type="button" v-if="isShowLogin" value="登錄" @click="submitForm('ruleForm')" />
                <input class="login-btn" type="button" style="background-color:#cccccc;" v-else value="登錄" />
            </el-form>
            <div align="center">
                <router-link class="forgetpassword" to="forgetpassword">忘記賬號密碼？</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { CryptoJS } from '../../../static/js/aes'
    export default {
        name: 'login',
        data: function(){
            return {
                isType: true,
                sliderValue: 0,
                sliderDisabled: false,
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '請輸入賬號', trigger: 'blur' },
                        { pattern: /^[A-Za-z0-9]{0,20}$/, message: '請輸入格式為英文、數字', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '請輸入密碼', trigger: 'blur' },
                        { pattern: /^[A-Za-z0-9]{6,20}$/, message: '请输入长度为6-16位的數字、字母', trigger: 'blur' }
                    ]
                },
                locked:'',
                isyanzhen:false,
                isShowLogin: true
            }
        },
        mounted(){
            this.isa()
            var brVersion = this.getBroswer()
            if (brVersion.broswer.indexOf('Chrome') < 0 && brVersion.broswer.indexOf('Firefox') < 0) {
                this.$message({
                    message: '該系統只支持Chrome或FireFox瀏覽器',
                    type: 'error'
                });
                this.isShowLogin = false
            }
        },
        methods: {
            //切换明码密码
            changeType() {
                this.isType = !this.isType;
            },
            getBroswer () {
                var sys = {};
                var ua = navigator.userAgent.toLowerCase();
                var s;
                (s = ua.match(/edge\/([\d.]+)/)) ? sys.edge = s[1] :
                (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1] :
                (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
                (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
                (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
                if (sys.edge) return { broswer: "Edge", version: sys.edge };
                if (sys.ie) return { broswer: "IE", version: sys.ie };
                if (sys.firefox) return { broswer: "Firefox", version: sys.firefox };
                if (sys.chrome) return { broswer: "Chrome", version: sys.chrome };
                if (sys.opera) return { broswer: "Opera", version: sys.opera };
                if (sys.safari) return { broswer: "Safari", version: sys.safari };
                return { broswer: "", version: "0" };
            },
            isa(){
                $('#slide_box').hide()
            },
            slide() {
                var $this = this
                var slideBox = $('#slide_box')[0];
                var slideXbox = $('#slide_xbox')[0];
                var btn = $('#btn')[0];
                var slideBoxWidth = slideBox.offsetWidth;
                var btnWidth = btn.offsetWidth;
                //pc端
                btn.ondragstart = function () {
                    return false;
                };
                btn.onselectstart = function () {
                    return false;
                };
                btn.onmousedown = function (e) {
                    var disX = e.clientX - btn.offsetLeft;
                    document.onmousemove = function (e) {
                        var objX = e.clientX - disX + btnWidth;
                        if (objX < btnWidth) {
                            objX = btnWidth
                        }
                        if (objX > slideBoxWidth) {
                            objX = slideBoxWidth
                        }
                        $('#slide_xbox').width(objX + 'px');
                    };
                    document.onmouseup = function (e) {
                        var objX = e.clientX - disX + btnWidth;
                        if (objX < slideBoxWidth) {
                            objX = btnWidth;
                        } else {
                            objX = slideBoxWidth;
                            $this.locked = true;
                            $('#slide_xbox').html('验证通过');
                            $this.isyanzhen = false
                        }
                        $('#slide_xbox').width(objX + 'px');
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            },
            submitForm(formName) {
                let $this = this;
                $this.$message.closeAll();
                if($this.isyanzhen){
                    $this.isyanzhen = true
                    $this.$message({
                        message: '請先驗證',
                        type: 'error'
                    });
                    return;
                }
                $this.$refs[formName].validate((valid) => {
                    if (valid) {
                        $this.$axios.post('/api/LoginApi/GetLoginKey').then((res) => {
                            if(res.data.IsSuccess) {
                                const params = {
                                    LoginID: $this.encrypt($this.ruleForm.username, res.data.LK_Key),
                                    Pwd: $this.encrypt($this.ruleForm.password, res.data.LK_Key),
                                    Guid: res.data.LK_Guid,
                                    RLG_PlatForm: 1
                                }
                                $this.$axios.post('/api/LoginApi/Login', params).then((res) => {
                                    if(res.data.IsSuccess) {
                                        sessionStorage.setItem('fc_userid', res.data.ID);
                                        sessionStorage.setItem('fc_username', $this.ruleForm.username);
                                        sessionStorage.setItem('fc_token', res.data.Token);
                                        sessionStorage.setItem('fc_staffIdentity', res.data.PostName);
                                        sessionStorage.setItem('fc_staffName', res.data.StfName);
                                        let path = '';
                                        switch(res.data.PostName) {
                                            case '銷售總監': path = '/workbenchGm'; break;
                                            case '銷售主管':  path = '/workbenchBm'; break;
                                            case '保險代理人': path = '/workbenchAm'; break;
                                            case 'HR': path = '/staffHrIndex'; break;
                                            default: path = '/';
                                        }
                                        $this.$router.push(path);
                                    } else {
                                        if(res.data.Message=='需要验证'){
                                            $this.isyanzhen = true
                                            $('#slide_box').show()
                                            $('#slide_box').html('<div style="width: 50px;height: 42px;text-align: center;line-height: 42px;font-size: 16px;color: #fff;position: absolute;background: #198CFF;" id="slide_xbox"><div id="btn" style="cursor: pointer;width: 50px;height: 42px;background-color: #fff;float: right;-webkit-box-shadow: 0px 0px 15px 0px #ddd;-moz-box-shadow: 0px 0px 15px 0px #ddd;box-shadow: 0px 0px 15px 0px #ddd;color: #8a8c97;"><i class="iconfont icon-double-right"></i><img src="" alt=""></div></div>请按住滑块，拖动到最右边')
                                            $this.locked = false;
                                            $this.slide()
                                        }else if(res.data.Message=='您一天登录失败超过上限，建议找回密码'){
                                            $this.$message({
                                                message: res.data.Message,
                                                type: 'error'
                                            });
                                            $('#slide_box').show()
                                            $('#slide_box').html('<div style="width: 50px;height: 42px;text-align: center;line-height: 42px;font-size: 16px;color: #fff;position: absolute;background: #198CFF;" id="slide_xbox"><div id="btn" style="cursor: pointer;width: 50px;height: 42px;background-color: #fff;float: right;-webkit-box-shadow: 0px 0px 15px 0px #ddd;-moz-box-shadow: 0px 0px 15px 0px #ddd;box-shadow: 0px 0px 15px 0px #ddd;color: #8a8c97;"><i class="iconfont icon-double-right"></i><img src="" alt=""></div></div>请按住滑块，拖动到最右边')
                                            $this.locked = false;
                                            $this.isyanzhen = true
                                            $this.slide()
                                        }else{
                                            $this.$message({
                                                message: res.data.Message,
                                                type: 'error'
                                            });
                                        }
                                        
                                    }
                                })
                            } else {
                                $this.$message({
                                    message: res.data.Message,
                                    type: 'error'
                                });
                            }
                        })
                    }
                });
            },
            encrypt(word, key) {
                var key = CryptoJS.enc.Utf8.parse(key); //32位
                var iv = CryptoJS.enc.Utf8.parse("1234567890000000");//16位
                var encrypted = '';
                if (typeof (word) == 'string') {
                    var srcs = CryptoJS.enc.Utf8.parse(word);
                    encrypted = CryptoJS.AES.encrypt(srcs, key, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                } else if (typeof (word) == 'object') {//对象格式的转成json字符串
                    data = JSON.stringify(word);
                    var srcs = CryptoJS.enc.Utf8.parse(data);
                    encrypted = CryptoJS.AES.encrypt(srcs, key, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    })
                }
                return encrypted.ciphertext.toString();
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width: 100%;
        height: 100%;
        background: url("../../assets/bg/login_bg.png") no-repeat center;
        background-size: cover;
    }
    .ms-title{
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -360px;
        text-align: center;

    }
    .ms-login{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 580px;
        height: 410px;
        margin: -250px 0 0 -290px;
        padding: 50px 90px;
        background: #fff;
        box-sizing: border-box;
    }
    .ms-login .title {
        margin-bottom: 50px;
        font-size: 24px;
        font-weight: 500;
        color: #616161;
        text-align: center;
    }
    .ms-login .el-form-item {
        margin-bottom: 20px;
    }
    .ms-login .text {
        padding: 0 10px;
        width: 378px;
        height: 46px;
        font-size: 14px;
        border: 1px solid #616161;
    }
    .ms-login .login-btn{
        margin-bottom: 20px;
        width: 100%;
        height: 48px;
        font-size: 16px;
        color: #fff;
        border: 0;
        border-radius: 5px;
        background: #EF3737;
    }
    .ms-login .forgetpassword {
        font-size: 14px;
        color: #616161;   
    }
    #slide_box {
        width: 70%;
        height: 42px;
        text-align: center;
        line-height: 42px;
        font-size: 14px;
        color: #717171;
        background-color: #e8e8e8;
        border: none;
        margin-bottom: 20px;
    }

    #slide_xbox {
        width: 50px;
        height: 42px;
        text-align: center;
        line-height: 42px;
        font-size: 16px;
        color: #fff;
        position: absolute;
        background: #198CFF;
    }

    #btn {
        cursor: pointer;
        width: 50px;
        height: 42px;
        background-color: #fff;
        float: right;
        -webkit-box-shadow: 0px 0px 15px 0px #ddd;
        -moz-box-shadow: 0px 0px 15px 0px #ddd;
        box-shadow: 0px 0px 15px 0px #ddd;
        color: #8a8c97;

    }

    #btn > .iconfont {
        font-size: 20px;
    }
</style>