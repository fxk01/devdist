<template>
  <div class="setTarget">
    <div class="nationalTitle">
      <img src="@/assets/images/national.png" class="titleImg">
      <span class="title">銷售目標</span>
    </div>

    <div class="container">
      <div>
        <ul class="fl w100">
          <li class="fr">
            <span class="history" v-if="!yearIsUnequal && historyArr.length > 0" @click="diaLogHistoryList = true">查看歷史銷售目標</span>
          </li>

          <li class="fr" v-if="yearIsUnequal">
            <span class="history" @click="returnHistoryListFuc(new Date().getFullYear())">返回最新銷售目標</span>
          </li>
        </ul>
      </div>

      <div class="cl-both wrap-content">
        <ul class="ta-center details-ul">
          <li>
            {{TeamMoney['BYP_Year']}}年銷售額
          </li>

          <li>
            <span class="hkd-style">HKD</span>
            <span class="amount-style" v-if="TeamMoney['BTP_Money']">&nbsp;{{TeamMoney['BTP_Money'].toLocaleString()}}</span>
          </li>

          <li v-if="!subFinalBut && getTargetData['PlanStatus'] !== '已生效'">
            <button class="but-style" @click="diaLogModifyFinalEchoFuc">修改目標</button>
            <button class="but-style bg-default" @click="diaLogSubFinalFuc">提交終稿</button>
          </li>
        </ul>
      </div>

      <div>
        <ul class="fl w100 mt-20">
          <li class="fl">
            <img src="@/assets/images/zs.png">
            <span class="yearSpan">銷售目標表</span>
          </li>
        </ul>

        <el-table :data="LstMonthPercent" v-if="LstMonthPercent.length !== 0">
          <el-table-column prop="date" label="月度" width="200" align="center"></el-table-column>

          <el-table-column :label="index === 0 ? item['BT_Name'] : item['Stf_Name']" align="center" v-for="(item, index) in LstTeamMonthInfo" :key="index">
            <el-table-column label="占比" align="center">
              <template slot-scope="scope">
                <span class="companyFont" :style="{color: item['BT_Name'] !== null ? '#EE3A43' : ''}">{{item['LstPercentMoney'][scope.row['BMP_Month'] - 1]['Percent']}}%</span>
              </template>
            </el-table-column>
            <el-table-column label="金額" align="center">
              <template slot-scope="scope">
                <span class="companyFont">{{item['LstPercentMoney'][scope.row['BMP_Month'] - 1]['Money'].toLocaleString()}}</span>
              </template>
            </el-table-column>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <el-dialog title="選擇查看的歷史銷售目標：" :visible.sync="diaLogHistoryList" :show-close="false">
      <div class="lookTargetHtml">
        <ul>
          <li class="box-li" v-for="(item, index) in historyArr" :key="index" @click="lookHistoryListFuc(item)">
            {{item.text}}
          </li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="diaLogSubFinal" :show-close="false">
      <div class="subFinalClass">
        <img src="@/assets/images/gth.png" class="va-middle">
        <span class="va-middle sub-ok-text">确定提交最終的銷售目標嗎？</span>
        <p class="va-middle tip-ok-text">提交后将不再允許修改銷售目標，请谨慎操作！</p>

        <ul class="subFinalUl">
          <li class="but1" @click="subOkHistoryFuc">确定</li>
          <li class="but2" @click="diaLogSubFinal = false">取消</li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog
        title="修改銷售目標"
        :visible.sync="diaLogModifyFinal"
        :show-close="false"
        class="setWrapDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <ul class="setWrap">
        <li>
          <span class="ax-default">年度目標</span>
          <span class="ax-tip-text">*</span>
          <span class="ax-hkd pt-lr-20">HKD</span>
          <span class="ax-money" v-if="TeamMoney['BTP_Money']">{{TeamMoney['BTP_Money'].toFixed(2)}}</span>
        </li>

        <li>
          <label class="ax-default mr-23" style="vertical-align: text-top;">銷售占比<span class="ax-tip-text">*</span></label>

          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="item['Stf_Name']" v-for="(item, index) in memBerListByIDArr" :key="index">
<!--              @blur="blurFixedTwoFuc"-->
              <el-input
                  v-model="item['BTP_Percent']"
                  v-validate="'required'"
                  :name="item['Stf_Name']"
                  class="width-in"
                  maxlength="6"
                  @input="!/^\d+(\.\d{0,2})?$/.test(item['BTP_Percent']) ? item['BTP_Percent'] = '' : item['BTP_Percent']"
                  onkeyup="if(isNaN(value))execCommand('undo')"
                  onafterpaste="if(isNaN(value))execCommand('undo')"
              >
              </el-input>
              <span>%</span>
              <p class="reg-error">{{errors.first(item['Stf_Name'])}}</p>
            </el-form-item>
          </el-form>

          <p class="ax-tip2-p">說明：以個人為單位佔團隊總目標業績比例，所有人佔比總和必須等於100%</p>
        </li>
      </ul>

      <span slot="footer" class="dialog-footer">
        <el-button @click="diaLogModifyFinal = false">取 消</el-button>
        <el-button type="primary" @click="diaLogModifyOkFuc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * @Description: 已设置目标页面 BM, GM共用一个
   * @author 李凯明
   * @date 2019/10/28
   */

  import { mixin } from '@/utils/common';

  export default {
    mixins: [mixin],
    props: ['getTargetData'],
    name: 'setTarget',
    data() {
      return {
        memBerListByIDArr: [],
        LstMonthPercent: [],
        LstTeamMonthInfo: [],
        TeamMoney: {},
        dialogVisible: false,
        diaLogSubFinal: false,
        diaLogHistoryList: false,
        diaLogModifyFinal: false,
        historyArr: [],
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        yearIsUnequal: false,
        subFinalBut: false,
      }
    },
    mounted() {
      this.LstMonthPercent = this.getTargetData['LstMonthPercent'];
      this.LstTeamMonthInfo = this.getTargetData['LstTeamMonthInfo'];
      this.TeamMoney = this.getTargetData['TeamMoney'];
      this.memBerListByIDArr = this.copyArr(this.getTargetData['LstTeamPercent']);
      this.memBerListByIDArr.map((item) => {
        return Object.assign(item, {
          BTP_Percent: item['BTP_Percent'].toFixed(2),
        })
      });
      this.LstMonthPercent.map((item) => {
        return Object.assign(item, {
          date: item['BMP_Month'] + '月'
        })
      });
      if(this.getTargetData['PlanStatus'] === '已生效') {
        this.subFinalBut = true
      }
      this.getHistoryByDirectorFuc()
    },
    methods: {
      subOkHistoryFuc() {
        this.$post('/api/PlanApi/LockStatusByDir', { Year: new Date().getFullYear() }).then(res => {
          if(res['IsSuccess']) {
            this.subFinalBut = true
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
        // this.diaLogSubFinal = false
      },
      diaLogModifyFinalEchoFuc() {
        this.diaLogModifyFinal = true;
        this.getTargetData['LstTeamPercent'].forEach((item, index) => {
          this.memBerListByIDArr[index]['BTP_Percent'] = Number(item['BTP_Percent']).toFixed(2)
        });
      },
      lookHistoryListFuc(obj) {
        this.$post('/api/PlanApi/GetPlanDataByDir', { Year: obj.year }).then(res => {
          if(res.Info['ChiefIsSet']) {
            this.yearIsUnequal = true;
            this.subFinalBut = true;
            this.TeamMoney = res['Info']['TeamMoney'];
            this.LstMonthPercent = [];
            this.LstTeamMonthInfo = res.Info['LstTeamMonthInfo'];
            this.LstMonthPercent = res.Info['LstMonthPercent'].map((item) => {
              return Object.assign(item, {
                date: item['BMP_Month'] + '月'
              })
            });
          }
          if(!res['IsSuccess']) {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
        this.diaLogHistoryList = false
      },
      returnHistoryListFuc(num) {
        this.$post('/api/PlanApi/GetPlanDataByDir', { Year: num }).then(res => {
          if(res.Info['ChiefIsSet']) {
            this.yearIsUnequal = false;
            if(res['Info']['PlanStatus'] !== '已生效') {
              this.subFinalBut = false;
            }
            this.TeamMoney = res['Info']['TeamMoney'];
            this.LstMonthPercent = [];
            this.LstTeamMonthInfo = res.Info['LstTeamMonthInfo'];
            this.LstMonthPercent = res.Info['LstMonthPercent'].map((item) => {
              return Object.assign(item, {
                date: item['BMP_Month'] + '月'
              })
            });
          }
          if(!res['IsSuccess']) {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      diaLogModifyOkFuc() {
        this.$validator.validate().then((valid) => {
          if(valid === true) {
            let memBerCount = 0;
            let newPercentArr = [];
            this.memBerListByIDArr.forEach((item, index) => {
              newPercentArr.push({
                Stf_ID: item['Stf_ID'],
                SPercent: Number(item['BTP_Percent'])
              });
              memBerCount = memBerCount + Number(item['BTP_Percent'])
            });

            if(memBerCount !== 100) {
              this.$message({
                showClose: true,
                message: '所有人佔比總和必須等於100%',
                type: 'error'
              });
              return false;
            }

            this.$post('/api/PlanApi/SetPlanByDir', {
              Year: new Date().getFullYear(),
              LstStfPercent: newPercentArr,
            }).then(res => {
              // this.$message(res.Message);
              if(res['IsSuccess']) {
                this.diaLogModifyFinal = false;
                this.$emit('updateDirector');
              }
            }).catch(error => {

            });
          } else {
            console.log(this.$validator.errors.all());
          }
        })
      },
      getHistoryByDirectorFuc() {
        this.$post('/api/PlanApi/GetHistoryByDir', {}).then(res => {
          if(res['Info'].length > 0) {
            res['Info'].forEach((item) => {
              this.historyArr.push({
                year: item['Year'],
                text: `${item['Year']}年銷售目標`
              })
            });
          }
        }).catch(error => {

        });
      },
      blurFixedTwoFuc() {
        this.memBerListByIDArr.map((item) => {
          if(item['BTP_Percent'].indexOf('.') < 0) {
            return Object.assign(item, {
              BTP_Percent: parseInt(item['BTP_Percent']).toFixed(2),
            })
          }
        });
      },
      diaLogSubFinalFuc() {
        // diaLogSubFinal = true
        const h = this.$createElement;
        this.$confirm('', '提示', {
          message: h('div', null, [
            h('div', {style: 'marginBottom:10px; fontSize:16px'}, '确定提交最終的銷售目標嗎？'),
            h('div', {style: 'fontSize:12px;'}, '提交后将不再允許修改銷售目標，请谨慎操作！')
          ]),
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.subOkHistoryFuc()
        }).catch(() => {

        });
      }
    }
  }
</script>

<style lang="less" src="./setTarget.less"></style>