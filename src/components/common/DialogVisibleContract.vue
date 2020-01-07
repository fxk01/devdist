<template>
  <div>
    <el-dialog
        title=""
        :visible.sync="dialogContract"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleClose"
        width="30%"
        class="diaLogSign diaLogContract"
    >
      <div slot="title" class="header-title">
        <img class="va-middle" src="@/assets/images/icon-complete.png">
        <span class="va-middle ax-u5724-text">{{getTipContractData['Tip_Title']}}</span>
      </div>

      <div class="ta-center mt55" v-if="getTipContractData['Order_Info']['BC_OrderStatus'] === '拒保'">
        <span class="info-text-hkd" style="width: inherit;">保費HKD</span>

        <span class="ax-u5718-text" style="padding-left: 10px;">{{getTipContractData['Order_Info']['BC_OrderMoney'] | thousandth}}</span>
      </div>

      <div class="ta-center mt55" v-else>
        <span class="info-text-hkd" style="width: inherit;">HKD</span>

        <span class="ax-u5718-text" style="padding-left: 10px;">{{getTipContractData['Order_Info']['BC_OrderMoney'] | thousandth}}</span>
      </div>

      <el-steps :active="2" align-center class="contract-steps" v-if="getTipContractData['BT_Type'] === '核保通知' && getTipContractData['BT_TargetStatus'] === '保單正式生效'">
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">創建合同</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">冷靜期</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text" style="font-size: 13px; padding-bottom: 5px; color: #0099FF;">正式保單</p>
          <img slot="icon" src="@/assets/images/icon-curDg.png">
          <p slot="description" class="ax-u5846-text">{{getTipContractData['BT_CreateTime'] | hkDate('MD')}}</p>
        </el-step>
      </el-steps>

      <el-steps :active="2" align-center class="contract-steps" v-else-if="getTipContractData['BT_Type'] === '核保通知' && getTipContractData['BT_TargetStatus'] === '冷靜期'">
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">創建合同</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text" style="font-size: 13px; padding-bottom: 5px; color: #0099FF;">冷靜期</p>
          <img slot="icon" src="@/assets/images/icon-curDg.png">
          <p slot="description" class="ax-u5846-text">{{getTipContractData['Order_Info']['BC_OrderUpdateTime'] | hkDate('MD')}}</p>
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">正式保單</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
      </el-steps>

      <el-steps :active="1" align-center class="contract-steps" v-else-if="getTipContractData['BT_Type'] === '新增合同'">
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text" style="font-size: 13px; padding-bottom: 5px; color: #0099FF;">創建合同</p>
          <img slot="icon" src="@/assets/images/icon-curDg.png">
          <p slot="description" class="ax-u5846-text">{{getTipContractData['Order_Info']['BC_OrderUpdateTime'] | hkDate('MD')}}</p>
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">冷靜期</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">正式保單</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
      </el-steps>

      <el-steps :active="2" align-center class="contract-steps" v-else-if="getTipContractData['BT_Type'] === '核保通知' && getTipContractData['Order_Info']['BC_OrderStatus'] === '拒保'">
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">創建合同</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5718-text" style="font-size: 13px; padding-bottom: 5px;">拒保</p>
          <img slot="icon" src="@/assets/images/icon-tb.png">
          <p slot="description" class="ax-u5846-text">{{getTipContractData['Order_Info']['BC_OrderUpdateTime'] | hkDate('MD')}}</p>
        </el-step>
      </el-steps>

      <el-steps :active="3" align-center class="contract-steps" v-else-if="getTipContractData['BT_Type'] === '核保通知' && getTipContractData['Order_Info']['BC_OrderStatus'] === '退保'">
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">創建合同</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5846-text">冷靜期</p>
          <img slot="icon" src="@/assets/images/icon-creater.png">
        </el-step>
        <el-step title="" description="">
          <p slot="title" class="ax-u5718-text" style="font-size: 13px; padding-bottom: 5px;">退保</p>
          <img slot="icon" src="@/assets/images/icon-tb.png">
          <p slot="description" class="ax-u5846-text">{{getTipContractData['Order_Info']['BC_OrderUpdateTime'] | hkDate('MD')}}</p>
        </el-step>
      </el-steps>

      <ul class="contract-cooling" v-if="getTipContractData['BT_Type'] === '核保通知' && getTipContractData['Order_Info']['BC_OrderStatus'] === '正式'">
        <li>
          <span class="info-text-hkd">客戶姓名</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['Cst_Name']}}</span>
          <span class="ax-u5735-text fr" @click="hrefCustomerDetailsFuc(getTipContractData['Order_Info']['Cst_Code'])">詳情></span>
        </li>
        <li>
          <span class="info-text-hkd">合同名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderName']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">保單號</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderNo']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">產品名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderProductType']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">生效日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderStartDate'].split('T')[0]}}</span>
        </li>
        <li>
          <span class="info-text-hkd">簽發日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderSignDate'].split('T')[0]}}</span>
        </li>
        <li>
          <span class="info-text-hkd">過期日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderEndDate'].split('T')[0]}}</span>
        </li>
      </ul>

      <ul class="contract-establish" v-else-if="getTipContractData['BT_Type'] === '新增合同'">
        <li>
          <span class="info-text-hkd">客戶姓名</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['Cst_Name']}}</span>
          <span class="ax-u5735-text fr" @click="hrefCustomerDetailsFuc(getTipContractData['Order_Info']['Cst_Code'])">詳情></span>
        </li>
        <li>
          <span class="info-text-hkd">合同名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderName']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">產品名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderProductType']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">簽發日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderSignDate'].split('T')[0]}}</span>
        </li>
      </ul>

      <ul class="contract-cooling" v-else-if="getTipContractData['BT_Type'] === '核保通知' && getTipContractData['Order_Info']['BC_OrderStatus'] === '拒保'">
        <li>
          <span class="info-text-hkd">客戶姓名</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['Cst_Name']}}</span>
          <span class="ax-u5735-text fr" @click="hrefCustomerDetailsFuc(getTipContractData['Order_Info']['Cst_Code'])">詳情></span>
        </li>
        <li>
          <span class="info-text-hkd">合同名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderName']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">產品名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderProductType']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">簽發日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderSignDate'].split('T')[0]}}</span>
        </li>
      </ul>

      <ul class="contract-cooling" v-else-if="getTipContractData['BT_Type'] === '核保通知' && getTipContractData['Order_Info']['BC_OrderStatus'] === '退保'">
        <li>
          <span class="info-text-hkd">客戶姓名</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['Cst_Name']}}</span>
          <span class="ax-u5735-text fr" @click="hrefCustomerDetailsFuc(getTipContractData['Order_Info']['Cst_Code'])">詳情></span>
        </li>
        <li>
          <span class="info-text-hkd">合同名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderName']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">保單號</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderNo']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">產品名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderProductType']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">生效日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderStartDate'].split('T')[0]}}</span>
        </li>
        <li>
          <span class="info-text-hkd">簽發日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderSignDate'].split('T')[0]}}</span>
        </li>
        <li>
          <span class="info-text-hkd">過期日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderEndDate'].split('T')[0]}}</span>
        </li>
      </ul>

      <ul class="contract-cooling" v-else-if="getTipContractData['BT_Type'] === '核保通知' && getTipContractData['Order_Info']['BC_OrderStatus'] === '冷靜期'">
        <li>
          <span class="info-text-hkd">客戶姓名</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['Cst_Name']}}</span>
          <span class="ax-u5735-text fr" @click="hrefCustomerDetailsFuc(getTipContractData['Order_Info']['Cst_Code'])">詳情></span>
        </li>
        <li>
          <span class="info-text-hkd">合同名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderName']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">保單號</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderNo']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">產品名稱</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderProductType']}}</span>
        </li>
        <li>
          <span class="info-text-hkd">生效日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderStartDate'].split('T')[0]}}</span>
        </li>
        <li>
          <span class="info-text-hkd">簽發日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderSignDate'].split('T')[0]}}</span>
        </li>
        <li>
          <span class="info-text-hkd">過期日期</span>
          <span class="ax-u5719-text">{{getTipContractData['Order_Info']['BC_OrderEndDate'].split('T')[0]}}</span>
        </li>
      </ul>

      <div class="contract-ft">
        <span class="ax-u5719-text">所屬代理人：{{getTipContractData['Order_Info']['Stf_Name']}}</span>
      </div>
    </el-dialog>

    <el-dialog
        title=""
        :visible.sync="dialogVisibleSign"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleClose"
        width="30%"
        class="diaLogSign diaLogSign2"
    >
      <div slot="title" class="header-title">
        <img class="va-middle" src="@/assets/images/icon-complete.png">
        <span class="va-middle ax-u5724-text">{{getTipInfoData['Tip_Title']}}</span>
      </div>

      <div class="bg-complete">
        {{getTipInfoData['MdrtInfo']['MdrtType']}}
      </div>

      <p class="info-stf-name">{{getTipInfoData['MdrtInfo']['Stf_Name']}}</p>

      <div class="ta-center">
        <span class="info-text-hkd info-hkd-center">HKD</span>

        <div class="info-text-wrap ta-center">
          <p class="ax-u5718-text">{{getTipInfoData['MdrtInfo']['SumOrderMoney'] | thousandth}}</p>
          <p class="info-text-hkd info-hkd-center">業績完成</p>
        </div>
      </div>

      <div class="ta-center ax-u5719-text">
        <span>完成時間：</span>
        <span>{{getTipInfoData['MdrtInfo']['CompleteDate'].split('T')[0]}}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * @Description:
   * @author 李凯明 工作台消息合同弹框
   * @date 2019/11/18
  */

  export default {
    props: ['dialogContract', 'dialogVisibleSign', 'getTipInfoData', 'getTipContractData'],
    name: 'dialogVisibleContract',
    data() {
      return {

      }
    },
    methods: {
      handleClose(done) {
        if(this.dialogVisibleSign) {
          this.$emit('update:dialogVisibleSign', false);
        } else {
          this.$emit('update:dialogContract', false);
        }
      },
      hrefCustomerDetailsFuc(code) {
        this.$emit('update:dialogContract', false);
        
        this.$router.push({
          path: `/customerDetails?Cst_Code=${code}`
        })
      }
    }
  }
</script>

<style lang="less">
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
      background: url(../../assets/images/icon-tot.jpg) no-repeat;
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
      cursor: pointer;
      text-decoration: underline;
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
  .diaLogSign2 {
    .info-hkd-center {
      width: inherit !important;
    }
    .info-text-wrap {
      margin-right: 50px;
    }
  }
</style>