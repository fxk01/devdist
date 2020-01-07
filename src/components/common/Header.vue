<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <img class="logo" src="static/images/logo.png" alt="" />&ensp;<span style="line-height:75px;font-size:16px;"></span>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <slot name="headerMsg"></slot>
                <slot name="wordHome"></slot>

                <div class="user-avator"><img src="static/images/img.jpg"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <span style="color:#198CFF;">{{staffIdentity}}</span> {{staffName}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <router-link to="updatepassword">
                            <el-dropdown-item>修改密碼</el-dropdown-item>
                        </router-link>
                        <el-dropdown-item command="loginout">退出登錄</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                staffIdentity: sessionStorage.getItem('fc_staffIdentity'),   //职员身份
                staffName: sessionStorage.getItem('fc_staffName')    //职员姓名
            }
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    sessionStorage.removeItem('fc_username');
                    this.$router.push('/login');
                }
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            }
        }
    }
</script>
<style scoped>
    .header {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        z-index: 2;
        height: 60px;
        font-size: 22px;
        color: #fff;
        background: #0E1A35;
        box-shadow: 3px 0 10px rgba(0,0,0,0.08);
    }
    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 60px;
        background: #0E1A35;
    }
    .header .logo{
        float: left;
        margin-top: 13px;
    }
    .header-right{
        float: right;
        padding-right: 30px;
    }
    .header-user-con{
        display: flex;
        height: 60px;
        align-items: center;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
