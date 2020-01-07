<!-- 机会 -->
<template>
    <div class="container">
        <v-top>
            <div class="v-top-left-title" slot="leftTitle"><img class="icon" src="static/images/nav/icon_chance_hover.png" />機會</div>
        </v-top>
        <div class="condition">
            <table class="condition-table">
                <tr>
                    <th>關聯產品</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="relatedProductsAll" size="mini" border :indeterminate="relatedProductsIndeter" @change="checkRelatedProductsAll">全部</el-checkbox>
                        <el-checkbox-group v-model="relatedProducts" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkRelatedProducts">
                            <el-checkbox v-for="(item, index) in relatedProductsList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <th>機會狀態</th>
                    <td>
                        <el-checkbox class="fl m5 checkbox-condition" v-model="chanceStatusAll" size="mini" border :indeterminate="chanceStatusIndeter" @change="checkChanceStatusAll">全部</el-checkbox>
                        <el-checkbox-group v-model="chanceStatus" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkChanceStatus">
                            <el-checkbox v-for="(item, index) in chanceStatusList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
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
                        <el-input class="w200" v-model="keywords" size="mini" maxlength="10" placeholder="請輸入客戶姓名或機會名稱" />
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
                <el-table-column label="機會名稱" prop="BC_Name" align="center"></el-table-column>
                <el-table-column label="所屬客戶" prop="Cst_Name" align="center"></el-table-column>
                <el-table-column label="關聯產品" prop="BC_RelationProduct" align="center"></el-table-column>
                <el-table-column label="機會狀態" prop="BC_Status" align="center"></el-table-column>
                <el-table-column label="預計成單金額" align="center">
                    <template slot-scope="scope">{{scope.row.BC_Currency}} {{comm.formatMoney(scope.row.BC_MoneyEstimate, 0)}}</template>
                </el-table-column>
                <el-table-column label="預計成單時間" align="center">
                    <template slot-scope="scope">{{scope.row.BC_SignDateEstimate | hkDate('date')}}</template>
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template slot-scope="scope">
                        <template v-if="scope.row.BC_Status === '有效'">
                            <el-button type="primary" size="mini" @click="showChanceDialog('編輯機會', scope.row)">編輯</el-button>
                            <el-button type="warning" size="mini" @click="showSubcontractDialog(scope.row)">轉合同</el-button>
                            <el-button type="danger" size="mini" @click="closeChance(scope.row.BC_ID)">關閉</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" v-if="total > 0">
                <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
                </el-pagination>
            </div>
        </div>
        <!-- 新增机会弹框、编辑机会弹框 -->
        <v-chance-dialog v-if="isChanceDialog" :dialogChanceTitle="dialogChanceTitle" :dialogChanceData="dialogChanceData" @hideChanceDialog="hideChanceDialog"></v-chance-dialog>
        <!-- 转合同弹框 -->
        <v-subcontract-dialog v-if="isSubcontractDialog" dialogSubcontracTitle="轉合同" :dialogSubcontractData="dialogSubcontractData" @hideSubcontractDialog="hideSubcontractDialog"></v-subcontract-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VChanceDialog from '@/components/common/VChanceDialog.vue';
    import VSubcontractDialog from '@/components/common/VSubcontractDialog.vue';
    export default {
        name: 'chanceIndex',
        data() {
            return {
                keywords: '', //关键词
                relatedProductsIndeter: false,
                relatedProductsAll: true,    //所在地区-全部
                relatedProductsList: [],   //所在地区
                relatedProducts: [], //所在地区-选择的
                chanceStatusIndeter: false,
                chanceStatusAll: true,  //客户状态-全部
                chanceStatusList: [], //客户状态
                chanceStatus: [], //客户状态-选择的
                dateRadio: '近一周',  //时间
                datePicker: [], //时间框
                tableData: [],  //数据列表
                total: 0,   //总条数
                PageIndex: 1,   //当前页
                PageSize: 10, //页条数
                isChanceDialog: false,  //新增机会弹框
                dialogChanceTitle: '',  //新增机会弹框标题
                isSubcontractDialog: false, //转合同弹框是否显示
                dialogSubcontractData: {}  //转合同弹框数据
            }
        },
        components: {
            VTop,
            VChanceDialog,
            VSubcontractDialog
        },
        mounted() {
            Promise.all(
                [
                    this.$store.dispatch('getTypeData', '產品類型'),
                    this.$store.dispatch('getTypeData', '機會狀態')
                ]
            ).then(() => {
                this.relatedProductsList = this.$store.state.relatedProductsList;
                // this.relatedProducts = this.$store.state.relatedProductsList;
                this.chanceStatusList = this.$store.state.chanceStatusList;
                // this.chanceStatus = this.$store.state.chanceStatusList;
                this.getData();
            })
            this.changeDateRadio(this.dateRadio);
        },
        methods: {
            //关联产品-全部
            checkRelatedProductsAll(v) {
                // this.relatedProducts = v ? this.relatedProductsList : [];
                // this.relatedProductsIndeter = false;
                this.relatedProducts = [];
            },
            //关联产品-单选
            checkRelatedProducts(v) {
                // let checkedCount = v.length;
                // this.relatedProductsAll = checkedCount === this.relatedProductsList.length;
                // this.relatedProductsIndeter = checkedCount > 0 && checkedCount < this.relatedProductsList.length;
                this.relatedProductsAll = false;
            },
            //机会状态-全部
            checkChanceStatusAll(v) {
                // this.chanceStatus = v ? this.chanceStatusList : [];
                // this.chanceStatusIndeter = false;
                this.chanceStatus = [];
            },
            //机会状态-单选
            checkChanceStatus(v) {
                // let checkedCount = v.length;
                // this.chanceStatusAll = checkedCount === this.chanceStatusList.length;
                // this.chanceStatusIndeter = checkedCount > 0 && checkedCount < this.chanceStatusList.length;
                this.chanceStatusAll = false;
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
                let LstProduct = [], LstChanceStatus = [];
                this.relatedProducts.map(item => {
                    LstProduct.push(item.BO_Value);
                })
                this.chanceStatus.map(item => {
                    LstChanceStatus.push(item.BO_Value);
                })
                const params = {
                    LstProduct: LstProduct,
                    LstChanceStatus: LstChanceStatus,
                    StartDate: this.datePicker ? this.datePicker[0] : '',
                    EndDate: this.datePicker ? this.datePicker[1] : '',
                    Keyword: this.keywords,
                    PageIndex: this.PageIndex,
                    PageSize: this.PageSize
                }
                this.$post('/api/chanceApi/GetPagechance', params)
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
                this.relatedProductsAll = true;
                this.checkRelatedProductsAll(true);
                this.chanceStatusAll = true;
                this.checkChanceStatusAll(true);
                this.dateRadio = '近一周';
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
            //新增機會弹框-显示
            showChanceDialog(str, obj = {}) {
                this.dialogChanceTitle = str;
                this.dialogChanceData = obj;
                this.isChanceDialog = true;
            },
            //新增機會弹框-隐藏
            hideChanceDialog(v) {
                if(v) {
                    this.queryData();
                }
                this.isChanceDialog = false;
            },
            //转合同弹框-显示
            showSubcontractDialog(obj) {
                this.dialogSubcontractData = obj;
                this.isSubcontractDialog = true;
            },
            //转合同弹框-隐藏
            hideSubcontractDialog(v) {
                if(v) {
                    this.queryData();
                }
                this.isSubcontractDialog = false;
            },
            //机会-关闭
            closeChance(id) {
                const h = this.$createElement;
                this.$confirm('', '提示', {
                    message: h('div', null, [
                        h('div', {style: 'marginBottom:10px; fontSize:16px'}, '確定將關閉機會嗎? '),
                        h('div', {style: 'fontSize:12px;'}, '修改後無法恢復，請謹慎操作！')
                    ]),
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/ChanceApi/CloseChance', { BC_ID: id })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: '已關閉機會'
                        });
                        this.queryData();
                    });
                }).catch(() => {
                        
                });
            }
        }
    }
</script>