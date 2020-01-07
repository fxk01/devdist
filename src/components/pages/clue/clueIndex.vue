<!-- 线索 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_clue_hover.png" />線索</div>
            <div class="v-top-operation" slot="correlation">
                <el-button class="btn-ec0928" type="primary" size="mini" icon="el-icon-plus" @click="showClueDialog">新建線索</el-button>
            </div>
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
                    <th>線索來源</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="clueSourceAll" size="mini" border :indeterminate="clueSourceIndeter" @change="checkClueSourceAll">全部</el-checkbox>
                        <el-checkbox-group v-model="clueSource" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkClueSource">
                            <el-checkbox v-for="(item, index) in clueSourceList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>跟進狀態</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="clueStatusAll" size="mini" border :indeterminate="clueStatusIndeter" @change="checkClueStatusAll">全部</el-checkbox>
                        <el-checkbox-group v-model="clueStatus" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkClueStatus">
                            <el-checkbox v-for="(item, index) in clueStatusList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
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
                <el-table-column label="客戶姓名" prop="Busi_CName" align="center"></el-table-column>
                <el-table-column label="線索來源" prop="Busi_CFrom" align="center"></el-table-column>
                <el-table-column label="所在地區" prop="Busi_CLocation" align="center"></el-table-column>
                <el-table-column label="跟進狀態" prop="Busi_CFollowStatus" align="center"></el-table-column>
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
        <!-- 新建线索弹框 -->
        <v-clue-dialog v-if="isClueDialog" dialogClueTitle="新建線索" @hideClueDialog="hideClueDialog"></v-clue-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VClueDialog from '@/components/common/clue/VClueDialog.vue';
    export default {
        name: 'clueIndex',
        data() {
            return {
                keywords: '', //关键词
                regionIndeter: false,
                regionAll: true,
                regionList: [],
                region: [], //所在地区
                clueSourceIndeter: false,
                clueSourceAll: true,
                clueSourceList: [],
                clueSource: [], //线索来源
                clueStatusIndeter: false,
                clueStatusAll: true,
                clueStatusList: [],
                clueStatus: [], //线索状态
                dateRadio: '近一周',  //时间
                datePicker: [], //时间框
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
                isClueDialog: false
            }
        },
        components: {
            VTop,
            VClueDialog
        },
        mounted() {
            Promise.all(
                [
                    this.$store.dispatch('getRegionData', '中國香港'),
                    this.$store.dispatch('getTypeData', '線索來源'),
                    this.$store.dispatch('getTypeData', '跟進狀態')
                ]
            ).then(() => {
                this.regionList = this.$store.state.regionList;
                // this.region = this.$store.state.regionList;
                this.clueSourceList = this.$store.state.cluelList;
                // this.clueSource = this.$store.state.cluelList;
                this.clueStatusList = this.$store.state.cluelFollowList;
                // this.clueStatus = this.$store.state.cluelFollowList;
                if(this.$route.query.text === sessionStorage.getItem('fc_userid')) {
                    this.clueSourceAll = false;
                    this.clueSource = this.clueSourceList.filter(item => item.BO_Value === '公海轉入');
                    this.clueStatusAll = false;
                    this.clueStatus = this.clueStatusList.filter(item => item.BO_Value === '未跟進');
                    this.dateRadio = '全部';
                    this.datePicker = ['', ''];
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
            //线索来源-全部
            checkClueSourceAll(v) {
                // this.clueSource = v ? this.clueSourceList : [];
                // this.clueSourceIndeter = false;
                this.clueSource = [];
            },
            //线索来源-单选
            checkClueSource(v) {
                // let checkedCount = v.length;
                // this.clueSourceAll = checkedCount === this.clueSourceList.length;
                // this.clueSourceIndeter = checkedCount > 0 && checkedCount < this.clueSourceList.length;
                this.clueSourceAll = false;
            },
            //线索状态-全部
            checkClueStatusAll(v) {
                // this.clueStatus = v ? this.clueStatusList : [];
                // this.clueStatusIndeter = false;
                this.clueStatus = [];
            },
            //线索状态-单选
            checkClueStatus(v) {
                // let checkedCount = v.length;
                // this.clueStatusAll = checkedCount === this.clueStatusList.length;
                // this.clueStatusIndeter = checkedCount > 0 && checkedCount < this.clueStatusList.length;
                this.clueStatusAll = false;
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
                let LstLocation = [], LstFrom = [], LstFollowStatus = [];
                this.region.map(item => {
                    LstLocation.push(item.BC_Name);
                })
                this.clueSource.map(item => {
                    LstFrom.push(item.BO_Value);
                })
                this.clueStatus.map(item => {
                    LstFollowStatus.push(item.BO_Value);
                })
                const params = {
                    LstLocation: this.regionAll ? [] : LstLocation,
                    LstFrom: LstFrom,
                    LstFollowStatus: LstFollowStatus,
                    StartDate: this.datePicker ? this.datePicker[0] : '',
                    EndDate: this.datePicker ? this.datePicker[1] : '',
                    Keyword: this.keywords,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/ClueApi/GetPageClue', params)
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
                this.clueSourceAll = true;
                this.checkClueSourceAll(true);
                this.clueStatusAll = true;
                this.checkClueStatusAll(true);
                this.dateRadio = '近一周';
                this.changeDateRadio(this.dateRadio);
                this.keywords = '';
            },
            //查看详情
            lookDetails(obj) {
                this.$router.push({
                    path: '/clueDetails',
                    query: {
                        obj: JSON.stringify({
                            Busi_CID: obj.Busi_CID,
                            Busi_CFrom: obj.Busi_CFrom
                        })
                    }
                });
            },
            //新建线索弹框-显示
            showClueDialog() {
                this.isClueDialog = true;
            },
            //新建线索弹框-隐藏
            hideClueDialog(v) {
                if(v) {
                    this.queryData();
                }
                this.isClueDialog = false;
            }
        },
        activated() {
            this.queryData();
        }
    }
</script>