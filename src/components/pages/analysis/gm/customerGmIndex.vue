<!-- 客户分析-销售总监 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_statistical_chart_hover.png" />客戶分析</div>
            <div class="v-top-operation" slot="correlation">
                <el-select v-model="timeRange" no-data-text="暫無數據" placeholder="請選擇" @change="changeTimeRange">
                    <el-option v-for="(item, index) in $store.state.timeRangeList" :key="index" :value="item.BO_Value"></el-option>
                </el-select>
            </div>
        </v-top>
        <el-row :gutter="20" class="mb20">
            <el-col :span="8">
                <div class="statistics-box">
                    <div class="title">新增客戶</div>
                    <div class="added"><span class="num">{{addedObj.NewCustCount}}</span>人</div>
                    <div class="gross">總量：{{addedObj.AllCustCount}}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistics-box">
                    <div class="title">新增線索</div>
                    <div class="added"><span class="num">{{addedObj.NewClueCount}}</span>人</div>
                    <div class="gross">總量：{{addedObj.AllClueCount}}</div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistics-box">
                    <div class="title">新增公海</div>
                    <div class="added"><span class="num">{{addedObj.NewPoolCount}}</span>人</div>
                    <div class="gross">總量：{{addedObj.AllPoolCount}}</div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb20">
            <el-col :span="12">
                <div class="chart-box">
                    <v-chart style="width:100%;" :options="customerSourceOptions" autoresize />
                    <v-echarts-no-data :isShow="isCustomerSource"></v-echarts-no-data>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="chart-box">
                    <v-chart style="width:100%;" :options="customerAnnualIncomeOptions" autoresize />
                    <v-echarts-no-data :isShow="isCustomerAnnualIncome"></v-echarts-no-data>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mb20">
            <el-col :span="12">
                <div class="chart-box">
                    <v-chart style="width:100%;" :options="customerSexOptions" autoresize />
                    <v-echarts-no-data :isShow="isCustomerSex"></v-echarts-no-data>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="chart-box">
                    <v-chart style="width:100%;" :options="customerAgeOptions" autoresize />
                    <v-echarts-no-data :isShow="isCustomerAge"></v-echarts-no-data>
                </div>
            </el-col>
        </el-row>
        <div class="analysis-box">
            <div class="analysis-head">標籤分析</div>
            <template v-if="checkboxTagList.length">
                <div class="analysis-body">
                    <el-checkbox-group class="checkbox-reset" v-model="selectTag" size="mini">
                        <el-checkbox v-for="(item, index) in checkboxTagList" :key="index" :label="item.BCT_Name" border></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="analysis-foot">
                    <span class="match-customer" @click="matchCustomer">匹配客戶</span>
                </div>
            </template>
            <template v-else>
                <div class="v-no-data">暫無數據</div>
            </template>
        </div>
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
    export default {
        name: 'customerGmIndex',
        data() {
            return {
                timeRange: '本月',  //时间范围
                addedObj: {},
                isCustomerSource: 0,    //是否显示暂无数据，0为显示，非0为不显示
                customerSourceOptions: {
                    title: {
                        text: '客戶來源分析'
                    },
                    legend: {
                        bottom: '10',
                        data: []
                    },
                    tooltip: {},
                    color: ['#4F81BD', '#C0504D'],
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
                },  //客户来源分析
                isCustomerAnnualIncome: 0,    //是否显示暂无数据，0为显示，非0为不显示
                customerAnnualIncomeOptions: {
                    title: {
                        text: '客戶年收入分析'
                    },
                    legend: {
                        bottom: '5'
                    },
                    tooltip: {},
                    color: ['#4F81BD'],
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            rotate: 25
                        },
                        data: []
                    },
                    yAxis: {},
                    series: [
                        {
                            type: 'bar',
                            data: []    
                        }
                    ]
                },  //客户年收入分析
                isCustomerSex: 0,    //是否显示暂无数据，0为显示，非0为不显示
                customerSexOptions: {
                    title: {
                        text: '客戶性別佔比'
                    },
                    legend: {
                        bottom: '10',
                        data: []
                    },
                    tooltip: {},
                    color: ['#4F81BD', '#C0504D', '#9BBB59'],
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
                },   //客户性别占比
                isCustomerAge: 0,    //是否显示暂无数据，0为显示，非0为不显示
                customerAgeOptions: {
                    title: {
                        text: '客戶年齡佔比'
                    },
                    tooltip: {},
                    legend: {
                        bottom: '5px'
                    },
                    color: ['#4F81BD'],
                    xAxis: {},
                    yAxis: {
                            type: 'category',
                            data: []
                    },
                    series: [
                        {
                            type: 'bar',
                            data:[]
                        }
                    ]
                },   //客户年龄占比
                checkboxTagList: [],    //标签分析列表
                selectTag: []   //选择标签
            }
        },
        components: {
            VTop,
            VEchartsNoData,
            'v-chart': ECharts
        },
        mounted() {
            this.$store.dispatch('getTypeData', '時間範圍');
            this.getAddedData();
            this.getCustomerSourceOptions();
            this.getCustomerAnnualIncomeOptions();
            this.getCustomerSexOptions();
            this.getCustomerAgeOptions();
            this.getCheckboxTagData();
        },
        methods: {
            //切换时间范围
            changeTimeRange() {
                this.getAddedData();
                this.getCustomerSourceOptions();
                this.getCustomerAnnualIncomeOptions();
                this.getCustomerSexOptions();
                this.getCustomerAgeOptions();
            },
            //获取新增客户、新增线索、新增公海
            getAddedData() {
                this.$post('/api/AnalysisApi/GetNewCustInfoByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.addedObj = res.Info;
                });
            },
            //获取客户来源分析
            getCustomerSourceOptions() {
                this.$post('/api/AnalysisApi/GetCustFromByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.isCustomerSource = res.Info.length;
                    let legendArr = [], proportionArr = [];
                    res.Info.forEach(item => {
                        legendArr.push(item.Cst_From);
                        proportionArr.push({
                            name: item.Cst_From,
                            value: item.FromCount
                        });
                    });
                    this.customerSourceOptions.legend.data = legendArr;
                    this.customerSourceOptions.series[0].data = proportionArr;
                });
            },
            //获取客户年收入分析
            getCustomerAnnualIncomeOptions() {
                this.$post('/api/AnalysisApi/GetCustIncomeByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.isCustomerAnnualIncome = res.Info.length;
                    let coordinateArr = [], proportionArr = [];
                    res.Info.forEach(item => {
                        coordinateArr.push(item.Cst_Income);
                        proportionArr.push(item.IncomeCount);
                    });
                    this.customerAnnualIncomeOptions.xAxis.data = coordinateArr;
                    this.customerAnnualIncomeOptions.series[0].data = proportionArr;
                });
            },
            //获取客户性别占比
            getCustomerSexOptions() {
                this.$post('/api/AnalysisApi/GetCustSexByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.isCustomerSex = res.Info.length;
                    let legendArr = [], proportionArr = [];
                    res.Info.forEach(item => {
                        legendArr.push(item.Cst_Sex);
                        proportionArr.push({
                            name: item.Cst_Sex,
                            value: item.SexCount
                        });
                    });
                    this.customerSexOptions.legend.data = legendArr;
                    this.customerSexOptions.series[0].data = proportionArr;
                });
            },
            //获取客户年龄占比
            getCustomerAgeOptions() {
                this.$post('/api/AnalysisApi/GetCustAgeRangeByChief', { DateRangeType: this.timeRange })
                .then((res) => {
                    this.isCustomerAge = res.Info.length;
                    let coordinateArr = [], proportionArr = [];
                    res.Info.forEach(item => {
                        coordinateArr.push(item.AgeRange);
                        proportionArr.push(item.AgeRangeCount);
                    });
                    this.customerAgeOptions.yAxis.data = coordinateArr;
                    this.customerAgeOptions.series[0].data = proportionArr;
                });
            },
            //获取標籤分析
            getCheckboxTagData() {
                this.$post('/api/AnalysisApi/GetCustTagListByChief')
                .then((res) => {
                    this.checkboxTagList = res.Info;
                });
            },
            //匹配客户
            matchCustomer() {
                if(this.selectTag.length) {
                    this.$store.commit('getMatchCustomer', this.selectTag);
                    this.$router.push('/laberGmIndex');
                    // this.$router.push({
                    //     path: '/laberBmIndex',
                    //     query: {
                    //         selectTag: this.selectTag
                    //     }
                    // });
                } else {
                    this.$message.closeAll();
                    this.$message.error('請勾選至少一項標籤');
                }
            }
        }
    }
</script>