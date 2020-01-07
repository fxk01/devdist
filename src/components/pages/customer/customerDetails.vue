<!-- 客户详情 -->
<template>
    <div class="container">
        <v-top>
            <a class="v-top-return" slot="return" href="javascript:;" @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>返回</a>
            <div class="v-top-title" slot="title">客戶詳情</div>
        </v-top>
        <v-customer-info :customerData="customerData"></v-customer-info>
        <div class="v-tabs pr">
            <div v-if="staffIdentity === '保險代理人'" class="correlation-box">
                <el-button v-if="activeName === 'salesData'" class="btn-transparent-ec0928" type="primary" size="mini" icon="el-icon-edit-outline" @click="showFollowDialog">寫跟進</el-button>
                <el-button v-if="activeName === 'detailedInfo' && !analysisList" class="btn-transparent-ec0928" type="primary" size="mini" icon="el-icon-tickets" @click="showAccountsDialog('新增財務分析')">新增財務分析</el-button>
                <el-button v-if="activeName === 'detailedInfo'" class="btn-transparent-ec0928" type="primary" size="mini" icon="el-icon-edit" @click="showCustomerDialog">編輯</el-button>
                <el-button v-if="activeName === 'chance'" class="btn-transparent-ec0928" type="primary" size="mini" icon="el-icon-plus" @click="showChanceDialog('新增機會')">新增</el-button>
            </div>
            <el-tabs v-model="activeName" @tab-click="tabSwitch">
                <el-tab-pane label="銷售動態" name="salesData">
                    <div class="v-tabs-body">
                        <v-step :key="isUpdateStep" stepType="客戶"></v-step>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="詳細信息" name="detailedInfo">
                    <v-customer-details :customerData="customerData"></v-customer-details>
                    <v-module v-if="analysisList">
                        <div slot="module-head" class="module-head">
                            <div class="title">財務分析結果</div>
                            <div v-if="staffIdentity === '保險代理人'" class="correlation">
                                <el-button class="btn-text-ec0928" type="text" @click="showAccountsDialog('編輯財務分析', analysisList)">編輯財務分析</el-button>
                                <el-button class="btn-text-ec0928" type="text" @click="showAccountsDialog('更新財務分析')">更新財務分析</el-button>
                            </div>
                        </div>
                        <div slot="module-body">
                            <el-form label-width="120px">
                                <el-form-item label="完成時間：">{{analysisList.BFA_FinAnalysisDate | hkDate('date')}}</el-form-item>
                                <el-form-item label="分析結果：">{{analysisList.BFA_FinAnalysisResult}}</el-form-item>
                                <el-form-item label="分析說明：">{{analysisList.BFA_FinAnalysisDescription}}</el-form-item>
                                <el-form-item label="狀態：">{{analysisList.IsValidity ? '有效' : '無效'}}</el-form-item>
                            </el-form>
                        </div>
                    </v-module>
                </el-tab-pane>
                <el-tab-pane label="機會" name="chance" class="toggle-slide">
                    <template v-if="chanceList.length">
                        <div v-for="(item, index) in chanceList" :key="index" class="unfold-box">
                            <div class="unfold-head">
                                <span class="title">{{item.BC_Name | subString(20)}}</span>
                                <span class="stage">當前階段：<span :class="{'c-0099ff': item.BC_Status === '有效', 'c-ff003a': item.BC_Status === '已成單', 'c-666666': item.BC_Status === '已關閉'}">{{item.BC_Status}}</span></span>
                                <span class="date">更新時間：<span class="c-000000">{{item.BC_UpdateTime | hkDate('dateHM')}}</span></span>
                                <div v-if="item.BC_Status === '有效' && staffIdentity === '保險代理人'" class="fr">
                                    <el-button class="btn-text-ec0928" type="text" size="mini" @click="showChanceDialog('編輯機會', item)">編輯</el-button>
                                    <el-button class="btn-text-ec0928" type="text" size="mini" @click="showSubcontractDialog(item)">轉合同</el-button>
                                    <el-button class="btn-text-ec0928" type="text" size="mini" @click="closeChance(item.BC_ID)">關閉</el-button>
                                </div>
                                <i :class="{'unfold-icon': true, 'el-icon-arrow-up': index === 0, 'el-icon-arrow-down': index > 0}"></i>
                            </div>
                            <div v-show="index === 0 ? true : false" class="unfold-body">
                                <el-form label-width="120px">
                                    <el-form-item label="預計保單金額：">{{item.BC_Currency}} {{comm.formatMoney(item.BC_MoneyEstimate, 2)}}</el-form-item>
                                    <el-form-item label="銷售階段：">{{item.BC_Step}}</el-form-item>
                                    <el-form-item label="關聯產品：">{{item.BC_RelationProduct}}</el-form-item>
                                    <el-form-item label="預計簽單日期：">{{item.BC_SignDateEstimate | hkDate('date')}}</el-form-item>
                                    <el-form-item label="預計獲取日期：">{{item.BC_CreateDate | hkDate('date')}}</el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="no-date">暫無數據</div>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="合同" name="contract" class="toggle-slide">
                    <template v-if="contractList.length">
                        <div v-for="(item, index) in contractList" :key="index" class="unfold-box">
                            <div class="unfold-head">
                                <span class="title">保單號：{{item.BC_OrderNo ? item.BC_OrderNo : '--'}}</span>
                                <span class="stage">當前階段：<span :class="{'c-ff003a': (item.BC_OrderStatus === '等待體檢' || item.BC_OrderStatus === '等待核保' || item.BC_OrderStatus === '照會' || item.BC_OrderStatus === '冷靜期' || item.BC_OrderStatus === '正式'), 'c-666666': (item.BC_OrderStatus === '退保' || item.BC_OrderStatus === '拒保')}">{{item.BC_OrderStatus}}</span></span>
                                <span class="date">更新時間：<span class="c-000000">{{item.BC_OrderUpdateTime | hkDate('dateHM')}}</span></span>
                                <div v-if="staffIdentity === '保險代理人'" class="fr">
                                    <el-button v-if="item.BC_OrderStatus === '等待體檢' || item.BC_OrderStatus === '等待核保' || item.BC_OrderStatus === '照會' || item.BC_OrderStatus === '冷靜期'" type="primary" size="mini" @click="contractPass(item.BC_OrderStatus, item.BC_ID)">{{returnPass(item.BC_OrderStatus)}}</el-button>
                                    <el-button v-if="item.BC_OrderStatus === '等待體檢'" type="warning" size="mini" @click="contractNote(item.BC_ID)">照會</el-button>
                                    <el-button v-if="item.BC_OrderStatus === '等待體檢' || item.BC_OrderStatus === '等待核保' || item.BC_OrderStatus === '照會'" type="danger" size="mini" @click="contractDeclinature(item.BC_ID)">拒保</el-button>
                                    <el-button v-if="item.BC_OrderStatus === '冷靜期'" type="danger" size="mini" @click="contractSurrender(item.BC_ID)">退保</el-button>
                                </div>
                                <i :class="{'unfold-icon': true, 'el-icon-arrow-up': index === 0, 'el-icon-arrow-down': index > 0}"></i>
                            </div>
                            <div v-show="index === 0 ? true : false" class="unfold-body">
                                <el-form label-width="90px">
                                    <el-form-item label="合同名稱：">{{item.BC_OrderName}}</el-form-item>
                                    <el-form-item label="產品名稱：">{{item.BC_OrderProductType}}</el-form-item>
                                    <el-form-item label="保單費用：">{{item.BC_OrderCurrency}} {{comm.formatMoney(item.BC_OrderMoney, 2)}}</el-form-item>
                                    <el-form-item v-if="item.BC_OrderStatus === '冷靜期' || item.BC_OrderStatus === '正式'" label="生效日期：">{{item.BC_OrderStartDate | hkDate('date')}}</el-form-item>
                                    <el-form-item label="簽發日期：">{{item.BC_OrderSignDate | hkDate('date')}}</el-form-item>
                                    <el-form-item v-if="item.BC_OrderStatus === '冷靜期' || item.BC_OrderStatus === '正式'" label="過期日期：">{{item.BC_OrderEndDate | hkDate('date')}}</el-form-item>
                                    <el-form-item label="產品描述：">{{item.BC_OrderDescription}}</el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="no-date">暫無數據</div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 写跟进弹框 -->
        <v-follow-dialog v-if="isFollowDialog" dialogFollowTitle="寫跟進" dialogFollowTarget="客戶" :dialogFollowStatus="customerData.Cst_Status" @hideFollowDialog="hideFollowDialog"></v-follow-dialog>
        <!-- 新增财务分析弹框 -->
        <v-accounts-dialog v-if="isAccountsDialog" :dialogAccountsTitle="dialogAccountsTitle" :dialogAccountsData="dialogAccountsData" @hideAccountsDialog="hideAccountsDialog"></v-accounts-dialog>
        <!-- 编辑客户弹框 -->
        <v-customer-dialog v-if="isCustomerDialog" dialogCustomerTitle="編輯客户" :customerData="customerData" @hideCustomerDialog="hideCustomerDialog"></v-customer-dialog>
        <!-- 新增机会弹框、编辑机会弹框 -->
        <v-chance-dialog v-if="isChanceDialog" :dialogChanceTitle="dialogChanceTitle" :dialogChanceData="dialogChanceData" @hideChanceDialog="hideChanceDialog"></v-chance-dialog>
        <!-- 转合同弹框 -->
        <v-subcontract-dialog v-if="isSubcontractDialog" dialogSubcontracTitle="轉合同" :dialogSubcontractData="dialogSubcontractData" @hideSubcontractDialog="hideSubcontractDialog"></v-subcontract-dialog>
        <!-- 补充保单资料弹框 -->
        <v-policy-info-dialog v-if="isPolicyInfoDialog" dialogPolicyInfoTitle="補充保單資料" :dialogPolicyInfoId="dialogPolicyInfoId" @hidePolicyInfoDialog="hidePolicyInfoDialog"></v-policy-info-dialog>
    </div>
</template>

<script>
    import VTop from '@/components/common/VTop.vue';
    import VModule from '@/components/common/VModule.vue';
    import VCustomerInfo from '@/components/common/customer/VCustomerInfo.vue';
    import VCustomerDetails from '@/components/common/customer/VCustomerDetails.vue';
    import VStep from '@/components/common/VStep.vue';
    import VFollowDialog from '@/components/common/clue/VFollowDialog.vue';
    import VAccountsDialog from '@/components/common/VAccountsDialog.vue';
    import VCustomerDialog from '@/components/common/customer/VCustomerDialog.vue';
    import VChanceDialog from '@/components/common/VChanceDialog.vue';
    import VSubcontractDialog from '@/components/common/VSubcontractDialog.vue';
    import VPolicyInfoDialog from '@/components/common/VPolicyInfoDialog.vue';
    export default {
        name: 'customerDetails',
        data() {
            return {
                customerData: {}, //客户信息
                activeName: 'salesData',
                isFollowDialog: false,  //写跟进弹框
                isAccountsDialog: false,  //新增财务分析弹框
                isCustomerDialog: false,    //编辑客户弹框
                isChanceDialog: false,  //新增机会弹框
                dialogChanceTitle: '',  //新增机会弹框标题
                dialogChanceData: {},   //编辑机会弹框数据
                isSubcontractDialog: false, //转合同弹框
                dialogSubcontractData: {},  //转合同弹框数据
                isPolicyInfoDialog: false,  //补充保单资料弹框
                dialogPolicyInfoId: '',
                isUpdateStep: 0,
                dialogAccountsTitle: '',    //财务分析弹框标题
                dialogAccountsData: {},  //编辑财务分析弹框数据
                analysisList: {},   //分析列表
                chanceList: [], //机会列表
                contractList: [],   //合同列表
                staffIdentity: sessionStorage.getItem('fc_staffIdentity')
            }
        },
        components: {
            VTop,
            VModule,
            VStep,
            VCustomerInfo,
            VCustomerDetails,
            VFollowDialog,
            VAccountsDialog,
            VCustomerDialog,
            VChanceDialog,
            VSubcontractDialog,
            VPolicyInfoDialog
        },
        mounted() {
            this.getCustomerInfo();
            this.toggleSlide();
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
            //获取客户信息
            getCustomerInfo() {
                this.$post('/api/CustomerApi/GetCustomerInfo', { Cst_Code: this.$route.query.Cst_Code })
                .then((res) => {
                    this.customerData = res.Info;
                });
            },
            //获取分析
            getAnalysis() {
                return new Promise((resolve, reject) => {
                    this.$post('/api/CustomerApi/GetLastFinAnalysis', { Cst_ID: this.$route.query.Cst_Code })
                    .then((res) => {
                        this.analysisList = res.Info;
                        resolve(res.Info);
                    });
                });
            },
            //获取机会
            getChance() {
                this.$post('/api/ChanceApi/GetChanceList', { Cst_Code: this.$route.query.Cst_Code })
                .then((res) => {
                    this.chanceList = res.Info;
                });
            },
            //获取合同
            getContract() {
                this.$post('/api/ChanceApi/GetContractList', { Cst_Code: this.$route.query.Cst_Code })
                .then((res) => {
                    this.contractList = res.Info;
                });
            },
            //tabs切换
            tabSwitch(tab, event) {
                switch(tab.label) {
                    case '銷售動態':
                        this.isUpdateStep++;
                    break;
                    case '詳細信息':
                        this.getCustomerInfo();
                        this.getAnalysis();
                    break;
                    case '機會':
                        this.getChance();
                    break;
                    case '合同':
                        this.getContract();
                    break;
                }
            },
            //写跟进-显示
            showFollowDialog() {
                this.isFollowDialog = true;
            },
            //写跟进-隐藏
            hideFollowDialog(v) {
                if(v) {
                    this.isUpdateStep++;
                    this.getCustomerInfo();
                }
                this.isFollowDialog = false;
            },
            //新增财务分析弹框、修改财务分析弹框-显示
            showAccountsDialog(str, obj = {}) {
                this.dialogAccountsTitle = str;
                this.dialogAccountsData = obj;
                if(str === '更新財務分析') {
                    this.$confirm('更新提交后將替換當前財務分析，確定嗎?', '提示', {
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                        closeOnClickModal: false,
                        type: 'warning'
                    }).then(() => {
                        this.isAccountsDialog = true;
                    }).catch(() => {

                    });
                } else {
                    this.isAccountsDialog = true;
                }
            },
            //新增财务分析弹框、修改财务分析弹框-隐藏
            hideAccountsDialog(v) {
                if(v) {
                    this.getAnalysis();
                }
                this.isAccountsDialog = false;
            },
            //编辑客户弹框-显示
            showCustomerDialog() {
                this.isCustomerDialog = true;
            },
            //编辑客户弹框-隐藏
            hideCustomerDialog(v) {
                if(v) {
                    this.getCustomerInfo();
                }
                this.isCustomerDialog = false;
            },
            //新增機會弹框、编辑機會弹框-显示
            showChanceDialog(str, obj = {}) {
                this.getAnalysis().then((res) => {
                    if((str === '新增機會' || str === '編輯機會') && this.analysisList && this.analysisList.IsValidity) {
                        this.dialogChanceTitle = str;
                        this.dialogChanceData = obj;
                        this.isChanceDialog = true;
                    } else {
                        this.$confirm('客戶未進行財務分析，請先添加後再創建機會', '提示', {
                            confirmButtonText: '新增賬務分析',
                            cancelButtonText: '暫不創建',
                            closeOnClickModal: false,
                            type: 'warning'
                        }).then(() => {
                            this.showAccountsDialog('新增財務分析');
                        }).catch(() => {

                        });
                    }
                });
            },
            //新增機會弹框、编辑機會弹框-隐藏
            hideChanceDialog(v) {
                if(v) {
                    this.getChance();
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
                    this.getChance();
                }
                this.isSubcontractDialog = false;
            },
            //补充保单资料弹框-显示
            showPolicyInfoDialog(id) {
                this.dialogPolicyInfoId = id;
                this.isPolicyInfoDialog = true;
            },
            //补充保单资料弹框-隐藏
            hidePolicyInfoDialog(v) {
                if(v) {
                    this.getContract();
                }
                this.isPolicyInfoDialog = false;
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
                        this.getChance();
                    });
                }).catch(() => {
                        
                });
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
                            this.getContract();
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
                        this.getContract();
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
                        this.getContract();
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
                        this.getContract();
                    });
                }).catch(() => {
                       
                });
            },
            //展开收缩
            toggleSlide() {
                $('.toggle-slide').on('click', '.unfold-icon', function() {
                    if(!$(this).closest('.unfold-head').next('.unfold-body').is(":animated")){
                        if($(this).hasClass('el-icon-arrow-down')) {
                            $(this).removeClass('el-icon-arrow-down').addClass('el-icon-arrow-up').closest('.unfold-head').next('.unfold-body').slideDown();
                        } else {
                            $(this).removeClass('el-icon-arrow-up').addClass('el-icon-arrow-down').closest('.unfold-head').next('.unfold-body').slideUp();
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .correlation-box {
        position: absolute;
        top: 5px;
        right: 0;
        z-index: 2;
    }
    .unfold-box {
        margin-bottom: 10px;
        background-color: #ffffff;
    }
    .unfold-box .unfold-head {
        position: relative;
        padding: 15px 60px 15px 20px;
        border-bottom: 1px solid #dddddd;
    }
    .unfold-box .unfold-head .title {
        line-height: 28px;
    }
    .unfold-box .unfold-head .date {
        margin-left: 30px;
        line-height: 28px;
        font-size: 12px;
        color: #949494;
    }
    .unfold-box .unfold-head .stage {
        margin-left: 30px;
        line-height: 28px;
        font-size: 12px;
        color: #949494;
    }
    .unfold-box .unfold-head .stage .icon {
        margin-left: 8px;
        font-size: 14px;
        font-weight: bold;
        color: #0099ff;
    }
    .unfold-box .unfold-head .unfold-icon {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 22px;
        font-weight: bold;
        text-align: center;
    }
    .unfold-box .unfold-body {
        padding: 15px 20px;
    }
    .no-date {
        padding: 100px 0;
        color: #666666;
        text-align: center;
        background-color: #ffffff;
    }
</style>