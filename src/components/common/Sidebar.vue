<template>
    <div v-if="msgSidebar">
        <div class="sidebar">
            <el-menu class="sidebar-el-menu" :default-active="onRoutes" :default-openeds="defaultOpeneds" :collapse="collapse" background-color="#0E1A35" text-color="#fff" active-text-color="#fff" router>
                <template v-for="(item, index) in navList">
                    <template v-if="item.List">
                        <el-submenu :index="item.RL_Route" :key="index">
                            <template slot="title">
                                <i class="icon"><img :src="item.RL_Icon" alt="" style="padding-left:6px"/></i>
                                <span slot="title" style="margin-left:14px;">{{ item.RL_LevelName }}</span>
                            </template>
                            <template v-for="(subItem, subIndex) in item.List">
                                <el-menu-item :index="subItem.Rit_Route" :key="subIndex">
                                    <span style="margin-left:24px;font-size:14px;">{{ subItem.Rit_RName }}</span>
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="item.RL_Route" :key="index" style="padding-left:26px;">
                            <i class="icon"><img :src="item.RL_Icon" alt="" /></i>
                            <span slot="title" style="margin-left:8px;">{{ item.RL_LevelName }}</span>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </div>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                defaultOpeneds: [],
                collapse: false,
                navList: [],
                msgSidebar: true,
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        mounted() {
            this.switchNav();
            this.getNav();
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
        },
        methods: {
            switchNav() {
                this.cur = this.$route.path;
                if(this.cur === '/messageList') {
                    this.msgSidebar = false;
                    document.getElementsByClassName('content-box')[0].style.left = '0'
                } else {
                    this.msgSidebar = true;
                    document.getElementsByClassName('content-box')[0].style.left = '200px'
                }
            },
            //获取左边菜单栏
            getNav() {
                this.$post('/api/BasicsApi/ObtainUserJurisdiction', { RL_PlatForm: '後臺' }).then(res => {
                    if (res.IsSuccess) {
                        this.navList = this.navList.concat(res.levelList);
                    } else {
                        this.$message({
                            message: res.Message,
                            type: 'error'
                        });
                    }
                }).catch(err => {
                    
                });
            }
        },
        watch: {
          // 如果路由有变化，会再次执行该方法
          "$route": "switchNav"
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 60px;
        bottom:0;
        background-color: #0E1A35;
        overflow-y: scroll;
    }
    .sidebar .logo {
        display: block;
        margin: 40px auto;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 200px;
    }
    .sidebar .el-menu {
        height:100%;
    }
    .sidebar .el-menu li, .sidebar .el-menu >>> .el-submenu__title {
        font-size: 16px;
    }
    .sidebar .el-menu li .icon {
        display: inline-block;
        width: 24px;
        text-align: center;
    }
    .sidebar .el-menu--inline li {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }
    .el-menu-item.is-active {
        background: #122143 !important;
    }
    .el-menu-item.is-active:before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 2px;
        background-color: #198cff;
    }
</style>
