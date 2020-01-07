<template>
  <div class="achievementPk">
    <div class="box-wrap">
      <span class="ax-u4848-text">業績PK榜</span>

      <el-select v-model="value" placeholder="请选择" class="fr" @change="(value) => {this.emitRankDataByDir(value), this.currentPage = 1}">
        <el-option
            v-for="(item, index) in timeFrame"
            :key="index"
            :label="item['BO_Value']"
            :value="item['BO_Value']">
        </el-option>
      </el-select>
    </div>

    <div class="tab-list">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="保費金額" name="first">
          <ul>
            <li class="sidebar-nav-li" v-for="(item, index) in rankDataByDirFucArr" :key="index" :style="{height: item['RankNum'] > 3 ? '43px' : ''}">
              <img class="va-middle" v-if="item['RankNum'] === 1" src="@/assets/images/one.png">
              <img class="va-middle" v-if="item['RankNum'] === 2" src="@/assets/images/two.png">
              <img class="va-middle" v-if="item['RankNum'] === 3" src="@/assets/images/three.png">
              <span class="va-middle ax-u1468-text wd80-ib" v-if="item['RankNum'] > 3" style="width: 35px;">{{item['RankNum']}}</span>
              <span class="va-middle ax-u1468-text wd80-ib">
                {{staffIdentity === '銷售總監' ? item['StfNameShow'] : item['Stf_Name']}}
              </span>
              <span class="va-middle ax-u1468-text wd125-ib" :style="{ color: item['SumOrderMoney'] === 0 ? '#333333' : '#FF0000'}">
                {{item['SumOrderMoney'] !== 0 ? item['SumOrderMoney'].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : '--'}}
              </span>
            </li>
          </ul>
        </el-tab-pane>

        <el-tab-pane label="保單單數" name="second">
          <ul>
            <li class="sidebar-nav-li" v-for="(item, index) in rankDataByDirFucArr" :key="index" :style="{height: item['RankNum'] > 3 ? '43px' : ''}">
              <img class="va-middle" v-if="item['RankNum'] === 1" src="@/assets/images/one.png">
              <img class="va-middle" v-if="item['RankNum'] === 2" src="@/assets/images/two.png">
              <img class="va-middle" v-if="item['RankNum'] === 3" src="@/assets/images/three.png">
              <span class="va-middle ax-u1468-text wd80-ib" v-if="item['RankNum'] > 3" style="width: 35px;">{{item['RankNum']}}</span>
              <span class="va-middle ax-u1468-text wd80-ib">
                {{staffIdentity === '銷售總監' ? item['StfNameShow'] : item['Stf_Name']}}
              </span>
              <span class="va-middle ax-u1468-text wd125-ib" :style="{ color: item['SumOrderCount'] === 0 ? '#333333' : '#FF0000'}">
                {{item['SumOrderCount'] !== 0 ? item['SumOrderCount'] : '--'}}
              </span>
            </li>
          </ul>
        </el-tab-pane>

        <el-tab-pane label="最大保單" name="third">
          <ul>
            <li class="sidebar-nav-li" v-for="(item, index) in rankDataByDirFucArr" :key="index" :style="{height: item['RankNum'] > 3 ? '43px' : ''}">
              <img class="va-middle" v-if="item['RankNum'] === 1" src="@/assets/images/one.png">
              <img class="va-middle" v-if="item['RankNum'] === 2" src="@/assets/images/two.png">
              <img class="va-middle" v-if="item['RankNum'] === 3" src="@/assets/images/three.png">
              <span class="va-middle ax-u1468-text wd80-ib" v-if="item['RankNum'] > 3" style="width: 35px;">{{item['RankNum']}}</span>
              <span class="va-middle ax-u1468-text wd80-ib text-ellipsis" :title="item['MaxOrderNo']">
                {{item['MaxOrderNo']}}
              </span>
              <span class="va-middle ax-u1468-text wd80-ib">
                {{item['Stf_Name']}}
<!--                {{staffIdentity === '銷售總監' ? item['StfNameShow'] : item['Stf_Name']}}-->
              </span>
              <span class="va-middle ax-u1468-text wd125-ib" :style="{ color: item['MaxOrderMoney'] === 0 ? '#333333' : '#FF0000'}">
                {{item['MaxOrderMoney'] !== 0 ? item['MaxOrderMoney'].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : '--'}}
              </span>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>

      <div class="ta-center" style="padding-top: 82.25px;" v-show="totalCount === 0">
        <img src="@/assets/images/icon-not-data.png">
        <p class="ax-u10672-text" style="margin: 5px 0 28px 0">暫無數據</p>
      </div>

      <el-pagination
          v-if="totalCount > 0"
          layout="prev, pager, next"
          :current-page.sync="currentPage"
          :page-size="5"
          :total="totalCount"
          @current-change="(size) => {this.emitRankDataByDir(value, size)}"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['timeFrame', 'rankDataByDirFucArr', 'totalCount'],
    name: 'AchievementPk',
    data() {
      return {
        currentPage: 1,
        options: [],
        value: '本月',
        staffIdentity: sessionStorage.getItem('fc_staffIdentity'),
        activeName: 'first',
        objType: {
          val: '',
          cur: '',
          rankType: 0
        }
      }
    },
    mounted() {
      this.$emit('emitRankDataByDir', {
        val: this.value
      });
      this.staffIdentity = sessionStorage.getItem('fc_staffIdentity');
    },
    methods: {
      handleClick(tab) {
        this.objType['rankType'] = tab.index;
        this.$emit('emitRankDataByDir', {
          val: this.objType['val'] || this.value,
          cur: 1,
          rankType: parseInt(tab.index)
        });
        this.currentPage = 1
      },
      emitRankDataByDir(val, cur) {
        this.objType['val'] = val;
        this.objType['cur'] = cur;
        this.$emit('emitRankDataByDir', {
          val,
          cur,
          rankType: parseInt(this.objType['rankType'])
        });
      }
    }
  }
</script>

<style lang="less">
  .achievementPk {
    .box-wrap {
      line-height: 32px;
      margin: 23px 0;
    }
    .tab-list {
      height: 375px;
      background-color: #ffffff;
      position: relative;
      .pr-50 {
        padding-right: 50px;
      }
      .pr-10 {
        padding-right: 10px;
      }
      .sidebar-nav-li {
        text-align: center;
        margin-bottom: 15px;
        line-height: 43px;
      }
      .el-tabs__nav {
        float: inherit;
        text-align: center;
      }
      .wd80-ib {
        width: 115px;
        display: inline-block;
      }
      .wd125-ib {
        display: inline-block;
        width: 90px;
        text-align: right;
      }
      .el-tabs__nav-wrap::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 0;
        background-color: inherit;
        z-index: 1;
      }
      .el-tabs__active-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 0;
        background-color: inherit;
      }
      #tab-first:after, #tab-second:after {
        content: '';
        position: absolute;
        top: 37%;
        background: #666666;
        width: 1px;
        height: 10px;
        left: 100%;
      }
      .el-pagination {
        white-space: nowrap;
        padding: inherit;
        color: #303133;
        font-weight: 700;
        text-align: center;
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
    .text-ellipsis {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>