<!-- 员工管理-销售主管 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_staff_management_hover.png" />員工管理</div>
            <div class="v-top-operation" slot="correlation">
                <el-button class="btn-ec0928" type="primary" size="mini" icon="el-icon-plus" @click="showStaffDialog">添加員工</el-button>
            </div>
        </v-top>
        <div class="content">
            <el-table :data="tableData" empty-text="暫無數據">
                <el-table-column label="姓名" prop="Stf_Name" align="center"></el-table-column>
                <el-table-column label="賬號" prop="BS_LoginID" align="center"></el-table-column>
                <el-table-column label="狀態" prop="Stf_Status" align="center"></el-table-column>
            </el-table>
            <div class="pagination" v-if="total > 0">
                <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
                </el-pagination>
            </div>
        </div>
        <!-- 添加员工 -->
        <v-staff-dialog v-if="isStaffDialog" dialogStaffTitle="添加員工" dialogStaffType="銷售主管" @hideStaffDialog="hideStaffDialog"></v-staff-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VStaffDialog from '@/components/common/management/VStaffDialog.vue';
    export default {
        data() {
            return {
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
            this.getData();
        },
        methods: {
            //获取数据列表
            getData() {
                const params = {
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/BasicsApi/GetPageTeamMember', params)
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
            //添加员工弹框、编辑员工弹框-显示
            showStaffDialog() {
                this.isStaffDialog = true;
            },
            //添加员工弹框、编辑员工弹框-隐藏
            hideStaffDialog(v) {
                if(v) {
                    this.queryData();
                }
                this.isStaffDialog = false;
            }
        }
    }
</script>

<style scoped>
    .btn-weird, .btn-weird:hover {
        color: #409eff;
    }
</style>