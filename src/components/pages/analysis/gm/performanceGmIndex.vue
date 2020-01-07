<!-- 业绩分析-销售总监 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_statistical_chart_hover.png" />業績分析</div>
            <div class="v-top-operation" slot="correlation">
                <el-select v-model="timeRange" no-data-text="暫無數據" placeholder="請選擇" @change="changeTimeRange">
                    <el-option v-for="(item, index) in $store.state.timeRangeList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </div>
        </v-top>
        <div class="chart-box mb20">
            <v-chart style="width:100%;" :options="finishOptions" autoresize />
            <v-echarts-no-data :isShow="isFinish"></v-echarts-no-data>
        </div>
        <div class="condition mb20">
            <el-table :data="tableData" empty-text="暫無數據">
                <el-table-column label="團隊名稱" prop="BT_Name" align="center"></el-table-column>
                <template v-if="tableData.length">
                    <el-table-column v-for="(item, index) in tableData[0].LstMonthAchieve" :key="index" :label="item.YearMonShow" align="center">
                        <template slot-scope="scope">{{comm.formatMoney(scope.row.LstMonthAchieve[index].SumOrderMoney, 2)}}</template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="pagination" v-if="total > 0">
                <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
                </el-pagination>
            </div>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="chart-box">
                    <v-chart style="width:100%;" :options="productOptions" autoresize />
                    <v-echarts-no-data :isShow="isProduct"></v-echarts-no-data>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="chart-box">
                    <v-chart style="width:100%;" :options="teamOptions" autoresize />
                    <v-echarts-no-data :isShow="isTeam"></v-echarts-no-data>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VEchartsNoData from '@/components/common/VEchartsNoData.vue';
    import ECharts from 'vue-echarts';
    import "echarts/lib/chart/bar"; //柱状图
    import 'echarts/lib/chart/pie';  //饼图
    import 'echarts/lib/component/title';   //标题组件
    import 'echarts/lib/component/legend';  //图例组件
    import 'echarts/lib/component/tooltip'; //提示框组件
    import 'echarts/lib/component/markPoint';   //标记点组件
    export default {
        name: 'performanceGmIndex',
        data() {
            return {
                timeRange: '本月',  //时间范围
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
                isFinish: 0,    //是否显示暂无数据，0为显示，非0为不显示
                finishOptions: {
                    grid: {
                        top: 75
                    },
                    title: {
                        text: '業績完成情況'
                    },
                    legend: {
                        bottom: '5',
                        data: ['預期目標', '完成業績']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    color: ['#4F81BD', '#C0504D'],
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {},
                    series: [
                        {
                            name: '預期目標',
                            type: 'bar',
                            data: []
                        },
                        {
                            name: '完成業績',
                            type: 'bar',
                            data: [],
                            markPoint: {
                                symbol: 'image://static/images/comm/icon_mct.png',
                                symbolSize: 70,
                                data: [],
                                label: {
                                    fontSize: 13,
                                    // fontFamily: 'Century',
                                    color: '#333333'
                                }
                            }
                        }
                    ]
                },  //业绩完成情况
                isProduct: 0,   //是否显示暂无数据，0为显示，非0为不显示
                productOptions: {
                    title: {
                        text: '產品業績情佔比'
                    },
                    legend: {
                        bottom: '10',
                        data: []
                    },
                    tooltip: {},
                    color: ['#4F81BD', '#C0504D', '#9BBB59', '#8064A2', '#4BACC6', '#F79646'],
                    series: [
                        {
                            type: 'pie',
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data: []
                        }
                    ]
                },  //产品业绩占比
                isTeam: 0,   //是否显示暂无数据，0为显示，非0为不显示
                teamOptions: {
                    title: {
                        text: '團隊業績佔比'
                    },
                    legend: {
                        bottom: '10',
                        data: []
                    },
                    tooltip: {},
                    color: ['#4F81BD', '#C0504D', '#9BBB59', '#8064A2', '#4BACC6', '#F79646'],
                    series: [
                        {
                            type: 'pie',
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data: []
                        }
                    ]
                }   //团队业绩占比
            }
        },
        components: {
            VTop,
            VEchartsNoData,
            'v-chart': ECharts
        },
        mounted() {
            this.$store.dispatch('getTypeData', '時間範圍');
            this.getFinishOptions();
            this.getProductOptions();
            this.getTeamOptions();
            this.queryData();
        },
        methods: {
            //切换时间范围
            changeTimeRange() {
                this.getFinishOptions();
                this.getProductOptions();
                this.getTeamOptions();
                this.queryData();
            },
            //获取业绩完成情况
            getFinishOptions() {
                this.$post('/api/WorkSpaceApi/GetAchieveCompleteByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.isFinish = res.Info.length;
                    let coordinateArr = [], expectArr = [], finishArr = [], iconArr = [];
                    res.Info.forEach((item, index) => {
                        coordinateArr.push(item.BT_Name);
                        expectArr.push(item.TargetOrderMoney);
                        finishArr.push(item.SumOrderMoney);
                        if(item.MDRTType) {
                            iconArr.push({
                                name: item.MDRTType,
                                value: item.MDRTType,
                                xAxis: index,
                                yAxis: item.SumOrderMoney,
                                symbolOffset: [0, '-55%']
                            });
                        }
                    });
                    this.finishOptions.xAxis.data = coordinateArr;
                    this.finishOptions.series[0].data = expectArr;
                    this.finishOptions.series[1].data = finishArr;
                    this.finishOptions.series[1].markPoint.data = iconArr;
                });
            },
            //获取产品业绩占比
            getProductOptions() {
                this.$post('/api/AnalysisApi/GetProductAchieveByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.isProduct = res.Info.length;
                    let legendArr = [], proportionArr = [];
                    res.Info.forEach(item => {
                        legendArr.push(item.OrderProductType);
                        proportionArr.push({
                            name: item.OrderProductType,
                            value: item.ProductMoney
                        });
                    });
                    this.productOptions.legend.data = legendArr;
                    this.productOptions.series[0].data = proportionArr;
                });
            },
            //获取团队业绩占比
            getTeamOptions() {
                this.$post('/api/AnalysisApi/GetTeamAchieveByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.isTeam = res.Info.length;
                    let legendArr = [], proportionArr = [];
                    res.Info.forEach(item => {
                        legendArr.push(item.BT_Name);
                        proportionArr.push({
                            name: item.BT_Name,
                            value: item.TeamMoney
                        });
                    });
                    this.teamOptions.legend.data = legendArr;
                    this.teamOptions.series[0].data = proportionArr;
                });
            },
            //获取数据列表
            getData() {
                const params = {
                    DateRangeType: this.timeRange,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/AnalysisApi/GetPageAchieveDataByChief', params)
                .then((res) => {
                    this.total = res.TotalCount;
                    this.tableData = res.Datas;
                });
            },
            //查詢
            queryData() {
                this.PageIndex = 1;
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
        }
    }
</script>