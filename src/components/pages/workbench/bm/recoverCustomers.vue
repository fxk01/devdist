<template>
  <div class="recoverCustomers">
    <div class="container">
      <v-top>
        <div class="v-top-left-title" slot="leftTitle" style="width: 100%;">
          <img class="icon" src="@/assets/images/assignUser.png" style="margin-top: 6px;"/>
          收回客戶
          <router-link to="/" class="fr ax-u1825-font">返回首页></router-link>
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
            <th>收回狀態</th>
            <td>
              <el-checkbox class="fl m5 checkbox-condition" v-model="customerStatusAll" size="mini" border :indeterminate="customerStatusIndeter" @change="checkCustomerStatusAll">全部</el-checkbox>
              <el-checkbox-group v-model="customerStatus" size="mini" class="v-checkbox-group checkbox-group-condition" @change="checkCustomerStatus">
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
          <el-button type="info" size="mini" @click="resetForm">重置</el-button>
        </div>
      </div>

      <div class="content">
        <el-table :data="tableData" empty-text="暫無數據" @selection-change="tableSelectionChange">
          <!--        <el-table-column v-if="processState === 0" type="selection" width="50" align="center"></el-table-column>-->
          <el-table-column label="客戶姓名" prop="Cst_Name" align="center"></el-table-column>
          <el-table-column label="客戶狀態" prop="Cst_Status" align="center"></el-table-column>
          <el-table-column label="所在地區" prop="Cst_Location" align="center"></el-table-column>
          <el-table-column label="原代理人" prop="PreStf_Name" align="center"></el-table-column>
          <el-table-column label="現代理人" prop="Stf_Name" align="center"></el-table-column>
          <el-table-column label="狀態" prop="BCCL_Status" align="center"></el-table-column>
          <el-table-column label="最新變更時間" align="center">
            <template slot-scope="scope">{{scope.row['BCCL_UpdateTime'] | hkDate('dateHM')}}</template>
          </el-table-column>
          <el-table-column label="操作" width="320" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain @click="lookDetails(scope.row)">查看詳情</el-button>
              <el-button v-if="scope['row']['BCCL_Status'] === '待指派'" type="primary" size="mini" @click="dialogAllocationVisibleFuc(scope['row'])">指派客户</el-button>
              <el-button v-else-if="scope['row']['BCCL_Status'] === '已接受'" type="primary" size="mini" @click="distributionName = scope['row']['Stf_Name'], distributionBCCLID = scope['row']['BCCL_ID'], diaLogAssignCustomers = true">分配客戶</el-button>
              <el-button v-else-if="scope['row']['BCCL_Status'] === '已拒絕'" type="primary" size="mini" @click="diaLogSubAgentFinalFuc(scope['row'], '重新指派')">重新指派</el-button>
              <el-button v-else type="primary" size="mini" @click="diaLogSubAgentFinalFuc(scope['row'], '更改指派')">更改指派</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="total > 0">
          <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
          </el-pagination>
        </div>
      </div>

      <el-dialog :visible.sync="diaLogAssignCustomers" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialog-dlr">
        <div class="subFinalClass">
          <img src="@/assets/images/gth.png" class="va-middle" style="margin-top: 30px;">
          <span class="va-middle sub-ok-text" style="margin: 50px 0 20px 0;">确定要分配客户给【{{distributionName}}】嗎？</span>
          <p class="va-middle tip-ok-text">客户分配后将无法撤回，请谨慎操作！</p>

          <ul class="subFinalUl">
            <li class="but1" @click="distribCustChargeFuc">确定</li>
            <li class="but2" @click="diaLogAssignCustomers = false">取消</li>
          </ul>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="diaLogSubAgentFinal" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialog-dlr">
        <div class="subFinalClass">
          <span class="va-middle sub-ok-text" style="margin: 50px 0 20px 0;">当前指派代理人暂未返回确认信息</span>
          <p class="va-middle sub-ok-text">确定更换其他代理人吗？</p>

          <ul class="subFinalUl">
            <li class="but1" @click="dialogChangeAssignment = true, diaLogSubAgentFinal = false">确定</li>
            <li class="but2" @click="diaLogSubAgentFinal = false">取消</li>
          </ul>
        </div>
      </el-dialog>

      <el-dialog class="dialog-component" title="更改指派" :visible.sync="dialogChangeAssignment" :close-on-click-modal="false" :close-on-press-escape="false" @close="dialogAllocationVisible = false">
        <el-form :model="dialogAssignForm" :rules="dialogAssignFormRules" ref="dialogAssignForm" label-width="150px">
          <el-form-item label="客戶姓名：">{{changeAssign.cstName}}</el-form-item>
          <el-form-item label="上一個跟進人：">{{changeAssign.stfName}}</el-form-item>

          <el-form-item label="更改跟進人：" prop="allocationToUser">
            <el-select v-model="dialogAssignForm['allocationToUser']" placeholder="請選擇代理人" no-data-text="暫無數據" @change="changeAgentFuc">
              <el-option v-for="(item, index) in memberListByManArr" :key="index" :value="item.Stf_ID" :label="item.Stf_Name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" align="center">
          <el-button @click="dialogChangeAssignment = false">取消</el-button>
          <el-button type="primary" @click="determineAssignFuc('dialogAssignForm')">確定</el-button>
        </div>
      </el-dialog>

      <el-dialog class="dialog-component" title="指派客戶" :visible.sync="dialogAllocationVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="dialogAllocationVisible = false">
        <el-form :model="dialogAssignForm" :rules="dialogAssignFormRules" ref="dialogAssignForm" label-width="120px">
          <el-form-item label="客戶姓名：">{{dialogAssignForm.name}}</el-form-item>
          <el-form-item label="跟進人：" prop="allocationToUser">
            <el-select v-model="dialogAssignForm['allocationToUser']" placeholder="請選擇代理人" no-data-text="暫無數據" @change="changeAgentFuc">
              <el-option v-for="(item, index) in memberListByManArr" :key="index" :value="item.Stf_ID" :label="item.Stf_Name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" align="center">
          <el-button @click="dialogAllocationVisible = false">取消</el-button>
          <el-button type="primary" @click="determineAssignFuc('dialogAssignForm')">確定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  /**
   * @Description:
   * @author 李凯明
   * @date 2019/12/11
  */

  import VTop from '@/components/common/VTop.vue';
  import VAllocationDialog from '@/components/common/clue/VAllocationDialog.vue';

  export default {
    name: 'recoverCustomers',
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
        staffIdentity: sessionStorage.getItem('fc_staffIdentity'),
        dialogAllocationVisible: false,
        dialogAssignForm: {
          allocationToUser: '',
        },
        dialogAssignFormRules: {
          allocationToUser: {
            required: true, message: '請選擇代理人', trigger: 'change'
          }
        },
        assignCustCharge: {
          BCCL_ID: '',
          Stf_ID: '',
        },
        diaLogSubAgentFinal: false,
        dialogChangeAssignment: false,
        changeAssign: {
          cstName: '',
          stfName: '',
        },
        diaLogAssignCustomers: false,
        distributionName: '',
        distributionBCCLID: '',
        memberListByManArr: [],
        processState: 0,
        placeIndeter: false,
        placeAll: true,
        place: [], //渠道来源
        statusIndeter: false,
        statusAll: true,
        statusList: [],
        status: [], //状态
        tableChecked: [],   //表格多选框
        isAllocationDialog: false,  //批量分配弹框、分配客户弹框是否显示
        dialogAllocationData: [],   //批量分配弹框、分配客户弹框传入的数据
      }
    },
    components: {
      VTop,
      VAllocationDialog
    },
    mounted() {
      let arr = [
        this.$store.dispatch('getTypeData', '收回狀態'),
        this.$store.dispatch('getRegionData', '中國香港'),
      ];
      if(this.staffIdentity === '銷售主管') {
        arr.push(this.$store.dispatch('getTeamMembers'));
      }
      Promise.all(arr).then(() => {
        this.regionList = this.$store.state.regionList;
        this.customerStatusList = this.$store.state.customerStatusList;
        this.statusList = this.$store.state.recoveryStatusList;
        if(this.staffIdentity === '銷售主管') {
          this.memberListByManArr = this.$store.state.teamMembersList;
          this.theirSalesList = this.$store.state.teamMembersList;
        }
        if(this.$route.query.text === sessionStorage.getItem('fc_userid')) {
          const week = this.comm.commDateModified("week", 1, new Date(), '-');
          const weekDay = this.comm.formatDate(week, 'yyyy-MM-dd');
          this.customerStatusAll = false;
          this.customerStatus = this.customerStatusList.filter(item => item.BO_Value === '初步接觸' || item.BO_Value === '意向客戶' || item.BO_Value === '成交客戶');
          this.dateRadio = '';
          this.datePicker = ['1990-01-01', weekDay];
        }
        this.getData();
      });
      this.changeDateRadio(this.dateRadio);
      // this.getFollowersFuc();
    },
    watch: {
      dialogAllocationVisible(val) {
        if(!val) {
          this.$refs['dialogAssignForm'].resetFields();
        }
      },
      dialogChangeAssignment(val) {
        if(!val) {
          this.$refs['dialogAssignForm'].resetFields();
        }
      }
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
        });
        this.customerStatus.map(item => {
          LstStatus.push(item.BO_Value);
        });
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
        };
        this.$post('/api/CustomerApi/GetPageCustChargeByDir', params).then((res) => {
          this.total = res.TotalCount;
          this.tableData = res.Datas;
        }).catch(error => {

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
      },
      dialogAllocationVisibleFuc(row) {
        this.assignCustCharge['BCCL_ID'] = row['BCCL_ID'];
        this.dialogAssignForm['name'] = row.Cst_Name;
        this.dialogAllocationVisible = true
      },
      getFollowersFuc() {
        this.$post(`/api/BasicsApi/GetMemberListByManID`, {}).then(res => {
          if(res['IsSuccess']) {
            this.memberListByManArr = res['Info']
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      changeAgentFuc(val) {
        this.assignCustCharge['Stf_ID'] = val;
      },
      determineAssignFuc(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post(`/api/CustomerApi/AssignCustCharge`, this.assignCustCharge).then(res => {
              if(res['IsSuccess']) {
                this.dialogAllocationVisible = false;
                this.dialogChangeAssignment = false;
                this.getData()
              } else {
                this.$message(res.Message);
              }
            }).catch(error => {

            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      diaLogSubAgentFinalFuc(row, str) {
        this.assignCustCharge['BCCL_ID'] = row['BCCL_ID'];
        this.changeAssign['cstName'] = row['Cst_Name'];
        this.changeAssign['stfName'] = row['Stf_Name'];
        if(str === '重新指派') {
          this.dialogChangeAssignment = true;
        } else {
          this.diaLogSubAgentFinal = true
        }
      },
      distribCustChargeFuc() {
        this.$post(`/api/CustomerApi/DistribCustCharge`, {BCCL_ID: this.distributionBCCLID}).then(res => {
          if(res['IsSuccess']) {
            this.diaLogAssignCustomers = false;
            this.getData()
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      //状态-全部
      checkstatusAll(v) {
        this.status = v ? this.statusList : [];
        this.statusIndeter = false;
      },
      //状态-单选
      checkstatus(v) {
        let checkedCount = v.length;
        this.statusAll = checkedCount === this.statusList.length;
        this.statusIndeter = checkedCount > 0 && checkedCount < this.statusList.length;
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
    },
    activated() {
      this.queryData();
    }
  }
</script>

<style lang="less">
  .recoverCustomers {
    .v-top-left-title .ax-u1825-font {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      line-height: 32px;
      color: #3399FF;
      font-size: 14px;
      text-decoration: underline;
    }
    .subFinalClass {
      width: 460px;
      height: 265px;
      text-align: center;
    }
    .sub-ok-text {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      color: #333333;
      line-height: normal;
      padding-left: 20px;
      display: inline-block;
    }
    .tip-ok-text {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #333333;
      line-height: normal;
      /*padding: 8px 0 0 55px;*/
    }
    .subFinalUl {
      float: left;
      position: absolute;
      bottom: 0;
    }
    .subFinalUl li {
      width: 230px;
      height: 50px;
      background: inherit;
      border: none;
      background-color: rgba(238, 58, 67, 1);
      border-radius: 0;
      -moz-box-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 50px;
      cursor: pointer;
      float: left;
    }
    .subFinalUl li.but2 {
      background-color: rgba(242, 242, 242, 1);
      color: #333333;
    }
    .el-dialog__body {
      padding: 0;
    }
    .dialog-dlr .el-dialog {
      width: 460px;
    }
  }
</style>