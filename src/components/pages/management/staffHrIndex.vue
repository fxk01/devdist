<!-- 员工管理-HR -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_staff_management_hover.png" />員工管理</div>
            <div class="v-top-operation" slot="correlation">
                <el-button class="btn-ec0928" type="primary" size="mini" icon="el-icon-plus" @click="showStaffDialog('添加員工')">添加員工</el-button>
            </div>
        </v-top>
        <div class="condition">
            <table class="condition-table">
                <tr>
                    <th>角色</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="roleAll" size="mini" border :indeterminate="roleIndeter" @change="checkRoleAll">全部</el-checkbox>
                        <el-checkbox-group v-model="role" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkRole">
                            <el-checkbox v-for="(item, index) in roleList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>關鍵詞</th>
                    <td>
                        <el-input class="w200" v-model="keywords" size="mini" maxlength="10" placeholder="請輸入員工姓名" />
                    </td>
                </tr>
            </table>
            <div class="p10" align="center">
                <el-button class="btn-ec0928" type="primary" size="mini" @click="queryData">查詢</el-button>
                <el-button type="info" size="mini" @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="content">
            <el-table :data="tableData" empty-text="暫無數據">
                <el-table-column label="姓名" prop="Stf_Name" align="center"></el-table-column>
                <el-table-column label="聯絡電話" prop="BS_Mobile" align="center"></el-table-column>
                <el-table-column label="部門" prop="BT_Name" align="center"></el-table-column>
                <el-table-column label="角色" prop="Post_Name" align="center"></el-table-column>
                <el-table-column label="直屬上級" prop="ManagerName" align="center"></el-table-column>
                <el-table-column label="狀態" prop="Stf_Status" align="center"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.Stf_Status === '在職'" type="primary" size="mini" @click="showStaffDialog('編輯員工', scope.row)">編輯</el-button>
                        <el-button v-if="scope.row.Post_Name === '保險代理人' && scope.row.Stf_Status === '在職'" type="warning" size="mini" @click="setDimission(scope.row)">設置離職</el-button>
                        <el-button v-if="(scope.row.Post_Name === '保險代理人' && scope.row.Stf_Status === '離職') || !scope.row.Post_Name" type="danger" size="mini" @click="delStaff(scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-if="total > 0">
                <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
                </el-pagination>
            </div>
        </div>
        <!-- 添加员工弹框、编辑员工弹框 -->
        <v-staff-dialog v-if="isStaffDialog" :dialogStaffTitle="dialogStaffTitle" :dialogStaffData="dialogStaffData" @hideStaffDialog="hideStaffDialog"></v-staff-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VStaffDialog from '@/components/common/management/VStaffDialog.vue';
    export default {
        data() {
            return {
                keywords: '', //关键词
                roleIndeter: false,
                roleAll: true,
                roleList: [],
                role: [], //角色
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
                isStaffDialog: false,   //添加员工弹框、编辑员工弹框是否显示
                dialogStaffTitle: '',   //添加员工弹框、编辑员工弹框标题
                dialogStaffData: {} //添加员工弹框、编辑员工弹框数据
            }
        },
        components: {
            VTop,
            VStaffDialog
        },
        mounted() {
            this.$store.dispatch('getTypeData', '角色').then(() => {
                this.roleList = this.$store.state.roleList;
                // this.role = this.$store.state.roleList;
                this.getData();
            })
        },
        methods: {
            //角色-全部
            checkRoleAll(v) {
                // this.role = v ? this.roleList : [];
                // this.roleIndeter = false;
                this.role = [];
            },
            //角色-单选
            checkRole(v) {
                // let checkedCount = v.length;
                // this.roleAll = checkedCount === this.roleList.length;
                // this.roleIndeter = checkedCount > 0 && checkedCount < this.roleList.length;
                this.roleAll = false;
            },
            //获取数据列表
            getData() {
                let LstPost = [];
                this.role.map(item => {
                    LstPost.push(item.BO_Value);
                })
                const params = {
                    LstPost: LstPost,
                    Keyword: this.keywords,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/BasicsApi/GetPageStaffer', params)
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
            //重置
            resetForm() {
                this.roleAll = true;
                this.checkRoleAll(true);
                this.keywords = '';
            },
            //添加员工弹框、编辑员工弹框-显示
            showStaffDialog(str = '', obj = {}) {
                this.dialogStaffTitle = str;
                this.dialogStaffData = obj;
                this.isStaffDialog = true;
            },
            //添加员工弹框、编辑员工弹框-隐藏
            hideStaffDialog(v) {
                if(v) {
                    this.queryData();
                }
                this.isStaffDialog = false;
            },
            //设置离职
            setDimission(obj) {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定員工【' + obj.Stf_Name + '】離職了嗎?'),
                        h('div', {style: 'fontSize:12px;'}, '更改狀態後將回收員工跟進的客戶，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/BasicsApi/SetStfLeave', { Stf_ID: obj.Stf_ID })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '設置離職成功'
                        });
                        this.queryData();
                    });
                }).catch(() => {
                        
                });
            },
            //删除员工
            delStaff(obj) {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定刪除員工【' + obj.Stf_Name + '】嗎?'),
                        h('div', {style: 'fontSize:12px;'}, '刪除後無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/BasicsApi/DelStaffer', { Stf_ID: obj.Stf_ID })
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