<template>
  <div class="workFunnel">
    <div class="box-wrap">
      <span class="ax-u4848-text">銷售漏斗分析</span>

      <el-select v-model="value" placeholder="请选择" class="fr" @change="(value, selectedData) => {this.emitGetFunnel(value, selectedData)}">
        <el-option
            v-for="(item, index) in timeFrame"
            :key="index"
            :label="item['BO_Value']"
            :value="item['BO_Value']"
        >
        </el-option>
      </el-select>
    </div>

    <div class="tab-list">
      <ul>
        <li v-for="(item, index) in getFunnelDataByDirArr" :key="index">
          <button
              :class="`but ${index === 1 ? 'nth2-but' : ''} ${index === 2 ? 'nth3-but' : ''} ${index === 3 ? 'nth4-but' : ''}`"
              :style="{ color: index === getFunnelDataByDirArr.length - 1 ? '#333333' : ''}"
          >
            {{item['SumOrderMoney'] !== 0 ? 'HKD' + '&nbsp;' + item['SumOrderMoney'].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : '--'}}
          </button>
<!--          <span class="ax-u9925-text">{{item['OrderStep']}}</span>-->
<!--          <span class="ax-u9925-text">({{item['OrderCount']}})</span>-->
        </li>
      </ul>

      <ul class="tab-list-ul2">
        <li v-for="(item, index) in getFunnelDataByDirArr" :key="index">
          <span class="ax-u9925-text">{{item['OrderStep']}}</span>
          <span class="ax-u9925-text">({{item['OrderCount']}})</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['timeFrame', 'getFunnelDataByDirArr'],
    name: 'WorkFunnel',
    data() {
      return {
        options: [],
        value: '本月',
      }
    },
    mounted() {
      this.$emit('GetFunnelDataByDirFuc', this.value);
    },
    methods: {
      emitGetFunnel(val) {
        this.$emit('GetFunnelDataByDirFuc', val);
      }
    }
  }
</script>

<style lang="less">
  .workFunnel {
    .box-wrap {
      line-height: 32px;
      margin: 23px 0;
    }
    .tab-list {
      text-align: center;
      height: 265px;
      background-color: #ffffff;
      ul {
        padding: 30px 0;
        display: inline-block;
        vertical-align: top;
      }
      li {
        /*text-align: center;*/
        padding-bottom: 20px;
      }
      .but {
        width: 235px;
        height: 32px;
        background: inherit;
        background-color: rgba(153, 0, 0, 1);
        border: none;
        border-radius: 5px;
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
        box-shadow: none;
        font-size: 14px;
        color: #FFFFFF;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        text-align: center;
        line-height: normal;
        margin-right: 13px;
      }
      .nth2-but {
        width: 204px;
        height: 31px;
        background: inherit;
        background-color: rgba(204, 51, 0, 1);
      }
      .nth3-but {
        width: 172px;
        height: 31px;
        background: inherit;
        background-color: rgba(255, 153, 102, 1);
      }
      .nth4-but {
        width: 141px;
        height: 31px;
        background: inherit;
        background-color: rgba(255, 204, 153, 1);
      }
    }
    .tab-list-ul2 li {
      text-align: left;
      padding-bottom: 25px;
      padding-top: 7px;
    }
  }
</style>