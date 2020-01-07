<!-- 标签分析-销售主管 -->
<template>
    <div class="container">
        <v-top>
            <a class="v-top-return" slot="return" href="javascript:;" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>返回</a>
            <div class="v-top-title" slot="title">標籤分析</div>
        </v-top>
        <div class="analysis-box">
            <div class="analysis-head">標籤分析</div>
            <div class="analysis-body">
                <el-checkbox-group v-model="selectTag" size="mini" class="checkbox-reset">
                    <el-checkbox v-for="(item, index) in checkboxTagList" :key="index" :label="item.BCT_Name" border></el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="analysis-foot">
                <span class="match-customer" @click="matchCustomer">匹配客戶</span>
            </div>
        </div>
        <div class="condition">
            <el-table :data="tableData" empty-text="暫無數據">
                <el-table-column label="客戶姓名" prop="Cst_Name" align="center"></el-table-column>
                <el-table-column label="所在地區" prop="Cst_Location" align="center"></el-table-column>
                <el-table-column label="客戶狀態" prop="Cst_Status" align="center"></el-table-column>
                <el-table-column label="所屬代理" prop="Stf_Name" align="center"></el-table-column>
                 <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" plain @click="lookDetails(scope.row)">查看詳情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-if="total > 0">
                <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    export default {
        name: 'laberBmIndex',
        data() {
            return {
                checkboxTagList: [],   //标签分析列表
                selectTag: [],   //选择标签
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10 //页条数
            }
        },
        components: {
            VTop
        },
        mounted() {
            this.getCheckboxTagData();
            this.selectTag = this.$store.state.matchCustomerList;
            // this.selectTag = typeof(this.$route.query.selectTag) === 'string' ? [this.$route.query.selectTag] : this.$route.query.selectTag;
            if(this.selectTag.length) {
                this.queryData();
            }
        },
        methods: {
            //获取標籤分析
            getCheckboxTagData() {
                this.$post('/api/AnalysisApi/GetCustTagListByDir')
                .then((res) => {
                    this.checkboxTagList = res.Info;
                });
            },
            //匹配客户
            matchCustomer() {
                if(this.selectTag.length) {
                    this.$store.commit('getMatchCustomer', this.selectTag);
                    // this.$router.push({
                    //     path: '/laberBmIndex',
                    //     query: {
                    //         selectTag: this.selectTag
                    //     }
                    // });
                    this.queryData();
                } else {
                    this.tableData = [];
                    this.$message.closeAll();
                    this.$message.error('請勾選至少一項標籤');
                }
            },
            //获取数据列表
            getData() {
                const params = {
                    LstTag: this.selectTag,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/AnalysisApi/GetCustTagMatchedByDir', params)
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
            //查看详情
            lookDetails(obj) {
                this.$router.push({
                    path: '/customerDetails',
                    query: {
                        Cst_Code: obj.Cst_Code
                    }
                });
            }
        }
    }
</script>