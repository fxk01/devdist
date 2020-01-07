<!-- 公海池-销售总监 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_pool_hover.png" />公海池</div>
            <div class="v-top-title" slot="title">
                <el-radio-group v-model="processState" class="radio-group-ec0928" size="mini" @change="changeProcessState">
                    <el-radio-button :label="0">未處理</el-radio-button>
                    <el-radio-button :label="1">已處理</el-radio-button>
                </el-radio-group>
            </div>
            <div class="v-top-operation" slot="correlation">
                <el-button v-if="processState === 0" class="btn-ec0928" type="primary" size="mini" icon="el-icon-tickets" @click="showAllocationDialog('批量分配', tableChecked)">批量分配</el-button>
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
                    <th>渠道來源</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="placeAll" size="mini" border :indeterminate="placeIndeter" @change="checkplaceAll">全部</el-checkbox>
                        <el-checkbox-group v-model="place" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkplace">
                            <el-checkbox v-for="(item, index) in placeList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr v-if="processState === 0">
                    <th>狀　態</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="statusAll" size="mini" border :indeterminate="statusIndeter" @change="checkstatusAll">全部</el-checkbox>
                        <el-checkbox-group v-model="status" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkstatus">
                            <el-checkbox v-for="(item, index) in statusList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
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
                <el-button type="info" size="mini" @click="resetForm(0)">重置</el-button>
            </div>
        </div>
        <div class="content">
            <el-table :data="tableData" empty-text="暫無數據" @selection-change="tableSelectionChange">
                <el-table-column v-if="processState === 0" type="selection" width="50" align="center" :selectable="isSelectable"></el-table-column>
                <el-table-column label="客戶姓名" prop="Busi_CName" align="center"></el-table-column>
                <el-table-column label="渠道來源" prop="Busi_CFromDtl" align="center"></el-table-column>
                <el-table-column label="所在地區" prop="Busi_CLocation" align="center"></el-table-column>
                <el-table-column label="更新時間" align="center">
                    <template slot-scope="scope">{{scope.row.Busi_CUpdateTime | hkDate('dateHM')}}</template>
                </el-table-column>
                <el-table-column label="狀態" prop="Busi_CStatus" align="center"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" plain @click="lookDetails(scope.row)">查看詳情</el-button>
                        <el-button v-if="scope.row.Busi_CStatus === '有效'" type="primary" size="mini" @click="showAllocationDialog('分配客戶', [scope.row])">分配客戶</el-button>
                        <el-button v-if="scope.row.Busi_CStatus === '有效'" type="warning" size="mini" @click="setInvalid(scope.row)">設為無效</el-button>
                        <el-button v-if="scope.row.Busi_CStatus === '無效'" type="danger" size="mini" @click="delItem(scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-if="total > 0">
                <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
                </el-pagination>
            </div>
        </div>
        <!-- 批量分配弹框、分配客戶弹框 -->
        <v-allocation-dialog v-if="isAllocationDialog" :dialogAllocationData="dialogAllocationData" @hideAllocationDialog="hideAllocationDialog"></v-allocation-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VAllocationDialog from '@/components/common/clue/VAllocationDialog.vue';
    export default {
        name: 'poolGmIndex',
        data() {
            return {
                processState: 0,
                keywords: '', //关键词
                regionIndeter: false,
                regionAll: true,
                regionList: [],
                region: [], //所在地区
                placeIndeter: false,
                placeAll: true,
                placeList: [],
                place: [], //渠道来源
                statusIndeter: false,
                statusAll: true,
                statusList: [],
                status: [], //状态
                dateRadio: '近一周',  //时间
                datePicker: [], //时间框
                tableData: [],  //数据列表
                tableChecked: [],   //表格多选框
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
                isAllocationDialog: false,  //批量分配弹框、分配客户弹框是否显示
                dialogAllocationData: [],   //批量分配弹框、分配客户弹框传入的数据
            }
        },
        components: {
            VTop,
            VAllocationDialog
        },
        mounted() {
            Promise.all(
                [
                    this.$store.dispatch('getRegionData', '中國香港'),
                    this.$store.dispatch('getTypeData', '渠道來源'),
                    this.$store.dispatch('getTypeData', '總監未處理')
                ]
            ).then(res => {
                this.regionList = this.$store.state.regionList;
                // this.region = this.$store.state.regionList;
                this.placeList = this.$store.state.channelList;
                // this.place = this.$store.state.channelList;
                this.statusList = this.$store.state.poolStatusList;
                // this.status = this.$store.state.poolStatusList;
                if(this.$route.query.text === sessionStorage.getItem('fc_userid')) {
                    this.statusAll = false;
                    this.status = this.statusList.filter(item => item.BO_Value === '有效');
                    this.dateRadio = '全部';
                    this.datePicker = ['', ''];
                }
                this.getData();
            })
            this.changeDateRadio(this.dateRadio);
        },
        methods: {
            //切换未处理、已处理
            changeProcessState(v) {
                this.resetForm(v);
                if(v === 1) {
                    this.$store.dispatch('getTypeData', '總監已處理').then(res => {
                        this.statusList = this.$store.state.poolStatusList;
                        this.queryData();
                    });
                } else {
                    this.$store.dispatch('getTypeData', '總監未處理').then(res => {
                        this.statusList = this.$store.state.poolStatusList;
                        // this.status = this.$store.state.poolStatusList;
                        this.queryData();
                    });
                }
            },
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
            //渠道来源-全部
            checkplaceAll(v) {
                // this.place = v ? this.placeList : [];
                // this.placeIndeter = false;
                this.place = [];
            },
            //渠道来源-单选
            checkplace(v) {
                // let checkedCount = v.length;
                // this.placeAll = checkedCount === this.placeList.length;
                // this.placeIndeter = checkedCount > 0 && checkedCount < this.placeList.length;
                this.placeAll = false;
            },
            //状态-全部
            checkstatusAll(v) {
                // this.status = v ? this.statusList : [];
                // this.statusIndeter = false;
                this.status = [];
            },
            //状态-单选
            checkstatus(v) {
                // let checkedCount = v.length;
                // this.statusAll = checkedCount === this.statusList.length;
                // this.statusIndeter = checkedCount > 0 && checkedCount < this.statusList.length;
                this.statusAll = false;
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
                let LstLocation = [], LstFromDtl = [], LstStatus = [];
                this.region.map(item => {
                    LstLocation.push(item.BC_Name);
                })
                this.place.map(item => {
                    LstFromDtl.push(item.BO_Value);
                })
                this.status.map(item => {
                    LstStatus.push(item.BO_Value);
                })
                const params = {
                    DealType: this.processState,
                    LstLocation: this.regionAll ? [] : LstLocation,
                    LstFromDtl: LstFromDtl,
                    LstStatus:  this.processState === 0 ? LstStatus : [],
                    StartDate: this.datePicker ? this.datePicker[0] : '',
                    EndDate: this.datePicker ? this.datePicker[1] : '',
                    Keyword: this.keywords,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/ClueApi/GetPagePoolByChief', params)
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
            resetForm(v) {
                this.processState = v;
                this.regionAll = true;
                this.checkRegionAll(true);
                this.placeAll = true;
                this.checkplaceAll(true);
                this.statusAll = true;
                this.checkstatusAll(true);
                this.dateRadio = '近一周';
                this.changeDateRadio(this.dateRadio);
                this.keywords = '';
            },
            //表格多选框是否可勾选
            isSelectable(row) {
                if(row.Busi_CStatus === '有效') {
                    return true;
                } else {
                    return false;
                }
            },
            //表格选择
            tableSelectionChange(arr) {
                this.tableChecked = arr;
            },
            //分配客户弹框-显示
            showAllocationDialog(str = '', arr = []) {
                if(str === '批量分配' && arr.length === 0) {
                    this.$message.closeAll();
                    this.$message.error('請勾選需要分配的項');
                    return false;
                }
                this.dialogAllocationData = arr;
                this.isAllocationDialog = true;
            },
            //分配客户弹框-隐藏
            hideAllocationDialog(v) {
                if(v) {
                    this.queryData();
                }
                this.isAllocationDialog = false;
            },
            //查看详情
            lookDetails(obj) {
                this.$router.push({
                    path: '/poolGmDetails',
                    query: {
                        obj: JSON.stringify({
                            Busi_CID: obj.Busi_CID,
                            Busi_TeamID: obj.Busi_TeamID,
                            Busi_CName: obj.Busi_CName,
                            Busi_CStatus: obj.Busi_CStatus,
                            Stf_ID: obj.Stf_ID
                        })
                    }
                });
            },
            //设为无效
            setInvalid(obj){
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定將狀態改為“無效”嗎?'),
                        h('div', {style: 'fontSize:12px;'}, '修改後無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/ClueApi/SetClueInvalid', { Busi_CID: obj.Busi_CID })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '設置成功'
                        });
                        this.queryData();
                    });
                }).catch(() => {
                        
                });
            },
            //删除
            delItem(obj) {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定要刪除客戶記錄嗎?'),
                        h('div', {style: 'fontSize:12px;'}, '修改後無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/ClueApi/DelClue', { Busi_CID: obj.Busi_CID })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.queryData();
                    });
                }).catch(() => {
                        
                });
            }
        },
        activated() {
            this.queryData();
        }
    }
</script>