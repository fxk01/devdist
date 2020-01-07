<!-- 团队管理-销售总监 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_team_management_hover.png" />團隊管理</div>
            <div class="v-top-operation" slot="correlation">
                <el-button class="btn-ec0928" type="primary" size="mini" icon="el-icon-plus" @click="showTeamDialog('新建團隊')">新建團隊</el-button>
            </div>
        </v-top>
        <div class="content">
            <el-table :data="tableData" empty-text="暫無數據">
                <el-table-column label="團隊名稱" prop="BT_Name" align="center"></el-table-column>
                <el-table-column label="負責人" prop="ManagerName" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="showTeamDialog('編輯團隊', scope.row)">編輯</el-button>
                        <el-button v-if="!scope.row.ManagerName" type="primary" size="mini" @click="showTeamDialog('設置負責人', scope.row)">設置負責人</el-button>
                        <el-button v-if="scope.row.ManagerName" type="primary" size="mini" @click="showTeamDialog('更換負責人', scope.row)">更換負責人</el-button>
                        <el-button type="danger" size="mini" @click="delTeam(scope.row)" :disabled="scope.row.IsHasMember">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-if="total > 0">
                <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
                </el-pagination>
            </div>
        </div>
        <!-- 新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框 -->
        <v-team-dialog v-if="isTeamDialog" :dialogTeamTitle="dialogTeamTitle" :dialogTeamData="dialogTeamData" @hideTeamDialog="hideTeamDialog"></v-team-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VTeamDialog from '@/components/common/management/VTeamDialog.vue';
    export default {
        data() {
            return {
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
                isTeamDialog: false,   //新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框是否显示
                dialogTeamTitle: '',   //新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框标题
                dialogTeamData: {} //新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框数据
            }
        },
        components: {
            VTop,
            VTeamDialog
        },
        mounted() {
            this.getData();
        },
        methods: {
            //获取数据列表
            getData() {
                const params = {
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/BasicsApi/GetPageTeam', params)
                .then((res) => {
                    this.total = res.TotalCount;
                    this.tableData = res.Datas;
                });
            },
            //查詢
            queryData() {
                this.PageIndex = 1;
                this.PageSize = 10;
                this.getData();
            },
            //切换当前页数
            handleCurrentChange(v) {
                this.PageIndex = v;
                this.getData();
            },
            //切换页条数
            changeSize(v) {
                this.PageIndex = 1;
                this.PageSize = v;
                this.getData();
            },
            //新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框-显示
            showTeamDialog(str = '', obj = {}) {
                this.dialogTeamTitle = str;
                this.dialogTeamData = obj;
                this.isTeamDialog = true;
            },
            //新建团队弹框、编辑团队弹框、设置负责人弹框、更换负责人弹框-隐藏
            hideTeamDialog(v) {
                if(v) {
                    this.queryData();
                }
                this.isTeamDialog = false;
            },
            //删除团队
            delTeam(obj) {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定刪除團隊【' + obj.BT_Name + '】嗎?'),
                        h('div', {style: 'fontSize:12px;'}, '刪除後無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/BasicsApi/DelTeam', { BT_ID: obj.BT_ID })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '刪除成功'
                        });
                        this.queryData();
                    });
                }).catch(() => {
                        
                });
            }
        }
    }
</script>

<style scoped>
    .btn-weird, .btn-weird:hover {
        color: #409eff;
    }
</style>