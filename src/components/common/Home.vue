<template>
    <div class="wrapper">
        <v-head>
            <template slot="headerMsg" v-if="headerMsg">
                <div style="cursor: pointer;">
                    <router-link to="/messageList">
                        <el-badge :value="getPromptInfoData['TipCount']" class="item" :hidden="getPromptInfoData['TipCount'] <= 0">
                            <img class="icon" src="@/assets/images/icon-msg.png" style="margin-top: 6px;"/>
                        </el-badge>
                        <span class="ax-u5136-text" style="padding-left: 5px;">消息</span>
                    </router-link>
                </div>
            </template>

            <template slot="wordHome" v-if="wordHome">
                <div style="cursor: pointer;">
                    <router-link to="/">
                        <img class="icon va-middle" src="@/assets/images/icon-home.png"/>
                        <span class="ax-u5136-text" style="padding-left: 5px;">工作台</span>
                    </router-link>
                </div>
            </template>
        </v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags v-show="false"></v-tags>
            <transition name="move" mode="out-in">
                <keep-alive :include="tagsList">
                    <router-view :key="$route.fullPath"></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from './bus';
    import { mapState } from 'vuex'
    export default {
        data(){
            return {
                tagsList: [],
                collapse: false,
                headerMsg: true,
                wordHome: false,
            }
        },
        components:{
            vHead, vSidebar, vTags
        },
        watch: {
            '$route':'getPath'
        },
        computed: mapState({
            getPromptInfoData: state => state.getPromptInfoData,
        }),
        created() {
            let name = this.$route.name;
            let routeItem = sessionStorage.getItem('fc_staffIdentity');
            if(name === 'messageList') {
                this.headerMsg = false;
                this.wordHome = true;
            } else {
                this.headerMsg = true;
                this.wordHome = false;
            }
            if(routeItem === 'HR' || routeItem === '保險代理人') {
                this.headerMsg = false;
            }
            this.hdMsgFuc();

            bus.$on('collapse', msg => {
                this.collapse = msg;
            });

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++) {
                    if(msg[i].path === '/assignCustomers') {
                        msg[i].name && arr.push(msg[i].path.split('/')[1]);
                    } else {
                        msg[i].name && arr.push(msg[i].name);
                    }
                }
                this.tagsList = arr;
            })
        },
        methods: {
            hdMsgFuc() {
                this.$store.dispatch('getPromptInfoFuc').then(() => {});
            },
            getPath() {
                let name = this.$route.name;
                let routeItem = sessionStorage.getItem('fc_staffIdentity');
                if(name === 'messageList') {
                    this.headerMsg = false;
                    this.wordHome = true;
                } else {
                    this.headerMsg = true;
                    this.wordHome = false;
                }
                if(routeItem === 'HR' || routeItem === '保險代理人') {
                    this.headerMsg = false;
                }
                this.hdMsgFuc();
            }
        }
    }
</script>
