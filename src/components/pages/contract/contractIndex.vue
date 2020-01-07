<!-- 合同 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_contract_hover.png" />合同</div>
            <div class="v-top-title" slot="title">
                <el-radio-group v-model="contractStatus" class="radio-group-ec0928" size="mini" @change="changeContractStatus">
                    <el-radio-button :label="0">pending</el-radio-button>
                    <el-radio-button :label="1">正式保單</el-radio-button>
                    <el-radio-button :label="2">異常保單</el-radio-button>
                </el-radio-group>
            </div>
        </v-top>
        <div class="condition">
            <table class="condition-table">
                <tr>
                    <th>產品名稱</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="productTypeAll" size="mini" border :indeterminate="productTypeIndeter" @change="checkProductTypeAll">全部</el-checkbox>
                        <el-checkbox-group v-model="productType" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkProductType">
                            <el-checkbox v-for="(item, index) in productTypeList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr v-if="contractStatus === 0">
                    <th>所屬階段</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="theirStageAll" size="mini" border :indeterminate="theirStageIndeter" @change="checkTheirStageAll">全部</el-checkbox>
                        <el-checkbox-group v-model="theirStage" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkTheirStage">
                            <el-checkbox v-for="(item, index) in theirStageList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr v-if="contractStatus === 2">
                    <th>狀態</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="theirStageAll" size="mini" border :indeterminate="theirStageIndeter" @change="checkTheirStageAll">全部</el-checkbox>
                        <el-checkbox-group v-model="theirStage" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkTheirStage">
                            <el-checkbox v-for="(item, index) in exceptionStatusList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>時　間</th>
                    <td>
                        <template v-if="contractStatus === 0 || contractStatus === 2">
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
                        </template>
                        <template v-else>
                            <el-radio-group size="mini" class="v-radio-group radio-group-condition" v-model="dateRadio" @change="changeDateRadio">
                                <el-radio label="全部" border></el-radio>
                                <el-radio label="下一月" border>30天內到期</el-radio>
                                <el-radio label="今天" border>過期保單</el-radio>
                            </el-radio-group>
                            <el-date-picker
                                v-show="false"
                                size="mini"
                                v-model="datePicker"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="開始日期"
                                end-placeholder="結束日期"
                                value-format="yyyy-MM-dd"
                                @change="selectDateRadio">
                            </el-date-picker>
                        </template>
                    </td>
                </tr>
                <tr>
                    <th>關鍵詞</th>
                    <td>
                        <el-input class="w200" v-model="keywords" size="mini" maxlength="10" :placeholder="(contractStatus === 0 || contractStatus === 2) ? '請輸入客戶姓名' : '請輸入保單號或客戶姓名'" />
                    </td>
                </tr>
            </table>
            <div class="p10" align="center">
                <el-button class="btn-ec0928" type="primary" size="mini" @click="queryData">查詢</el-button>
                <el-button type="info" size="mini" @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="content">
            <el-table :data="tableData" empty-text="暫無數據" :key="contractStatus">
                <el-table-column v-if="contractStatus === 1" label="保單號" prop="BC_OrderNo" align="center"></el-table-column>
                <el-table-column label="合同名稱" prop="BC_OrderName" align="center"></el-table-column>
                <el-table-column label="產品名稱" prop="BC_OrderProductType" align="center"></el-table-column>
                <el-table-column label="保單費用" align="center">
                    <template slot-scope="scope">{{scope.row.BC_OrderCurrency}} {{comm.formatMoney(scope.row.BC_OrderMoney, 2)}}</template>
                </el-table-column>
                <el-table-column label="投保客戶" prop="Cst_Name" align="center"></el-table-column>
                <el-table-column v-if="contractStatus !== 1" label="所屬階段" prop="BC_OrderStatus" align="center"></el-table-column>
                <el-table-column v-if="contractStatus !== 1" label="更新時間" align="center">
                    <template slot-scope="scope">{{scope.row.BC_OrderUpdateTime | hkDate('date')}}</template>
                </el-table-column>
                <el-table-column v-if="contractStatus === 1" label="生效日期" align="center">
                    <template slot-scope="scope">{{scope.row.BC_OrderStartDate | hkDate('date')}}</template>
                </el-table-column>
                <el-table-column v-if="contractStatus === 1" label="過期日期" align="center">
                    <template slot-scope="scope">{{scope.row.BC_OrderEndDate | hkDate('date')}}</template>
                </el-table-column>
                <el-table-column v-if="contractStatus === 1" label="狀態" prop="OverdueStatus" align="center"></el-table-column>
                <el-table-column v-if="contractStatus === 0" label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.BC_OrderStatus === '等待體檢' || scope.row.BC_OrderStatus === '等待核保' || scope.row.BC_OrderStatus === '照會' || scope.row.BC_OrderStatus === '冷靜期'" type="primary" size="mini" @click="contractPass(scope.row.BC_OrderStatus, scope.row.BC_ID)">{{returnPass(scope.row.BC_OrderStatus)}}</el-button>
                        <el-button v-if="scope.row.BC_OrderStatus === '等待體檢'" type="warning" size="mini" @click="contractNote(scope.row.BC_ID)">照會</el-button>
                        <el-button v-if="scope.row.BC_OrderStatus === '等待體檢' || scope.row.BC_OrderStatus === '等待核保' || scope.row.BC_OrderStatus === '照會'" type="danger" size="mini" @click="contractDeclinature(scope.row.BC_ID)">拒保</el-button>
                        <el-button v-if="scope.row.BC_OrderStatus === '冷靜期'" type="danger" size="mini" @click="contractSurrender(scope.row.BC_ID)">退保</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-if="total > 0">
                <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
                </el-pagination>
            </div>
        </div>
        <!-- 补充保单资料弹框 -->
        <v-policy-info-dialog v-if="isPolicyInfoDialog" dialogPolicyInfoTitle="補充保單資料" :dialogPolicyInfoId="dialogPolicyInfoId" @hidePolicyInfoDialog="hidePolicyInfoDialog"></v-policy-info-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VPolicyInfoDialog from '@/components/common/VPolicyInfoDialog.vue';
    import { mixin } from '@/utils/common';
    export default {
        mixins: [mixin],
        name: 'contractIndex',
        data() {
            return {
                contractStatus: parseInt(this.parseURL('index')) || 0,
                keywords: '', //关键词
                productTypeIndeter: false,
                productTypeAll: true,    //产品名称-全部
                productTypeList: [],   //产品名称
                productType: [], //产品名称-选择的
                theirStageIndeter: false,
                theirStageAll: true,  //所属阶段-全部
                theirStageList: [], //所属阶段
                theirStage: [], //所属阶段-选择的
                exceptionStatusList: [
                    {
                        BO_Value: '拒保'
                    },
                    {
                        BO_Value: '退保'
                    }
                ],
                dateRadio: '近一周',  //时间
                datePicker: [], //时间框
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
                isPolicyInfoDialog: false,  //补充保单资料弹框
                dialogPolicyInfoId: ''  //补充保单资料弹框-参数ID
            }
        },
        components: {
            VTop,
            VPolicyInfoDialog
        },
        mounted() {
            this.dateRadio = this.contractStatus === 1 ? '全部' : '近一周'
            this.changeDateRadio(this.dateRadio);
            Promise.all(
                [
                    this.$store.dispatch('getTypeData', '產品類型'),
                    this.$store.dispatch('getTypeData', '保單狀態')
                ]
            ).then(() => {
                this.productTypeList = this.$store.state.relatedProductsList;
                // this.productType = this.$store.state.relatedProductsList;
                this.theirStageList = this.$store.state.policyStatusList;
                // this.theirStage = this.$store.state.policyStatusList;
                if(this.$route.query.text === sessionStorage.getItem('fc_userid')) {
                    this.contractStatus = 1;
                    this.dateRadio = '下一月';
                    this.changeDateRadio(this.dateRadio)
                }
                this.getData();
            })
        },
        methods: {
            //根据所属阶段来返回按钮文字
            returnPass(v) {
                let txt = '';
                switch(v) {
                    case '等待體檢':
                        txt = '體檢通過';
                    break;
                    case '等待核保':
                        txt = '批核通過';
                    break;
                    case '照會':
                        txt = '照會通過';
                    break;
                    default:
                        txt = '通過';
                }
                return txt;
            },
            //合同状态
            changeContractStatus() {
                this.resetForm();
                // if(Object.keys(this.$route.query).length && this.contractStatus === 1) {
                //     this.dateRadio = '下一月';
                //     this.changeDateRadio(this.dateRadio)
                // }
                this.queryData();
            },
            //产品名称-全部
            checkProductTypeAll(v) {
                // this.productType = v ? this.productTypeList : [];
                // this.productTypeIndeter = false;
                this.productType = [];
            },
            //产品名称-单选
            checkProductType(v) {
                // let checkedCount = v.length;
                // this.productTypeAll = checkedCount === this.productTypeList.length;
                // this.productTypeIndeter = checkedCount > 0 && checkedCount < this.productTypeList.length;
                this.productTypeAll = false;
            },
            //所属阶段-全部
            checkTheirStageAll(v) {
                // this.theirStage = v ? this.theirStageList : [];
                // this.theirStageIndeter = false;
                this.theirStage = [];
            },
            //所属阶段-单选
            checkTheirStage(v) {
                // let checkedCount = v.length;
                // this.theirStageAll = checkedCount === this.theirStageList.length;
                // this.theirStageIndeter = checkedCount > 0 && checkedCount < this.theirStageList.length;
                this.theirStageAll = false;
            },
            //切换时间
            changeDateRadio(v) {
                let now = new Date(), newDate;
                if(v === '全部') {
                    this.datePicker = ['', ''];
                    return false;
                } else if(v === '今天') {
                    this.datePicker = ['', this.comm.formatDate(new Date(), 'yyyy-MM-dd')];
                    return false;
                } else if(v === '近一周') {
                    newDate = this.comm.commDateModified("week", 1, now, '-');
                } else if(v === '近一月') {
                    newDate = this.comm.commDateModified("month", 1, now, '-');
                } else if(v === '下一月') {
                    newDate = this.comm.commDateModified("month", 1, now, '+');
                    this.datePicker = [this.comm.formatDate(new Date(), 'yyyy-MM-dd'), this.comm.formatDate(newDate, 'yyyy-MM-dd')];
                    return false;
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
                let LstProduct = [], LstOrderStatus = [], params = {};
                this.productType.map(item => {
                    LstProduct.push(item.BO_Value);
                })
                this.theirStage.map(item => {
                    LstOrderStatus.push(item.BO_Value);
                })
                if(this.contractStatus === 0 || this.contractStatus === 2) {
                    params = {
                        StatusType: this.contractStatus,
                        LstProduct: LstProduct,
                        LstOrderStatus: LstOrderStatus,
                        StartDate: this.datePicker ? this.datePicker[0] : '',
                        EndDate: this.datePicker ? this.datePicker[1] : '',
                        Keyword: this.keywords,
                        PageIndex: this.PageIndex,
                        PageSize: this.PageSize
                    }
                } else {
                    params = {
                        StatusType: this.contractStatus,
                        LstProduct: LstProduct,
                        OverdueStartDate: this.datePicker ? this.datePicker[0] : '',
                        OverdueEndDate: this.datePicker ? this.datePicker[1] : '',
                        Keyword: this.keywords,
                        PageIndex: this.PageIndex,
                        PageSize: this.PageSize
                    }
                }
                this.$post('/api/ChanceApi/GetPageContract', params)
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
                this.productTypeAll = true;
                this.checkProductTypeAll(true);
                this.theirStageAll = true;
                this.checkTheirStageAll(true);
                if(this.contractStatus === 0 || this.contractStatus === 2) {
                    if(this.contractStatus === 0) {
                        // this.theirStage = this.$store.state.policyStatusList;
                        this.theirStageList = this.$store.state.policyStatusList;
                    } else if(this.contractStatus === 2) {
                        // this.theirStage = this.exceptionStatusList;
                        this.theirStageList = this.exceptionStatusList;
                    }
                    this.dateRadio = '近一周';
                } else {
                    this.dateRadio = '全部';
                }
                this.changeDateRadio(this.dateRadio);
                this.keywords = '';
            },
            //查看详情
            lookDetails(obj) {
                this.$router.push({
                    path: '/chanceDetails',
                    query: {
                        obj: JSON.stringify({
                            Busi_CID: obj.Busi_CID,
                            Busi_CFrom: obj.Busi_CFrom
                        })
                    }
                });
            },
            //补充保单资料弹框-显示
            showPolicyInfoDialog(id) {
                this.dialogPolicyInfoId = id;
                this.isPolicyInfoDialog = true;
            },
            //补充保单资料弹框-隐藏
            hidePolicyInfoDialog(v) {
                if(v) {
                    this.queryData();
                }
                this.isPolicyInfoDialog = false;
            },
             //合同-通过
            contractPass(str, id) {
                if(str === '等待核保') {
                    this.showPolicyInfoDialog(id);
                } else {
                    let title = '';
                    let url = '';
                    switch(str) {
                        case '等待體檢':
                            {
                                title = '確定體檢通過嗎?';
                                url = '/api/ChanceApi/PHExamPass';
                            }
                        break;
                        case '照會':
                            {
                                title = '確定照會通過嗎?';
                                url = '/api/ChanceApi/NotePass';
                            }
                        break;
                        case '冷靜期':
                            {
                                title = '確定通過冷靜期嗎?';
                                url = '/api/ChanceApi/CoolingOffPass';
                            }
                        break;
                    }
                    this.$confirm(title, '提示', {
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                        closeOnClickModal: false,
                        type: 'warning'
                    }).then(() => {
                        this.$post(url, { BC_ID: id })
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: str + '-通過'
                            });
                            this.queryData();
                        });
                    }).catch(() => {
                        
                    });
                }
            },
            //合同-照会
            contractNote(id) {
                this.$confirm('確定進行照會嗎?', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/ChanceApi/Note', { BC_ID: id })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '照會成功'
                        });
                        this.queryData();
                    });
                }).catch(() => {
                    
                });
            },
            //合同-拒保
            contractDeclinature(id) {
                this.$confirm('確定不予承保嗎?', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/ChanceApi/Refuse', { BC_ID: id })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '拒保成功'
                        });
                        this.queryData();
                    });
                }).catch(() => {
                       
                });
            },
            //合同-退保
            contractSurrender(id) {
                this.$confirm('確定進行退保嗎?', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/ChanceApi/ReturnBack', { BC_ID: id })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '退保成功'
                        });
                        this.queryData();
                    });
                }).catch(() => {
                       
                });
            }
        }
    }
</script>