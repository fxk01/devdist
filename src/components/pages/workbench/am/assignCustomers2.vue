<template>
  <div class="assignCustomers">
    <div class="container">
      <v-top>
        <div class="v-top-left-title" slot="leftTitle" style="width: 100%;">
          <img class="icon" src="@/assets/images/assignUser.png" style="margin-top: 6px;"/>
          指派客戶
          <router-link to="/" class="fr ax-u1825-font">返回首页></router-link>
        </div>
      </v-top>

      <div class="condition">
        <table class="condition-table">
          <tr>
            <th>所在地區</th>
            <td>
              <el-checkbox class="fl m5" v-model="regionAll" size="mini" border :indeterminate="regionIndeter" @change="checkRegionAll">全部</el-checkbox>
              <el-checkbox-group v-model="region" size="mini" class="v-checkbox-group" @change="checkRegion">
                <el-checkbox v-for="(item, index) in regionList" :key="index" :label="item" border>{{item.BC_Name}}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <th>客戶狀態</th>
            <td>
              <el-checkbox class="fl m5" v-model="customerStatusAll" size="mini" border :indeterminate="customerStatusIndeter" @change="checkCustomerStatusAll">全部</el-checkbox>
              <el-checkbox-group v-model="customerStatus" size="mini" class="v-checkbox-group" @change="checkCustomerStatus">
                <el-checkbox v-for="(item, index) in customerStatusList" :key="index" :label="item" border>{{item.BO_Value}}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr v-if="staffIdentity === '銷售主管'">
            <th>所屬銷售</th>
            <td>
              <el-checkbox class="fl m5" v-model="theirSalesAll" size="mini" border :indeterminate="theirSalesIndeter" @change="checkTheirSalesAll">全部</el-checkbox>
              <el-checkbox-group v-model="theirSales" size="mini" class="v-checkbox-group" @change="checkTheirSales">
                <el-checkbox v-for="(item, index) in theirSalesList" :key="index" :label="item" border>{{item.Stf_Name}}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <th>時　間</th>
            <td>
              <el-radio-group size="mini" class="v-radio-group" v-model="dateRadio" @change="changeDateRadio">
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
          <el-button type="primary" size="mini" class="btn-ec0928" @click="queryData">查詢</el-button>
          <el-button type="info" size="mini" @click="resetForm">重置</el-button>
        </div>
      </div>

      <div class="content">
        <el-table :data="tableData" empty-text="暫無數據">
          <el-table-column label="客戶姓名" prop="Cst_Name" align="center"></el-table-column>
          <el-table-column label="客戶狀態" prop="Cst_Status" align="center"></el-table-column>
          <el-table-column label="所在地區" prop="Cst_Location" align="center"></el-table-column>
          <el-table-column label="原代理人" prop="PreStf_Name" align="center"></el-table-column>
          <el-table-column label="聯繫電話" align="center">
            <template slot-scope="scope">
              {{scope.row['Cst_Mobile']}}
              <img v-if="scope['row']['Cst_Mobile'].indexOf('*') > 0" src="@/assets/images/icon-off.png" style="cursor: pointer;" @click="changeMobileFuc(scope.row)">
              <img v-else src="@/assets/images/icon-on.png" style="cursor: pointer;" @click="changeMobileFuc(scope.row)">
            </template>
          </el-table-column>
          <el-table-column label="指派時間" align="center">
            <template slot-scope="scope">{{scope.row.BCCL_UpdateTime | hkDate('dateHM')}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain @click="lookDetailsAssignFuc(scope.row)">詳情</el-button>

              <el-button type="primary" size="mini" @click="diaLogOpenFuc('已接受', scope.row)">接受</el-button>

              <el-button type="info" size="mini" @click="diaLogOpenFuc('已拒絕', scope.row)">拒絕</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination" v-if="total > 0">
          <el-pagination layout="total, sizes, prev, pager, next" :current-page="PageIndex" :page-size="PageSize" :total="total" @current-change="handleCurrentChange" @size-change="changeSize">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="diaLogAcceptDetail" :close-on-click-modal="false" :close-on-press-escape="false" class="dialog-dlr acceptDetailDlr">
      <div class="acceptDetail">
        <div>
          <span class="ax-u1900-text">{{assignCustInfoData['Cst_Name']}}</span>

          <img src="@/assets/images/icon-man.png">

          <div class="details-bg">{{assignCustInfoData['Cst_Status']}}</div>
        </div>

        <p>{{assignCustInfoData['Cst_NickyName']}}</p>

        <div style="margin: 15px 0 30px 0;">
          <img src="@/assets/images/icon-phone.png">

          <span class="ax-u1900-text">&nbsp;&nbsp;{{assignCustInfoData['Cst_Mobile']}}</span>
        </div>

        <ul class="wrap-love">
          <li v-for="(item, index) in assignCustInfoData['LstTag']" :key="index">
            {{item}}
          </li>

          <li class="love-lase-li" v-if="assignCustInfoData['LstTag'].length >= 5">
            ...
          </li>
        </ul>

        <ul class="wrap-log">
          <li class="wrap-log-li">
            <div class="log-bg">
              <img src="@/assets/images/icon-ws.png">
            </div>
            <ul class="log-person">
              <li class="ax-u1906-text">
                <span v-if="assignCustInfoData['AllChanCount'] === 0">当前客户暂无机会</span>
                <span v-else>共产生{{assignCustInfoData['AllChanCount']}}次机会</span>
              </li>

              <li v-if="assignCustInfoData['AllChanCount'] !== 0" class="ax-u1906-text" style="color: #0099FF;">
                成功转为保单{{assignCustInfoData['ConvertOrderCount']}}次,正在跟进{{assignCustInfoData['FollowChanCount']}}次,关闭机会{{assignCustInfoData['CloseChanCount']}}次
              </li>
            </ul>
          </li>

          <li class="wrap-log-li">
            <div class="log-bg">
              <img src="@/assets/images/icon-bd.png">
            </div>
            <ul class="log-person">
              <li class="ax-u1906-text">
                <span v-if="assignCustInfoData['SumOrderCount'] === 0">当前客户暂无保单</span>
                <span v-else>共签约{{assignCustInfoData['SumOrderCount']}}份保单</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="diaLogAcceptRejection" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="dialog-dlr">
      <div class="subFinalClass">
        <img src="@/assets/images/gth.png" class="va-middle" style="margin-top: 30px;">
        <span class="va-middle sub-ok-text" style="margin: 50px 0 20px 0;">客戶【{{cstNameAccept}}】{{diaLogAcceptText}}？</span>
        <p class="va-middle tip-ok-text" style="padding-left: 45px;">確定後将无法恢复，请谨慎操作！</p>

        <ul class="subFinalUl">
          <li class="but1" @click="diaLogAcceptRejectionFuc">确定</li>
          <li class="but2" @click="diaLogAcceptRejection = false">取消</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * @Description:
   * @author 李凯明
   * @date 2019/11/8
  */

  import VTop from '@/components/common/VTop.vue';
  import { mixin } from '@/utils/common';

  export default {
    mixins: [mixin],
    name: 'AssignCustomers',
    data() {
      return {
        diaLogAcceptDetail: false,
        diaLogAcceptRejection: false,
        diaLogAcceptText: '',
        cstNameAcceptId: '',
        cstNameAccept: '',
        assignCustInfoData: {
          LstTag: []
        },
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
        tableDataChange: [],
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
        this.region = this.$store.state.regionList;
        this.customerStatusList = this.$store.state.customerStatusList;
        this.customerStatus = this.$store.state.customerStatusList;
        if(this.staffIdentity === '銷售主管') {
          this.theirSalesList = this.$store.state.teamMembersList;
          this.theirSales = this.$store.state.teamMembersList;
        }
        this.getData();
      });
      this.changeDateRadio(this.dateRadio);
    },
    methods: {
      diaLogOpenFuc(str, item) {
        this.diaLogAcceptRejection = true;
        this.diaLogAcceptText = str;
        this.cstNameAccept = item['Cst_Name'];
        this.cstNameAcceptId = item['BCCL_ID'];
      },
      diaLogAcceptRejectionFuc() {
        let _api = this.diaLogAcceptText === '已接受' ? 'AcceptCustCharge' : 'RefuseCustCharge';
        this.$post(`/api/CustomerApi/${_api}`, {
          BCCL_ID: this.cstNameAcceptId
        }).then(res => {
          if(res['IsSuccess']) {
            this.diaLogAcceptRejection = false;
            this.getData();
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      lookDetailsAssignFuc(item) {
        this.diaLogAcceptDetail = true;

        this.$post(`/api/CustomerApi/GetAssignCustInfo`, {
          BCCL_ID: item['BCCL_ID']
        }).then(res => {
          if(res['IsSuccess']) {
            this.assignCustInfoData = res['Info']
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      changeMobileFuc(item) {
        this.tableDataChange.forEach((obj) => {
          if(obj['BCCL_ID'] === item['BCCL_ID']) {
            if(item['Cst_Mobile'].indexOf('*') > 0) {
              item['Cst_Mobile'] = obj['Cst_Mobile'];
            } else {
              item['Cst_Mobile'] = obj['Cst_Mobile'].substring(-1, 8) + '****' + item['Cst_Mobile'].substring(item['Cst_Mobile'].length - 4, item['Cst_Mobile'].length);
            }
          }
        });
      },
      //所在地区-全部
      checkRegionAll(v) {
        this.region = v ? this.regionList : [];
        this.regionIndeter = false;
      },
      //所在地区-单选
      checkRegion(v) {
        let checkedCount = v.length;
        this.regionAll = checkedCount === this.regionList.length;
        this.regionIndeter = checkedCount > 0 && checkedCount < this.regionList.length;
      },
      //客户状态-全部
      checkCustomerStatusAll(v) {
        this.customerStatus = v ? this.customerStatusList : [];
        this.customerStatusIndeter = false;
      },
      //客户状态-单选
      checkCustomerStatus(v) {
        let checkedCount = v.length;
        this.customerStatusAll = checkedCount === this.customerStatusList.length;
        this.customerStatusIndeter = checkedCount > 0 && checkedCount < this.customerStatusList.length;
      },
      //所属销售-全部
      checkTheirSalesAll(v) {
        this.theirSales = v ? this.theirSalesList : [];
        this.theirSalesIndeter = false;
      },
      //所属销售-单选
      checkTheirSales(v) {
        let checkedCount = v.length;
        this.theirSalesAll = checkedCount === this.theirSalesList.length;
        this.theirSalesIndeter = checkedCount > 0 && checkedCount < this.theirSalesList.length;
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
        this.$post('/api/CustomerApi/GetPageCustChargeByAgent', params).then((res) => {
          this.total = res['TotalCount'];
          this.tableDataChange = this.copyArr(res['Datas']);
          this.tableData = res['Datas'];
          this.tableData.forEach((item) => {
            item['Cst_Mobile'] = item['Cst_Mobile'].substring(-1, 8) + '****' + item['Cst_Mobile'].substring(item['Cst_Mobile'].length - 4, item['Cst_Mobile'].length)
          });
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
    }
  }
</script>

<style lang="less">
  .assignCustomers {
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
    .acceptDetailDlr .el-dialog__body {
      padding: 0 0 60px 0;
    }
    .acceptDetail {
      padding: 0 25px;
      .ax-u1900-text {
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        line-height: normal;
      }
      .ax-u1906-text {
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 12px;
        line-height: normal;
      }
      .details-bg {
        background: url(../../../../assets/images/details-bg.png) no-repeat;
        width: 115px;
        height: 49px;
        display: inline-block;
        vertical-align: middle;
        line-height: 39px;
        padding-left: 25px;
        margin-left: 25px;
      }
      .wrap-love {
        padding-bottom: 33px;
      }
      .wrap-love li {
        display: inline-block;
        width: 120px;
        height: 28px;
        background: inherit;
        background-color: #ff9900;
        border: none;
        border-radius: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
        color: #FFFFFF;
        text-align: center;
        line-height: 28px;
        margin-left: 10px;
      }
      .wrap-love li:first-child, .wrap-love li:nth-child(4) {
        margin-left: 0;
      }
      .wrap-love li:nth-child(4) {
        margin-top: 13px;
      }
      .love-lase-li {
        background-color: inherit;
        width: inherit;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 18px;
        color: #333333;
        line-height: normal;
      }
      .log-bg {
        background: url(../../../../assets/images/icon-notes.png) no-repeat;
        width: 85px;
        height: 80px;
        display: inline-block;
        line-height: 90px;
        text-align: center;
        vertical-align: middle;
      }
      .log-person {
        display: inline-block;
        padding-left: 10px;
      }
      .wrap-log .wrap-log-li {
        margin-bottom: 20px;
        border: none;
        border-radius: 5px;
        -moz-box-shadow: 5px 5px 5px rgba(204, 204, 204, 0.349019607843137);
        -webkit-box-shadow: 5px 5px 5px rgba(204, 204, 204, 0.349019607843137);
        box-shadow: 5px 5px 5px rgba(204, 204, 204, 0.349019607843137);
      }
    }
  }
</style>