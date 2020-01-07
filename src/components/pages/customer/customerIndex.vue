<!-- 客户 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_customer_hover.png" />客戶</div>
        </v-top>
        <div class="condition">
            <table class="condition-table">
                <tr>
                    <th>所在地區</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="regionAll" size="mini" border :indeterminate="regionIndeter" @change="checkRegionAll">全部</el-checkbox>
                        <el-checkbox-group v-model="region" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkRegion">
                            <el-checkbox v-for="(item, index) in regionList" :key="index" :label="item" border>{{item.BC_Name}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>客戶狀態</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="customerStatusAll" size="mini" border :indeterminate="customerStatusIndeter" @change="checkCustomerStatusAll">全部</el-checkbox>
                        <el-checkbox-group v-model="customerStatus" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkCustomerStatus">
                            <el-checkbox v-for="(item, index) in customerStatusList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr v-if="staffIdentity === '銷售主管'">
                    <th>所屬銷售</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="theirSalesAll" size="mini" border :indeterminate="theirSalesIndeter" @change="checkTheirSalesAll">全部</el-checkbox>
                        <el-checkbox-group v-model="theirSales" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkTheirSales">
                            <el-checkbox v-for="(item, index) in theirSalesList" :key="index" :label="item" border>{{item.Stf_Name}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>時　間</th>
                    <td>
                        <el-radio-group size="mini" class="v-radio-group radio-group-condition" v-model="dateRadio" @change="changeDateRadio">
                            <el-radio label="全部" border></el-radio>
                            <el-radio label="近一周" border></el-radio>
                            <el-radio label="近一月" border></el-radio>
                        </el-radio-group>
                        <el-date-picker
                            size="mini"
                            v-model="datePicker"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="開始日期"
                            end-placeholder="結束日期"
                            value-format="yyyy-MM-dd"
                            @change="selectDateRadio">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <th>關鍵詞</th>
                    <td>
                        <el-input class="w200" v-model="keywords" size="mini" maxlength="10" placeholder="請輸入客戶姓名" />
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
                <el-table-column label="客戶姓名" prop="Cst_Name" align="center"></el-table-column>
                <el-table-column label="所在地區" prop="Cst_Location" align="center"></el-table-column>
                <el-table-column label="客戶狀態" prop="Cst_Status" align="center"></el-table-column>
                <el-table-column v-if="staffIdentity === '銷售主管'" label="所屬銷售" prop="Stf_Name" align="center"></el-table-column>
                <el-table-column label="最近跟進時間" align="center">
                    <template slot-scope="scope">{{scope.row.BF_Time | hkDate('dateHM')}}</template>
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
        name: 'customerIndex',
        data() {
            return {
                keywords: '', //关键词
                regionIndeter: false,
                regionAll: true,    //所在地区-全部
                regionList: [],   //所在地区
                region: [], //所在地区-选择的
                customerStatusIndeter: false,
                customerStatusAll: true,  //客户状态-全部
                customerStatusList: [], //客户状态
                customerStatus: [], //客户状态-选择的
                theirSalesIndeter: false,
                theirSalesAll: true,  //所属销售-全部
                theirSalesList: [], //所属销售
                theirSales: [], //所属销售-选择的
                dateRadio: '近一周',  //时间
                datePicker: [], //时间框
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
                staffIdentity: sessionStorage.getItem('fc_staffIdentity')
            }
        },
        components: {
            VTop
        },
        mounted() {
            let arr = [
                this.$store.dispatch('getRegionData', '中國香港'),
                this.$store.dispatch('getTypeData', '客戶狀態')
            ];
            if(this.staffIdentity === '銷售主管') {
                arr.push(this.$store.dispatch('getTeamMembers'));
            }
            Promise.all(arr).then(() => {
                this.regionList = this.$store.state.regionList;
                // this.region = this.$store.state.regionList;
                this.customerStatusList = this.$store.state.customerStatusList;
                // this.customerStatus = this.$store.state.customerStatusList;
                if(this.staffIdentity === '銷售主管') {
                    this.theirSalesList = this.$store.state.teamMembersList;
                    // this.theirSales = this.$store.state.teamMembersList;
                }
                if(this.$route.query.text === sessionStorage.getItem('fc_userid')) {
                    const week = this.comm.commDateModified("day", 8, new Date(), '-');
                    const weekDay = this.comm.formatDate(week, 'yyyy-MM-dd');
                    this.customerStatusAll = false;
                    this.customerStatus = this.customerStatusList.filter(item => item.BO_Value === '初步接觸' || item.BO_Value === '意向客戶' || item.BO_Value === '成交客戶');
                    this.dateRadio = '';
                    this.datePicker = ['1990-01-01', weekDay];
                }
                this.getData();
            })
            this.changeDateRadio(this.dateRadio);
        },
        methods: {
            //所在地区-全部
            checkRegionAll(v) {
                // this.region = v ? this.regionList : [];
                // this.regionIndeter = false;
                this.region = [];
            },
            //所在地区-单选
            checkRegion(v) {
                // let checkedCount = v.length;
                // this.regionAll = checkedCount === this.regionList.length;
                // this.regionIndeter = checkedCount > 0 && checkedCount < this.regionList.length;
                this.regionAll = false;
            },
            //客户状态-全部
            checkCustomerStatusAll(v) {
                // this.customerStatus = v ? this.customerStatusList : [];
                // this.customerStatusIndeter = false;
                this.customerStatus = [];
            },
            //客户状态-单选
            checkCustomerStatus(v) {
                // let checkedCount = v.length;
                // this.customerStatusAll = checkedCount === this.customerStatusList.length;
                // this.customerStatusIndeter = checkedCount > 0 && checkedCount < this.customerStatusList.length;
                this.customerStatusAll = false;
            },
            //所属销售-全部
            checkTheirSalesAll(v) {
                // this.theirSales = v ? this.theirSalesList : [];
                // this.theirSalesIndeter = false;
                this.theirSales = [];
            },
            //所属销售-单选
            checkTheirSales(v) {
                // let checkedCount = v.length;
                // this.theirSalesAll = checkedCount === this.theirSalesList.length;
                // this.theirSalesIndeter = checkedCount > 0 && checkedCount < this.theirSalesList.length;
                this.theirSalesAll = false;
            },
            //切换时间
            changeDateRadio(v) {
                let now = new Date(), newDate;
                if(v === '全部') {
                    this.datePicker = ['', ''];
                    return false;
                } else if(v === '近一周') {
                    newDate = this.comm.commDateModified("week", 1, now, '-');
                } else if(v === '近一月') {
                    newDate = this.comm.commDateModified("month", 1, now, '-');
                }
                this.datePicker = [this.comm.formatDate(newDate, 'yyyy-MM-dd'), this.comm.formatDate(new Date(), 'yyyy-MM-dd')];
            },
            //选择时间
            selectDateRadio(v) {
                if(v) {
                    this.dateRadio = '';
                } else {
                    this.dateRadio = '全部';
                }
            },
            //获取数据列表
            getData() {
                let LstLocation = [], LstStatus = [], LstStfID = [];
                this.region.map(item => {
                    LstLocation.push(item.BC_Name);
                })
                this.customerStatus.map(item => {
                    LstStatus.push(item.BO_Value);
                })
                if(this.staffIdentity === '銷售主管') {
                    this.theirSales.map(item => {
                        LstStfID.push(item.Stf_ID);
                    })
                }
                const params = {
                    LstLocation: this.regionAll ? [] : LstLocation,
                    LstStatus: LstStatus,
                    LstStfID: LstStfID,
                    StartDate: this.datePicker ? this.datePicker[0] : '',
                    EndDate: this.datePicker ? this.datePicker[1] : '',
                    Keyword: this.keywords,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/CustomerApi/GetPageCustomer', params)
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
                this.regionAll = true;
                this.checkRegionAll(true);
                this.customerStatusAll = true;
                this.checkCustomerStatusAll(true);
                if(this.staffIdentity === '銷售主管') {
                    this.theirSalesAll = true;
                    this.checkTheirSalesAll(true);
                }
                this.dateRadio = '近一周';
                this.changeDateRadio(this.dateRadio);
                this.keywords = '';
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
        },
        activated() {
            this.queryData();
        }
    }
</script>