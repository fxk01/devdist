<template>
  <div class="work-block">
    <ul>
      <li>
        <p class="ax-u9923-text">業績完成</p>
        <p class="ax-u9927-text mt-5-55">{{this.getFmtDate()}}</p>
        <p class="ax-u9924-text" :class="{ 'ax-u1825-text': achieveDataByData['CompleteMoney'] === 0 }">
          {{achieveDataByData['CompleteMoney'] !== '' && achieveDataByData['CompleteMoney'] !== 0 ? achieveDataByData['CompleteMoney'].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : '--'}}&nbsp;&nbsp;
          <span class="ax-u9926-text">HKD</span>
        </p>
        <div style="margin-top: 25px">
          <label class="ax-u9925-text">完成率：</label>
          <el-progress :percentage="achieveDataByData['CompletePercent'] !== '' ? achieveDataByData['CompletePercent'] : 0" :color="customColor" class="workGm-progress"></el-progress>
        </div>
      </li>

      <li>
        <p class="ax-u9923-text">新增保單</p>
        <p class="ax-u9927-text mt-5-55">{{this.getFmtDate()}}</p>
        <p class="ax-u9924-text" :class="{ 'ax-u1825-text': achieveDataByData['NewOrderCount'] === 0 }">
          {{achieveDataByData['NewOrderCount'] !== 0 ? achieveDataByData['NewOrderCount'] : '--'}}&nbsp;&nbsp;
          <span class="ax-u9926-text">份</span>
        </p>
        <div style="margin-top: 25px">
          <span class="ax-u9925-text">保單總量：</span>
          <span class="ax-u9925-text">{{achieveDataByData['AllOrderCount'] !== 0 ? achieveDataByData['AllOrderCount'] + '份' : '--'}}</span>
          <span class="ax-u9925-text" style="padding-left: 28px;">环比：</span>
          <span class="ax-u9925-text" :style="{ color: achieveDataByData['OrderChainRatio'] !== 0 ? '#FF0000' : ''}">{{achieveDataByData['OrderChainRatio'] !== 0 ? achieveDataByData['OrderChainRatio'] + '%' : '--'}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  /**
   * @Description: 工作台
   * @author 李凯明
   * @date 2019/11/4
  */

  import { mixin } from '@/utils/common';

  export default {
    mixins: [mixin],
    props: ['achieveDataByData'],
    name: 'WorkBlock',
    data() {
      return {
        customColor: '#409eff',
      }
    },
  }
</script>

<style lang="less">
  .work-block {
    .mt-5-55 {
      margin: 5px 0 55px 0;
    }
    ul {
      width: 100%;
      float: left;
      margin-bottom: 23px;
    }
    ul li:first-child {
      margin-right: 1%;
    }
    ul li {
      display: inline-block;
      padding: 25px 1%;
      /*padding: 25px 20px;*/
      background-color: #ffffff;
      width: 47.5%;
      height: 205px;
      vertical-align: middle;
      float: left;
    }
    .el-progress {
      position: relative;
      line-height: 1;
      display: inline-block;
      width: 35%;
    }
    .el-progress-bar__outer {
      border-radius: 0;
    }
    .el-progress-bar__inner {
      border-radius: 0;
    }
    .workGm-progress {
      width: 65%;
      .el-progress__text {
        color: #0099FF;
      }
    }
    .workGm-progress .el-progress-bar {
      padding-right: inherit;
      width: inherit;
      margin-right: inherit;
    }
  }
</style>