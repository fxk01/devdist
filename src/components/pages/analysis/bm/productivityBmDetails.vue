<!-- 绩效分析-推荐产品、核保期、冷静期、正式保单、员工业绩详情-销售主管 -->
<template>
    <div class="container">
        <v-top>
            <a class="v-top-return" slot="return" href="javascript:;" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>返回</a>
            <div class="v-top-title" slot="title">{{queryObj.theirStage}}</div>
        </v-top>
        <el-row :gutter="20" class="statistics-box">
            <el-col :span="12">合計：<span class="currency">HKD</span> <span class="money">{{comm.formatMoney(queryObj.total, 2)}}</span></el-col>
            <el-col v-if="queryObj.theirStage === '業績詳情'" :span="12">完成比例：<span class="proportion">{{queryObj.percent}}</span>%</el-col>
        </el-row>
        <div class="content">
            <el-table :data="tableData" empty-text="暫無數據">
                <el-table-column v-if="queryObj.theirStage === '冷靜期' || queryObj.theirStage === '正式保單' || queryObj.theirStage === '業績詳情'" label="保單號" prop="BC_OrderNo" align="center"></el-table-column>

                <el-table-column label="客戶姓名" prop="Cst_Name" align="center"></el-table-column>

                <template v-if="queryObj.theirStage === '推薦產品'">
                    <el-table-column label="關聯產品" prop="BC_RelationProduct" align="center"></el-table-column>
                    <el-table-column label="預計保單費用" align="center">
                        <template slot-scope="scope">{{scope.row.BC_Currency}} {{comm.formatMoney(scope.row.BC_MoneyEstimate, 2)}}</template>
                    </el-table-column>
                    <el-table-column label="預計簽單日期" align="center">
                        <template slot-scope="scope">{{scope.row.BC_SignDateEstimate | hkDate('date')}}</template>
                    </el-table-column>
                </template>

                <template v-if="queryObj.theirStage === '核保期' || queryObj.theirStage === '冷靜期' || queryObj.theirStage === '正式保單' || queryObj.theirStage === '業績詳情'">
                    <el-table-column label="產品類型" prop="BC_OrderProductType" align="center"></el-table-column>
                    <el-table-column label="保單費用" align="center">
                        <template slot-scope="scope">{{scope.row.BC_OrderCurrency}} {{comm.formatMoney(scope.row.BC_OrderMoney, 2)}}</template>
                    </el-table-column>
                </template>

                <el-table-column v-if="queryObj.theirStage === '核保期' || queryObj.theirStage === '冷靜期'" label="保單狀態" prop="BC_OrderStatus" align="center"></el-table-column>

                <el-table-column v-if="queryObj.theirStage === '核保期' || queryObj.theirStage === '冷靜期'" label="更新時間" align="center">
                    <template slot-scope="scope">{{scope.row.BC_OrderUpdateTime | hkDate('date')}}</template>
                </el-table-column>

                <template v-if="queryObj.theirStage === '正式保單' || queryObj.theirStage === '業績詳情'">
                    <el-table-column label="生效日期" align="center">
                        <template slot-scope="scope">{{scope.row.BC_OrderStartDate | hkDate('date')}}</template>
                    </el-table-column>
                    <el-table-column label="過期日期" align="center">
                        <template slot-scope="scope">{{scope.row.BC_OrderEndDate | hkDate('date')}}</template>
                    </el-table-column>
                </template>

                <el-table-column v-if="queryObj.theirStage !== '業績詳情'" label="所屬代理" prop="Stf_Name" align="center"></el-table-column>
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
        name: 'productivityBmDetails',
        data() {
            return {
                queryObj: this.$route.query,
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
            this.getData();
        },
        methods: {
            //获取数据列表
            getData() {
                let url = '', params = {};
                if(this.queryObj.theirStage === '業績詳情') {
                    url = '/api/AnalysisApi/GetPageAchieveDetailByStfID';
                    params = {
                        DateRangeType: this.queryObj.timeRange,
                        RankType: this.queryObj.sort,
                        Stf_ID: this.queryObj.stfId,
                        PageIndex: this.PageIndex,
                        PageSize: this.PageSize
                    };
                } else {
                    url = '/api/AnalysisApi/GetPageChanceDataByDir';
                    params = {
                        DateRangeType: this.queryObj.timeRange,
                        OrderStep: this.queryObj.theirStage,
                        PageIndex: this.PageIndex,
                        PageSize: this.PageSize
                    };
                }
                this.$post(url, params)
                .then((res) => {
                    this.total = res.TotalCount;
                    this.tableData = res.Datas;
                });
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
            }
        }
    }
</script>

<style scoped>
    .statistics-box {
        margin-bottom: 20px;
        height: auto;
        background-color: #ffffff;
    }
    .statistics-box .currency {
        font-size: 18px;
        color: #333333;
    }
    .statistics-box .money {
        font-size: 18px;
        color: #ff0000;
    }
    .statistics-box .proportion {
        font-size: 18px;
        color: #0099ff;
    }
</style>