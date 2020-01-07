<!-- 工作台-主管 -->
<template>
  <div class="work-bm">
    <div class="left-wrap">
      <work-block :achieveDataByData="achieveDataByData" />

      <div class="cylindrical-wrap">
        <span class="ax-default-text ax-u4848-text">業績完成情況</span>

        <el-select v-model="value" placeholder="请选择" class="fr" @change="(value, selectedData)=>{this.GetAchieveCompleteByFuc(value, selectedData)}">
          <el-option
              v-for="(item, index) in timeFrame"
              :key="index"
              :label="item['BO_Value']"
              :value="item['BO_Value']"
          >
          </el-option>
        </el-select>
      </div>

      <div class="cylindrical-content" :id="idMain"></div>

      <div class="cylindrical-wrap">
        <span class="ax-default-text ax-u4848-text">待辦事項</span>
      </div>

      <workMatter :getToDoDataByDirData="getToDoDataByDirData" />
    </div>

    <div class="right-wrap">
      <ul class="right-wrap-ul">
        <li>
          <p class="ax-u9923-text">新增客戶</p>
          <p class="ax-u9927-text mt-5-55">{{this.getFmtDate()}}</p>
          <p class="ax-u9924-text" :class="{ 'ax-u1825-text': achieveDataByData['NewCustCount'] === 0 }">
            {{achieveDataByData['NewCustCount'] !== 0 ? achieveDataByData['NewCustCount'] : '--'}}&nbsp;&nbsp;
            <span class="ax-u9926-text">人</span>
          </p>
          <div style="margin-top: 25px">
            <span class="ax-u9925-text">客戶總量：</span>
            <span class="ax-u9925-text">{{achieveDataByData['AllCustCount'] !== 0 ? achieveDataByData['AllCustCount'] + '人' : '--'}}</span>
            <span class="ax-u9925-text" style="padding-left: 28px;">环比：</span>
            <span class="ax-u9925-text" :style="{ color: achieveDataByData['OrderChainRatio'] !== 0 ? '#FF0000' : ''}">{{achieveDataByData['CustChainRatio'] !== 0 ? achieveDataByData['CustChainRatio'] + '%' : '--'}}</span>
          </div>
        </li>
      </ul>

      <AchievementPk
          :timeFrame="timeFrame"
          :rankDataByDirFucArr="rankDataByDirFucArr"
          :totalCount="totalCount"
          @emitRankDataByDir="emitRankDataByDirFuc"
      />

      <WorkFunnel
          :getFunnelDataByDirArr="getFunnelDataByDirArr"
          :timeFrame="timeFrame"
          @GetFunnelDataByDirFuc="GetFunnelDataByDirFuc"
      />
    </div>

    <dialogVisibleContract
        :dialogContract.sync="dialogContractBm"
        :dialogVisibleSign.sync="dialogVisibleSignTag"
        :getTipInfoData="getTipInfoData"
        :getTipContractData="getTipContractData"
    />

    <el-dialog :visible.sync="dialogMsgOneArticle" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="dialogMsgMultiple" center>
      <div class="ta-center">
        <img class="icon" src="@/assets/images/icon-one.png"/>
        <p class="ax-u5197-text" style="margin-bottom: 23px;">{{promptInfoData['PromptTitle']}}</p>
        <p style="margin-bottom: 25px; color: #999999;">{{promptInfoData['PromptDesc']}}</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-ec0928" @click="hrefOneArticleFuc(promptInfoData)">查看详情</el-button>
        <p class="ax-u5197-text" style="font-size: 14px; margin: 20px; cursor: pointer;" @click="dialogMsgOneArticle = false">暫不處理</p>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogMsgMultiple" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="dialogMsgMultiple" center>
      <div class="ta-center">
        <img class="icon" src="@/assets/images/icon-file.png"/>
        <p class="ax-u5197-text">您有多條消息通知！</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn-ec0928" @click="hrefMsgFuc">立即查看</el-button>
        <p class="ax-u5197-text" style="font-size: 14px; margin: 20px; cursor: pointer;" @click="dialogMsgMultiple = false">暫不處理</p>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * @Description: 保险代理工作台
   * @author 李凯明
   * @date 2019/11/04
   */

  import { mixin } from '@/utils/common';
  import WorkBlock from '@/components/common/work/WorkBlock.vue'
  import workMatter from '@/components/common/work/WorkMatter.vue'
  import AchievementPk from '@/components/common/work/AchievementPk.vue'
  import WorkFunnel from '@/components/common/work/WorkFunnel.vue'
  import dialogVisibleContract from '@/components/common/DialogVisibleContract.vue';
  import * as echarts from 'echarts/lib/echarts';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/toolbox';
  import 'echarts/lib/component/legend';
  import 'echarts/lib/component/markPoint';

  export default {
    mixins: [mixin],
    name: 'workbenchBm',
    data() {
      return {
        dialogContractBm: false,
        dialogVisibleSignTag: false,
        dialogMsgOneArticle: false,
        dialogMsgMultiple: false,
        idMain: sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? 'mainGm' : 'mainBm',
        timeFrame: [],
        achieveDataByData: {
          CompleteMoney: '',
          CompletePercent: '',
          NewOrderCount: '',
          AllOrderCount: '',
          OrderChainRatio: '',
          NewCustCount: '',
          AllCustCount: '',
          CustChainRatio: ''
        },
        getToDoDataByDirData: {
          NewPoolCount: '',
          RecoveryCount: '',
          IsNeedSetPlan: '',
          noData: false
        },
        getFunnelDataByDirArr: [],
        rankDataByDirFucArr: [],
        totalCount: 0,
        xAxisData: [],
        seriesData: [],
        seriesData2: [],
        value: '本月',
        maxYData: 0,
        roundLogoArr: [],
        promptInfoData: {},
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
        myChartBmGm: '',
      }
    },
    components: {
      [WorkBlock.name]: WorkBlock,
      [workMatter.name]: workMatter,
      [AchievementPk.name]: AchievementPk,
      [WorkFunnel.name]: WorkFunnel,
      [dialogVisibleContract.name]: dialogVisibleContract,
    },
    watch: {
      promptInfoData: {
        handler(newVal) {
          if(newVal['TipCount'] === 1) {
            this.dialogMsgOneArticle = true;
            return
          }
          if(newVal['TipCount'] > 1) {
            this.dialogMsgMultiple = true
          }
        },
        deep: true,
        immediate: true
      }
    },
    updated() {
      this.promptInfoData = this.$store.state['getPromptInfoData'];
    },
    mounted() {
      this.chartBar();
      this.GetAchieveDataByDirFuc();
      this.GetAchieveCompleteByFuc();
      this.GetToDoDataByDirFuc();
    },
    methods: {
      chartBar() {
        let _self = this;
        let _option = {};
        if(this.idMain === 'mainGm') {
          this.myChartBmGm = echarts.init(document.getElementById(this.idMain));
          _option = {
            color: ['#4F81BD', '#C0504D'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              bottom: 10,
              left: 'center',
              data: ['預期目標', '完成業績'],
            },
            // toolbox: {
            //   show: true,
            //   orient: 'vertical',
            //   left: 'right',
            //   top: 'center',
            //   feature: {
            //     mark: {show: true},
            //     dataView: {show: true, readOnly: false},
            //     magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            //     restore: {show: true},
            //     saveAsImage: {show: true}
            //   }
            // },
            calculable: true,
            xAxis: [
              {
                type: 'category',
                axisTick: {show: false},
                data: _self.xAxisData,
                axisLabel: {
                  interval: 0,
                  rotate: 0
                }
              }
            ],
            yAxis: {
              type: 'value',
              min: 0,
              max: this.maxYData,
            },
            series: [
              {
                name: '預期目標',
                type: 'bar',
                barGap: 0,
                data: _self.seriesData,
              },
              {
                name: '完成業績',
                type: 'bar',
                data: _self.seriesData2,
              },
            ]
          }
        } else {
          this.myChartBmGm = echarts.init(document.getElementById(this.idMain));
          _option = {
            color: ['#4F81BD', '#C0504D'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              bottom: 10,
              left: 'center',
              data: ['預期目標', '完成業績'],
            },
            // toolbox: {
            //   show: true,
            //   orient: 'vertical',
            //   left: 'right',
            //   top: 'center',
            //   feature: {
            //     mark: {show: true},
            //     dataView: {show: true, readOnly: false},
            //     magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            //     restore: {show: true},
            //     saveAsImage: {show: true}
            //   }
            // },
            calculable: true,
            xAxis: [
              {
                type: 'category',
                axisTick: {show: false},
                data: _self.xAxisData,
                axisLabel: {
                  interval: 0,
                  rotate: 0
                }
              }
            ],
            yAxis: {
              type: 'value',
              min: 0,
              max: this.maxYData,
            },
            series: [
              {
                name: '預期目標',
                type: 'bar',
                barGap: 0,
                data: _self.seriesData,
              },
              {
                name: '完成業績',
                type: 'bar',
                data: _self.seriesData2,
                // image://http://${window.location.host}/src/assets/images/icon-mct.png
                // @/assets/images/icon-file.png
                markPoint: {
                  symbol: 'image://static/images/comm/icon_mct.png',
                  // symbolOffset: [0, '-100%'],
                  symbolOffset: [0, '-70%'],
                  data: this.roundLogoArr,
                },
              },
            ]
          }
        }
        this.myChartBmGm.setOption(_option);
        window.onresize = () => {
          this.myChartBmGm.resize();
        }
      },
      GetAchieveDataByDirFuc() {
        let str = sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? 'GetAchieveDataByChief' : 'GetAchieveDataByDir';
        this.$store.dispatch('getTypeData', '時間範圍').then(() => {
          this.timeFrame = this.$store.state['timeFrame'];
        });
        this.$post(`/api/WorkSpaceApi/${str}`, {}).then(res => {
          if(res['IsSuccess']) {
            this.achieveDataByData = res.Info;

            if(this.achieveDataByData['CompletePercent'] > 100) {
              this.achieveDataByData['CompletePercent'] = 100
            }
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      GetAchieveCompleteByFuc(val) {
        let str = sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? 'GetAchieveCompleteByChief' : 'GetAchieveCompleteByDir';
        this.$post(`/api/WorkSpaceApi/${str}`, { DateRangeType: val || '本月'}).then(res => {
          if(res['IsSuccess']) {
            if(res['Info'].length > 0) {
              this.xAxisData.splice(0, this.xAxisData.length);
              this.seriesData.splice(0, this.seriesData.length);
              this.seriesData2.splice(0, this.seriesData2.length);
              this.roundLogoArr.splice(0, this.roundLogoArr.length);
              for(let i = 0, l = res['Info'].length; i < l; i++) {
                if(sessionStorage.getItem('fc_staffIdentity') === '銷售總監') {
                  this.xAxisData.push(res['Info'][i]['BT_Name']);
                } else {
                  this.xAxisData.push(res['Info'][i]['Stf_Name']);
                }
                if(res['Info'][i]['MDRTType'] !== '') {
                  this.roundLogoArr.push({
                    value: res['Info'][i]['MDRTType'],
                    xAxis: i,
                    yAxis: res['Info'][i]['SumOrderMoney'],
                    itemStyle: {
                      color: '#333333'
                    },
                  })
                }
                this.seriesData.push(res['Info'][i]['TargetOrderMoney']);
                this.seriesData2.push(res['Info'][i]['SumOrderMoney']);
              }
              let _maxYData = this.seriesData2.reduce((a, b) => {
                return b > a ? b : a
              });
              let _maxYData2 = this.seriesData.reduce((a, b) => {
                return b > a ? b : a
              });
              this.maxYData = parseInt(_maxYData2 > _maxYData ? _maxYData2 + (_maxYData2 * 1) : _maxYData + (_maxYData * 1));
              this.chartBar();
            }
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      GetToDoDataByDirFuc() {
        let str = sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? 'GetToDoDataByChief' : 'GetToDoDataByDir';
        this.$post(`/api/WorkSpaceApi/${str}`, {}).then(res => {
          if(res['IsSuccess']) {
            this.getToDoDataByDirData = res.Info;
            if(res.Info['IsNeedSetPlan'] === false && res.Info['NewPoolCount'] <= 0 && res.Info['RecoveryCount'] <= 0) {
              this.getToDoDataByDirData.noData = true
            } else {
              this.getToDoDataByDirData.noData = false
            }
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      GetFunnelDataByDirFuc(val) {
        let str = sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? 'GetFunnelDataByChief' : 'GetFunnelDataByDir';
        this.$post(`/api/WorkSpaceApi/${str}`, { DateRangeType: val }).then(res => {
          if(res['IsSuccess']) {
            this.getFunnelDataByDirArr = res.Info;
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      emitRankDataByDirFuc(obj) {
        let str = sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? 'GetRankDataByChief' : 'GetRankDataByDir';
        this.$post(`/api/WorkSpaceApi/${str}`, {
          DateRangeType: obj.val,
          PageIndex: obj['cur'] || 1,
          PageSize: 5,
          RankType: obj['rankType'] || 0
        }).then(res => {
          if(res['IsSuccess']) {
            if(sessionStorage.getItem('fc_staffIdentity') === '銷售總監') {
              this.totalCount = res['TotalCount'] > 10 ? 10 : res['TotalCount'];
            } else {
              if(obj['rankType'] === 2) {
                this.totalCount = res['TotalCount'] > 10 ? 10 : res['TotalCount'];
              } else {
                this.totalCount = res['TotalCount'];
              }
            }
            this.rankDataByDirFucArr = res['Datas'];
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      hrefOneArticleFuc(item) {
        this.$post('/api/BasicsApi/GetTipInfo', {BT_ID: item['BT_ID']}).then(res => {
          if(res['IsSuccess']) {
            let type;
            type = res['Info']['BT_Type'].split('-')[1];
            if(type === 'TOT' || type === 'COT' || type === 'MDRT') {
              this.dialogMsgOneArticle = false;
              this.dialogContractBm = false;
              this.dialogVisibleSignTag = true;
              this.getTipInfoData = res['Info'];
            } else {
              this.dialogMsgOneArticle = false;
              this.dialogVisibleSignTag = false;
              this.dialogContractBm = true;
              this.getTipContractData = res['Info'];
            }
            this.$store.dispatch('getPromptInfoFuc').then(() => {});
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      hrefMsgFuc() {
        this.dialogMsgMultiple = false;
        this.$router.push({
          path: '/messageList'
        })
      },
    }
  }
</script>

<style lang="less">
  .work-bm {
    padding: 12px;
    .mt-5-55 {
      margin: 5px 0 55px 0;
    }
    .ax-u4848-text {
      font-family: '黑体';
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      color: #333333;
      line-height: normal;
    }
    .ax-u5197-text {
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      color: #333333;
      line-height: normal;
      margin: 60px 0;
    }
    .left-wrap {
      width: 70%;
      display: inline-block;
      .cylindrical-wrap {
        margin: 23px 0;
        line-height: 32px;
        clear: both;
      }
      .cylindrical-content {
        height: 375px;
        background-color: #ffffff;
      }
    }
    .right-wrap {
      display: inline-block;
      vertical-align: top;
      width: 28%;
      margin-left: 18px;
      .right-wrap-ul li {
        display: inline-block;
        /* padding: 25px 20px; */
        padding: 25px 2%;
        background-color: #ffffff;
        width: 96%;
        height: 205px;
        vertical-align: middle;
      }
    }
    .dialogMsgMultiple {
      .el-dialog {
        width: 400px;
        height: 455px;
        border-radius: 5px;
        .el-button--primary {
          width: 140px;
          height: 40px;
        }
      }
    }
  }
</style>