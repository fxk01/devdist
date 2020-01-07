<!-- 绩效分析-销售总监 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_statistical_chart_hover.png" />績效分析</div>
            <div class="v-top-operation" slot="correlation">
                <el-select v-model="timeRange" no-data-text="暫無數據" placeholder="請選擇" @change="changeTimeRange">
                    <el-option v-for="(item, index) in $store.state.timeRangeList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </div>
        </v-top>
        <el-row :gutter="20" class="mb20">
            <el-col :span="8">
                <div class="statistics-box">
                    <div class="title">平均客單價</div>
                    <div class="added"><span class="num">{{comm.formatMoney(averageObj.AvgOrderMoney, 2)}}</span>HKD</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistics-box">
                    <div class="title">平均審覈過期</div>
                    <div class="added"><span class="num">{{averageObj.AvgAuditDay}}</span>天</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistics-box">
                    <div class="title">成交轉化率</div>
                    <div class="added"><span class="num">{{averageObj.ConvContractRatio}}</span>%</div>
                </div>
            </el-col>
        </el-row>
        <div class="analysis-box mb20">
            <div class="analysis-head">銷售漏斗分析</div>
            <div class="analysis-body">
                <el-row v-for="(item, index) in funnelData" :key="index" :gutter="20">
                    <el-col :span="10 - index * 2" :offset="index + 7">
                        <div :class="['analysis-item', 'analysis-item' + (index + 1)]" @click="lookDetails(item)">HKD {{comm.formatMoney(item.SumOrderMoney, 2)}}</div>
                    </el-col>
                    <el-col :span="3"  :offset="index">
                        <span class="analysis-status" @click="lookDetails(item)">{{item.OrderStep}}（{{item.OrderCount}}单）</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-form>
            <el-form-item label="排序：">
                <el-radio-group v-model="sort" @change="changeSort">
                    <el-radio :label="0">按銷售額</el-radio>
                    <el-radio :label="1">按業績完成比例</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="condition">
            <el-table :data="tableData" empty-text="暫無數據">
                <el-table-column label="排名" prop="SerialId" align="center" ></el-table-column>
                <el-table-column label="團隊名稱" prop="BT_Name" align="center"></el-table-column>
                <el-table-column label="銷售額" align="center">
                    <template slot-scope="scope">{{comm.formatMoney(scope.row.SumOrderMoney, 2)}}</template>
                </el-table-column>
                <el-table-column label="業績完成比例" align="center">
                    <template slot-scope="scope">{{scope.row.CompletePercent}}%</template>
                </el-table-column>
                <el-table-column label="團隊銷冠" align="center">
                    <template slot-scope="scope">
                        <div class="round-table">
                            <span class="text">{{scope.row.TopStf_Name}}</span>
                            <span v-if="scope.row.MDRTType" class="icon">{{scope.row.MDRTType}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="個人業績" align="center">
                    <template slot-scope="scope">{{comm.formatMoney(scope.row.TopSumOrderMoney, 2)}}</template>
                </el-table-column>
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
        name: 'productivityGmIndex',
        data() {
            return {
                timeRange: '本月',  //时间范围
                averageObj: {}, //平均客单价、平均审核过期、成交转化率
                funnelData: [], //销售漏斗分析
                sort: 0,
                tableData: [],  //数据列表(绩效分析业绩排行)
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10 //页条数
            }
        },
        components: {
            VTop
        },
        mounted() {
            this.$store.dispatch('getTypeData', '時間範圍');
            this.getAverageData();
            this.getFunnelData();
            this.queryData();
        },
        methods: {
            //切换时间范围
            changeTimeRange() {
                this.getAverageData();
                this.getFunnelData();
                this.queryData();
            },
            //切换排序
            changeSort() {
                this.queryData();
            },
            //获取平均客单价、平均审核过期、成交转化率
            getAverageData() {
                this.$post('/api/AnalysisApi/GetJiXiaoDataByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.averageObj = res.Info;
                });
            },
            //获取销售漏斗分析
            getFunnelData() {
                this.$post('/api/WorkSpaceApi/GetFunnelDataByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.funnelData = res.Info;
                });
            },
            //获取数据列表(绩效分析业绩排行)
            getData() {
                const params = {
                    DateRangeType: this.timeRange,
                    RankType: this.sort,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                };
                this.$post('/api/AnalysisApi/GetPageAchieveRankByChief', params)
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
                let queryObj = {};
                if(obj.OrderStep) {
                    queryObj = {
                        timeRange: this.timeRange,
                        theirStage: obj.OrderStep,
                        total: obj.SumOrderMoney
                    };
                } else {
                    queryObj = {
                        timeRange: this.timeRange,
                        theirStage: '業績詳情',
                        teamId: obj.BT_ID
                    };
                }
                this.$router.push({
                    path: '/productivityGmDetails',
                    query: queryObj
                });
            }
        }
    }
</script>