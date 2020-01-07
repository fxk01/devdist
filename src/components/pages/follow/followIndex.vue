<!-- 跟进记录 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_follow_hover.png" />跟進記錄</div>
        </v-top>
        <div class="condition">
            <table class="condition-table">
                <tr>
                    <th>跟進對象</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="followObjecAll" size="mini" border :indeterminate="followObjecIndeter" @change="checkFollowObjecAll">全部</el-checkbox>
                        <el-checkbox-group v-model="followObjec" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkFollowObjec">
                            <el-checkbox v-for="(item, index) in followObjecList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>跟進方式</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="followWayAll" size="mini" border :indeterminate="followWayIndeter" @change="checkFollowWayAll">全部</el-checkbox>
                        <el-checkbox-group v-model="followWay" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkFollowWay">
                            <el-checkbox v-for="(item, index) in followWayList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>跟進時間</th>
                    <td>
                        <el-radio-group size="mini" class="v-radio-group radio-group-condition" v-model="dateRadio" @change="changeDateRadio">
                            <el-radio label="全部" border></el-radio>
                            <el-radio label="今天" border></el-radio>
                            <el-radio label="昨天" border></el-radio>
                            <el-radio label="近一周" border>本週</el-radio>
                            <el-radio label="近一月" border>本月</el-radio>
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
            </table>
            <div class="p10" align="center">
                <el-button class="btn-ec0928" type="primary" size="mini" @click="queryData">查詢</el-button>
                <el-button type="info" size="mini" @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="content">
            <template v-if="tableData.length">
                <el-card v-for="(item, index) in tableData" :key="index" class="card-box">
                    <div class="record-item">
                        <div class="record-head">
                            <span class="title">{{item.Stf_Name}}　>　{{item.BF_Method}}</span>
                            <span class="date">{{item.BF_Time | hkDate('dateHM')}}</span>
                        </div>
                        <div class="record-body">
                            <template v-if="item.BF_ChangeStatusFrom === item.BF_ChangeStatusTo">
                            <div class="follow-title">{{item.BF_ChangeStatusFrom}}</div>
                        </template>
                        <template v-else>
                            <div v-if="item.BF_Target === '線索'" class="follow-title">
                                線索狀態由 <span :class="{
                                    'c-00b050': item.BF_ChangeStatusFrom === '可持續跟進',
                                    'c-ff003a': item.BF_ChangeStatusFrom === '拒絕關閉'
                                }">{{item.BF_ChangeStatusFrom}}</span> 更改為 <span :class="{
                                    'c-00b050': item.BF_ChangeStatusTo === '可持續跟進',
                                    'c-ff003a': item.BF_ChangeStatusTo === '拒絕關閉'
                                }">{{item.BF_ChangeStatusTo}}</span>
                            </div>
                            <div v-else class="follow-title">
                                客戶狀態由 <span :class="{
                                    'c-538ddb': item.BF_ChangeStatusFrom === '意向客戶',
                                    'c-ffc000': item.BF_ChangeStatusFrom === '成交客戶',
                                    'c-963634': item.BF_ChangeStatusFrom === '保單客戶',
                                    'c-ff003a': item.BF_ChangeStatusFrom === '擱置客戶'
                                }">{{item.BF_ChangeStatusFrom}}</span> 更改為 <span :class="{
                                    'c-538ddb': item.BF_ChangeStatusTo === '意向客戶',
                                    'c-ffc000': item.BF_ChangeStatusTo === '成交客戶',
                                    'c-963634': item.BF_ChangeStatusTo === '保單客戶',
                                    'c-ff003a': item.BF_ChangeStatusTo === '擱置客戶'
                                }">{{item.BF_ChangeStatusTo}}</span>
                            </div>
                        </template>
                        </div>
                        <div class="record-foot">備註：{{item.BF_Description}}</div>
                    </div>
                </el-card>
            </template>
            <template v-else>
                <div class="no-data">暫無數據</div>
            </template>
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
        name: 'followIndex',
        data() {
            return {
                followObjecIndeter: false,
                followObjecAll: true,    //跟进对象-全部
                followObjecList: [],   //跟进对象
                followObjec: [], //跟进对象-选择的
                followWayIndeter: false,
                followWayAll: true,  //跟进方式-全部
                followWayList: [], //跟进方式
                followWay: [], //跟进方式-选择的
                dateRadio: '今天',  //时间
                datePicker: [], //时间框
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
            }
        },
        components: {
            VTop
        },
        mounted() {
            Promise.all(
                [
                    this.$store.dispatch('getTypeData', '跟進對象'),
                    this.$store.dispatch('getTypeData', '跟進方式')
                ]
            ).then(() => {
                this.followObjecList = this.$store.state.followObjectList;
                // this.followObjec = this.$store.state.followObjectList;
                this.followWayList = this.$store.state.cluelFollowWay;
                // this.followWay = this.$store.state.cluelFollowWay;
                this.getData();
            })
            this.changeDateRadio(this.dateRadio);
        },
        methods: {
            //跟进对象-全部
            checkFollowObjecAll(v) {
                // this.followObjec = v ? this.followObjecList : [];
                // this.followObjecIndeter = false;
                this.followObjec = [];
            },
            //跟进对象-单选
            checkFollowObjec(v) {
                // let checkedCount = v.length;
                // this.followObjecAll = checkedCount === this.followObjecList.length;
                // this.followObjecIndeter = checkedCount > 0 && checkedCount < this.followObjecList.length;
                this.followObjecAll = false;
            },
            //跟进方式-全部
            checkFollowWayAll(v) {
                // this.followWay = v ? this.followWayList : [];
                // this.followWayIndeter = false;
                this.followWay = [];
            },
            //跟进方式-单选
            checkFollowWay(v) {
                // let checkedCount = v.length;
                // this.followWayAll = checkedCount === this.followWayList.length;
                // this.followWayIndeter = checkedCount > 0 && checkedCount < this.followWayList.length;
                this.followWayAll = false;
            },
            //切换时间
            changeDateRadio(v) {
                let now = new Date(), newDate;
                if(v === '全部') {
                    this.datePicker = ['', ''];
                    return false;
                } else if(v === '今天') {
                    newDate = now;
                } else if(v === '昨天') {
                    newDate = this.comm.commDateModified("day", 1, now, '-');
                    this.datePicker = [this.comm.formatDate(newDate, 'yyyy-MM-dd'), this.comm.formatDate(newDate, 'yyyy-MM-dd')];
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
                let LstTarget = [], LstMethod = [];
                this.followObjec.map(item => {
                    LstTarget.push(item.BO_Value);
                })
                this.followWay.map(item => {
                    LstMethod.push(item.BO_Value);
                })
                const params = {
                    LstTarget: LstTarget,
                    LstMethod: LstMethod,
                    StartDate: this.datePicker ? this.datePicker[0] : '',
                    EndDate: this.datePicker ? this.datePicker[1] : '',
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/FollowApi/GetPageFollow', params)
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
                this.followObjecAll = true;
                this.checkFollowObjecAll(true);
                this.followWayAll = true;
                this.checkFollowWayAll(true);
                this.dateRadio = '今天';
                this.changeDateRadio(this.dateRadio);
            }
        }
    }
</script>

<style scoped>
    .card-box {
        margin-bottom: 20px;
    }
    .record-item .record-head {
        display: flex;
        font-size: 12px;
        justify-content: space-between;
        align-items: center;
    }
    .record-item .record-head .title {
        color: red;
    }
    .record-item .record-body {
        margin: 20px 0 10px;
    }
    .record-item .record-foot {
        font-size: 14px;
        color: #666666;
    }
    .no-data {
        height: 200px;
        line-height: 200px;
        color: #666666;
        text-align: center;
        background-color: #ffffff;
    }
</style>