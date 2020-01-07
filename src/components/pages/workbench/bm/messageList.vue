<template>
  <div class="messageList">
    <p class="msg-title">消息通知</p>

    <ul class="box-list-ul">
      <li v-for="(item, index) in this.getPageTipData" :key="index">
        <span class="new-son-span">{{item['BT_Status'] === '未讀' ? 'new' : ''}}</span>
        <div class="new-son-msg">
          <p>{{item['BT_Content']}}</p>
          <p class="mt-12">{{item['BT_CreateTime'] | hkDate('dateHM')}}</p>
        </div>
        <span class="new-son-detail fr" @click="lookDetailFuc(item)">查看詳情</span>
      </li>
    </ul>

    <el-pagination
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="changeSizeCur"
        :page-size="curPageSize"
        :current-page="PageIndex"
        :total="totalCount"
    >
    </el-pagination>

    <dialogVisibleContract
        :dialogContract.sync="dialogContractFather"
        :dialogVisibleSign.sync="dialogVisibleSignTag"
        :getTipInfoData="getTipInfoData"
        :getTipContractData="getTipContractData"
    />
  </div>
</template>

<script>
  /**
   * @Description:
   * @author 李凯明
   * @date 2019/11/15
  */

  import dialogVisibleContract from '@/components/common/DialogVisibleContract.vue';

  export default {
    name: 'messageList',
    data() {
      return {
        dialogContractFather: false,
        dialogVisibleSignTag: false,
        getPageTipData: [],
        totalCount: 0,
        PageIndex: 1,
        curPageSize: 10,
        getTipInfoData: {
          MdrtInfo: {
            SumOrderMoney: 0,
            CompleteDate: '',
            MdrtType: ''
          }
        },
        getTipContractData: {
          Order_Info: {
            BC_EffectDate: '',
            BC_ID: '',
            BC_OrderCreateTime: '',
            BC_OrderCurrency: '',
            BC_OrderEndDate: '',
            BC_OrderMoney: 0,
            BC_OrderName: '',
            BC_OrderNo: '',
            BC_OrderProductType: '',
            BC_OrderSignDate: '',
            BC_OrderStartDate: '',
            BC_OrderStatus: '',
            BC_OrderUpdateTime: '',
            Cst_Code: '',
            Cst_Name: '',
            Stf_ID: '',
            Stf_Name: '',
          },
          Tip_Title: '',
        },
        num: 1,
      }
    },
    components: {
      [dialogVisibleContract.name]: dialogVisibleContract,
    },
    mounted() {
      this.getPageTipFuc()
    },
    methods: {
      getPageTipFuc(p = 1, page = 10) {
        this.$post('/api/BasicsApi/GetPageTip', {
          PageIndex: p,
          PageSize: page,
        }).then(res => {
          if(res['IsSuccess']) {
            this.getPageTipData = res['Datas'];
            this.totalCount = res['TotalCount']
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      handleCurrentChange(val) {
        this.PageIndex = val;
        this.getPageTipFuc(val, this.curPageSize)
      },
      lookDetailFuc(item) {
        this.$post('/api/BasicsApi/GetTipInfo', {
          BT_ID: item['BT_ID'],
        }).then(res => {
          if(res['IsSuccess']) {
            let type;
            type = res['Info']['BT_Type'].split('-')[1];
            if(type === 'TOT' || type === 'COT' || type === 'MDRT') {
              this.dialogContractFather = false;
              this.getTipInfoData = res['Info'];
              this.dialogVisibleSignTag = true;
            } else {
              this.dialogVisibleSignTag = false;
              this.getTipContractData = res['Info'];
              this.dialogContractFather = true
            }
            if(item['BT_Status'] !== '已讀') {
              this.getPageTipFuc(this.PageIndex, this.curPageSize);
            }
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      changeSizeCur(v) {
        this.PageIndex = 1;
        this.curPageSize = v;
        this.getPageTipFuc(1, v)
      }
    },
  }
</script>

<style lang="less">
  .messageList {
    width: 80%;
    margin: 0 auto;
    .ax-u5718-text {
      font-family: '微软雅黑';
      font-weight: 400;
      font-style: normal;
      font-size: 28px;
      color: #FF0000;
      line-height: normal;
    }
    .ax-u5719-text {
      font-family: '微软雅黑';
      font-weight: 400;
      font-style: normal;
      color: #333333;
      line-height: normal;
      font-size: 14px;
      margin-top: 42px;
    }
    .ax-u5846-text {
      font-family: '微软雅黑';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      color: #666666;
      line-height: normal;
    }
    .el-step__head.is-finish {
      color: #409EFF;
      border-color: #949494;
    }
    .mt-12 {
      margin-top: 12px;
    }
    .mt55 {
      margin-top: 55px;
    }
    .msg-title {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      color: #333333;
      line-height: normal;
      text-align: left;
      margin: 32px 0;
    }
    .new-son-span {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      color: #FF0000;
      text-align: left;
      line-height: normal;
      vertical-align: top;
      width: 16px;
      display: inline-block;
    }
    .new-son-msg {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      color: #333333;
      text-align: left;
      line-height: normal;
      display: inline-block;
      vertical-align: top;
      margin-left: 15px;
    }
    .new-son-detail {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      color: #0099FF;
      text-align: left;
      line-height: normal;
      vertical-align: top;
      cursor: pointer;
    }
    .box-list-ul {
      background-color: #ffffff;
      min-height: 980px;
      width: 100%;
      padding: 0 28px 35px 28px;
      li {
        border-bottom: 1px solid rgb(171, 165, 165);
        padding: 35px 0 30px 0;
      }
      li:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
    }
    .el-pager li {
      background: inherit;
    }
    .el-pagination .btn-next, .el-pagination .btn-prev {
      background: center center no-repeat #F5F6F9;
    }
    .el-pagination {
      padding: 20px 0 20px 0;
      float: right;
    }
    .ax-u5724-text {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: #0099FF;
      text-align: left;
      line-height: normal;
      padding-left: 5px;
    }
    .diaLogSign {
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog {
        width: 460px;
        min-height: 590px;
        border-radius: 10px;
      }
      .bg-complete {
        background: url(../../../../assets/images/icon-tot.jpg) no-repeat;
        background-size: contain;
        width: 140px;
        height: 110px;
        margin: 85px auto auto auto;
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 16px;
        text-align: center;
        color: #333333;
        line-height: 100px;
      }
      .info-stf-name {
        font-family: '微软雅黑';
        font-weight: 400;
        font-style: normal;
        font-size: 20px;
        text-align: center;
        color: #333333;
        line-height: normal;
        margin: 38px 0;
      }
      .info-text-hkd {
        font-size: 14px;
        color: #949494;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        line-height: normal;
        display: inline-block;
        width: 95px;
      }
      .info-text-wrap {
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
      }
      .contract-steps {
        margin-top: 60px;
        padding-bottom: 70px;
        border-bottom: 1px dashed #d2cbcb;
      }
    }
    .diaLogContract {
      .ax-u5735-text {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 12px;
        color: #0099FF;
        line-height: normal;
      }
      .el-dialog__body {
        padding: 0 30px;
      }
      .contract-establish {
        padding-left: 25px;
        li {
          padding-bottom: 40px;
        }
        li:first-child {
          padding-top: 30px;
        }
      }
      .contract-cooling {
        padding-left: 25px;
        li {
          padding-bottom: 40px;
        }
        li:first-child {
          padding-top: 30px;
        }
      }
      .contract-ft {
        border-top: 1px solid #d2cbcb;
        height: 54px;
        padding-left: 25px;
        line-height: 54px;
      }
    }
  }
</style>