<template>
  <div class="setPublicTarget">
    <div class="nationalTitle">
      <img src="@/assets/images/national.png" class="titleImg">
      <span class="title">銷售目標</span>
    </div>

    <div class="container">
      <div>
        <ul class="fl w100">
          <li class="fl">
            <img src="@/assets/images/zs.png">
            <span class="yearSpan">年度銷售目標</span>
          </li>

          <li class="fr" v-if="!yearUnequalAll && historyArr.length > 0">
            <span class="history" @click="lookHistoryList">查看歷史銷售目標</span>
          </li>

          <li class="fr" v-if="yearUnequalAll && !lookListAll">
            <span class="history" @click="lookHistoryListNewFuc(new Date().getFullYear())">返回最新銷售目標</span>
          </li>

          <li class="fr" v-if="lookListAll">
            <span class="history" @click="lookHistoryListAll(new Date().getFullYear(), 'story')">返回查看全部</span>
          </li>
        </ul>
      </div>

      <div class="cl-both wrap-content">
        <ul class="ta-center details-ul">
          <li>
            <span v-if="teamNameExist">{{teamName}}</span>
            {{YearPlanCur['BYP_Year']}}年銷售額
          </li>

          <li>
            <span class="hkd-style">HKD</span>
            <span class="amount-style" v-if="YearPlanCur['BYP_Money']">&nbsp;{{YearPlanCur['BYP_Money'].toLocaleString()}}</span>
            <span class="amount-style" v-if="YearPlanCur['BTP_Money']">&nbsp;{{YearPlanCur['BTP_Money'].toLocaleString()}}</span>
          </li>

          <li v-if="(!yearUnequalAll) && (YearPlanCur['BYP_Status'] !== '已生效')">
            <button class="but-style" @click="modifyFinal">修改目標</button>
            <button class="but-style bg-default" @click="subFinal">提交終稿</button>
          </li>
        </ul>
      </div>

      <div>
        <ul class="fl w100 mt-20">
          <li class="fl">
            <img src="@/assets/images/zs.png">
            <span class="yearSpan">銷售目標表</span>
          </li>

          <li class="fr" v-if="!lookListAll">
            <span class="history" @click="lookTargetList">查看團隊銷售目標</span>
          </li>
        </ul>

        <el-table :data="monthPercentCurArr" v-if="monthPercentCurArr.length !== 0">
          <el-table-column prop="date" label="月度" width="200" align="center"></el-table-column>

          <el-table-column :label="item['BT_Name'] === null ? item['Stf_Name'] : item['BT_Name']" align="center" v-for="(item, index) in tableMonthInfoArr" :key="index">
            <el-table-column label="占比" align="center">
              <template slot-scope="scope">
                <span class="companyFont" :style="{color: index === 0 ? '#EE3A43' : ''}">{{item['LstPercentMoney'][scope.$index]['Percent']}}%</span>
              </template>
            </el-table-column>
            <el-table-column label="金額" align="center">
              <template slot-scope="scope">
                <span class="companyFont" :style="{color: index === 0 ? '#EE3A43' : ''}">{{item['LstPercentMoney'][scope.$index]['Money'].toLocaleString()}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="選擇查看的團隊銷售目標：" :visible.sync="dialogVisible" :show-close="false">
      <div class="lookTargetHtml">
        <ul>
          <li class="box-li" v-for="(item, index) in teamPercentArrCur" :key="index" @click="lookTeamListFuc(item)">
            {{item['BT_Name']}}
          </li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog title="選擇查看的歷史銷售目標：" :visible.sync="diaLogHistoryList" :show-close="false">
      <div class="lookTargetHtml">
        <ul>
          <li class="box-li" v-for="(item, index) in historyArr" :key="index" @click="lookHistoryListFuc(item)">
            {{item.Year}}年銷售目標
          </li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="diaLogSubFinal" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="subFinalClass">
        <img src="@/assets/images/gth.png" class="va-middle">
        <span class="va-middle sub-ok-text">确定提交最終的銷售目標嗎？</span>
        <p class="va-middle tip-ok-text">提交后将不再允許修改銷售目標，请谨慎操作！</p>

        <ul class="subFinalUl">
          <li class="but1" @click="okFinaFuc">确定</li>
          <li class="but2" @click="diaLogSubFinal = false">取消</li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog title="修改銷售目標" :visible.sync="diaLogModifyFinal" class="diaLogModifyFinal" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form">
        <label class="el-form-item__label" style="width: 120px;">年度目標<span class="ax-default ax-tip">*</span></label>
        <el-form-item :label-width="formLabelWidth" style="margin-right: 25px;">
<!--          @blur="blurFixedTwoFuc"-->
          <el-input
              v-model="yearTargetValue"
              v-validate="'required'"
              name="年度目標"
              autocomplete="off"
              maxlength="14"
              @input="!/^\d+(\.\d{0,2})?$/.test(yearTargetValue) ? yearTargetValue = '' : yearTargetValue"
              onkeyup="if(isNaN(value))execCommand('undo')"
              onafterpaste="if(isNaN(value))execCommand('undo')"
          >
          </el-input>
          <span class="ax-default">單位：元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;幣種：HKD</span>
          <span class="reg-error">{{errors.first('年度目標')}}</span>
        </el-form-item>

        <label class="el-form-item__label" style="width: 120px;">月度占比<span class="ax-default ax-tip">*</span></label>
        <el-form-item class="dp-ib-top">
          <el-form-item :label="item['Month']" v-for="(item, index) in monthArr" :key="index">
<!--            @blur="blurFixedTwoFuc"-->
            <el-input
                v-if="monthPercentCurArr.length > 0"
                v-model="monthPercentCurArr[index]['BMP_Percent']"
                v-validate="'required'"
                :name="item['Month']"
                autocomplete="off"
                class="width-in"
                maxlength="6"
                @input="!/^\d+(\.\d{0,2})?$/.test(monthPercentCurArr[index]['BMP_Percent']) ? monthPercentCurArr[index]['BMP_Percent'] = '' : monthPercentCurArr[index]['BMP_Percent']"
                onkeyup="if(isNaN(value))execCommand('undo')"
                onafterpaste="if(isNaN(value))execCommand('undo')"
            >
            </el-input>
            <span>%</span>
            <p class="reg-error">{{errors.first(item['Month'])}}</p>
          </el-form-item>

          <el-form-item label="說明：月度佔年度目標的比例，其中12個月的佔比總和必須等於100%" class="ax-default"></el-form-item>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" class="dp-ib-top width-50">
          <el-form-item :label="item['Month']" v-for="(item, index) in monthArr2" :key="index">
<!--            @blur="blurFixedTwoFuc"-->
            <el-input
                v-if="monthPercentCurArr.length > 0"
                v-model="monthPercentCurArr[index + 6]['BMP_Percent']"
                v-validate="'required'"
                :name="item['Month']"
                autocomplete="off"
                class="width-in"
                maxlength="6"
                @input="!/^\d+(\.\d{0,2})?$/.test(monthPercentCurArr[index + 6]['BMP_Percent']) ? monthPercentCurArr[index + 6]['BMP_Percent'] = '' : monthPercentCurArr[index + 6]['BMP_Percent']"
                onkeyup="if(isNaN(value))execCommand('undo')"
                onafterpaste="if(isNaN(value))execCommand('undo')"
            >
            </el-input>
            <span>%</span>
            <p class="reg-error">{{errors.first(item['Month'])}}</p>
          </el-form-item>
        </el-form-item>

        <div class="border-el-dialog"></div>

        <label class="el-form-item__label" style="width: 120px;">團隊占比<span class="ax-default ax-tip">*</span></label>
        <el-form-item :label-width="formLabelWidth">
          <el-form-item :label="item['BT_Name']+'（'+teamMemberCountCurArr[index]['MemberCount']+'人）'" v-for="(item, index) in teamMemberCountCurArr" :key="index" class="dp-ib-top width-50">
<!--            @blur="blurFixedTwoFuc"-->
            <el-input
                v-model="item['TPercent']"
                v-validate="'required'"
                :name="item['BT_Name']"
                autocomplete="off"
                class="width-in"
                maxlength="6"
                @input="!/^\d+(\.\d{0,2})?$/.test(item['TPercent']) ? item['TPercent'] = '' : item['TPercent']"
                onkeyup="if(isNaN(value))execCommand('undo')"
                onafterpaste="if(isNaN(value))execCommand('undo')"
            >
            </el-input>
            <span>%</span>
            <span class="reg-error">{{errors.first(item['BT_Name'])}}</span>
          </el-form-item>

          <el-form-item label="說明：以團隊為單位佔公司總目標業績比例，所有團隊佔比總和必須等於100%" class="ax-default"></el-form-item>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="diaLogModifyFinal = false">取 消</el-button>
        <el-button type="primary" @click="submitSetPlanChief">确 定</el-button>
      </div>
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
    props: ['monthInfoArr', 'YearPlanData', 'monthPercentArr', 'teamPercentArr', 'teamMemberCountArr'],
    name: 'setPublicTarget',
    data() {
      return {
        dialogVisible: false,
        diaLogSubFinal: false,
        diaLogHistoryList: false,
        diaLogModifyFinal: false,
        yearUnequalAll: false,
        newYearUnequalAll: false,
        lookListAll: false,
        lookStory: '',
        historyArr: [],
        yearUnequal: false,
        dialogTableVisible: false,
        dialogFormVisible: false,
        GetTeamCountInfo: [],
        teamNameExist: false,
        yearTargetValue: '',
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
        formLabelWidth: '120px',
        monthArr: [{
          Month: '1月',
          MPercent: ''
        }, {
          Month: '2月',
          MPercent: ''
        }, {
          Month: '3月',
          MPercent: ''
        }, {
          Month: '4月',
          MPercent: ''
        }, {
          Month: '5月',
          MPercent: ''
        }, {
          Month: '6月',
          MPercent: ''
        }],
        monthArr2: [{
          Month: '7月',
          MPercent: ''
        }, {
          Month: '8月',
          MPercent: ''
        }, {
          Month: '9月',
          MPercent: ''
        }, {
          Month: '10月',
          MPercent: ''
        }, {
          Month: '11月',
          MPercent: ''
        }, {
          Month: '12月',
          MPercent: ''
        }],
        YearPlanCur: {
          BYP_Money: ''
        },
        teamPercentArrCur: [],
        tableMonthInfoArr: [],
        monthPercentCurArr: [],
        teamMemberCountCurArr: [],
        dateArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        teamName: '',
      }
    },
    mounted() {
      this.tableMonthInfoArr = this.monthInfoArr;
      this.YearPlanCur = this.YearPlanData;
      this.teamPercentArrCur = this.teamPercentArr;
      this.monthPercentCurArr = this.copyArr(this.monthPercentArr);
      this.teamMemberCountCurArr = this.copyArr(this.teamMemberCountArr);
      this.monthPercentCurArr.map((item) => {
        return Object.assign(item, {
          BMP_Percent: item['BMP_Percent'].toFixed(2),
          date: item['BMP_Month'] + '月'
        })
      });
      this.teamMemberCountCurArr.map((item) => {
        return Object.assign(item, {
          TPercent: item['TPercent'].toFixed(2),
        })
      });
      this.getHistoryByChiefFuc();
    },
    methods: {
      lookTargetList() {
        this.dialogVisible = true;
      },
      subFinal() {
        // this.diaLogSubFinal = true;
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
          this.okFinaFuc()
        }).catch(() => {

        });
      },
      lookHistoryList() {
        this.diaLogHistoryList = true;
      },
      lookHistoryListFuc(obj) {
        this.$post('/api/PlanApi/GetPlanDataByChief', { Year: obj.Year }).then(res => {
          if(res.Info.IsSetData) {
            this.yearUnequalAll = true;
            this.teamNameExist = false;
            this.YearPlanCur = res.Info['Yearplan'];
            this.monthPercentCurArr = [];
            this.tableMonthInfoArr = res.Info['LstTeamMonthInfo'];
            this.monthPercentCurArr = res.Info['LstMonthPercent'].map((item) => {
              return Object.assign(item, {
                BMP_Percent: item['BMP_Percent'].toFixed(2),
                date: item['BMP_Month'] + '月'
              })
            });
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
        if(obj.year !== new Date().getFullYear()) {
          this.yearUnequal = true
        }
        this.diaLogHistoryList = false
      },
      lookHistoryListNewFuc(num) {
        this.$post('/api/PlanApi/GetPlanDataByChief', { Year: num }).then(res => {
          if(res.Info.IsSetData) {
            this.yearUnequalAll = false;
            this.teamNameExist = false;
            this.YearPlanCur = res.Info['Yearplan'];
            this.monthPercentCurArr = [];
            this.tableMonthInfoArr = res.Info['LstTeamMonthInfo'];
            this.monthPercentCurArr = res.Info['LstMonthPercent'].map((item) => {
              return Object.assign(item, {
                BMP_Percent: item['BMP_Percent'].toFixed(2),
                date: item['BMP_Month'] + '月'
              })
            });
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      lookHistoryListAll(num) {
        this.$post('/api/PlanApi/GetPlanDataByChief', { Year: num }).then(res => {
          if(res.Info.IsSetData) {
            this.yearUnequalAll = false;
            this.lookListAll = false;
            this.teamNameExist = false;
            this.YearPlanCur = res.Info['Yearplan'];
            this.monthPercentCurArr = [];
            this.tableMonthInfoArr = res.Info['LstTeamMonthInfo'];
            this.monthPercentCurArr = res.Info['LstMonthPercent'].map((item) => {
              return Object.assign(item, {
                BMP_Percent: item['BMP_Percent'].toFixed(2),
                date: item['BMP_Month'] + '月'
              })
            });
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      lookTeamListFuc(obj) {
        this.$post('/api/PlanApi/GetPlanTeamByChief', {
          Year: this.YearPlanCur['BYP_Year'] || new Date().getFullYear(),
          BT_ID: obj['BT_ID']
        }).then(res => {
          if(res.Info !== null) {
            this.yearUnequalAll = true;
            this.lookListAll = true;
            this.YearPlanCur = res.Info['TeamMoney'];
            this.monthPercentCurArr = [];
            this.tableMonthInfoArr = res.Info['LstTeamMonthInfo'];
            this.tableMonthInfoArr.forEach((item) => {
              if(item.BT_Name !== null) {
                this.teamNameExist = true;
                this.teamName = item.BT_Name;
              }
            });
            this.monthPercentCurArr = res.Info['LstMonthPercent'].map((item) => {
              return Object.assign(item, {
                BMP_Percent: item['BMP_Percent'].toFixed(2),
                date: item['BMP_Month'] + '月'
              })
            });
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
        this.dialogVisible = false
      },
      modifyFinal() {
        this.diaLogModifyFinal = true;
        this.yearTargetValue = this.YearPlanCur['BYP_Money'].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        this.monthPercentArr.forEach((item, index) => {
          this.monthPercentCurArr[index]['BMP_Percent'] = Number(item['BMP_Percent']).toFixed(2)
        });
        this.teamMemberCountArr.forEach((item, index) => {
          this.teamMemberCountCurArr[index]['TPercent'] = Number(item['TPercent']).toFixed(2)
        });
      },
      submitSetPlanChief() {
        this.$validator.validate().then((valid) => {
          if(valid === true) {
            let getTeamArr = [];
            let countMonthNum = 0, countTeamPercentNum = 0;

            let newMonthArr = [...this.monthArr, ...this.monthArr2].map((item, index) => {
              return {
                Month: index + 1,
                MPercent: Number(this.monthPercentCurArr[index]['BMP_Percent']).toFixed(2)
              };
            });

            newMonthArr.forEach((item) => {
              countMonthNum = Number(item['MPercent']) + countMonthNum;
            });

            this.teamMemberCountCurArr.map((item, index) => {
              getTeamArr.push({
                BT_ID: item['BT_ID'],
                TPercent: Number(item['TPercent']).toFixed(2)
              });
              countTeamPercentNum = countTeamPercentNum + Number(item['TPercent'])
            });

            if(countMonthNum !== 100) {
              this.$message({
                showClose: true,
                message: '月度佔比總和必須等於100%',
                type: 'error'
              });
              return false;
            }

            if(countTeamPercentNum !== 100) {
              this.$message({
                showClose: true,
                message: '團隊佔比總和必須等於100%',
                type: 'error'
              });
              return false;
            }

            this.$post('/api/PlanApi/SetPlanByChief', {
              Year: new Date().getFullYear(),
              YearMoney: this.yearTargetValue,
              LstMonthPercent: newMonthArr,
              LstTeamPercent: getTeamArr,
            }).then(res => {
              // this.$message(res['Message']);
              if(res['IsSuccess']) {
                this.diaLogModifyFinal = false;
                this.$emit('update');
              }
            }).catch(error => {

            });
          } else {
            console.log(this.$validator.errors.all());
          }
        })
      },
      okFinaFuc() {
        this.$post('/api/PlanApi/LockStatusByChief', { Year: new Date().getFullYear() }).then(res => {
          this.$message(res.Message);
          if(res['IsSuccess']) {
            this.YearPlanCur['BYP_Status'] = '已生效'
          }
        }).catch(error => {

        });
        // this.diaLogSubFinal = false
      },
      getHistoryByChiefFuc() {
        this.$post('/api/PlanApi/GetHistoryByChief', {}).then(res => {
          if(res['IsSuccess']) {
            this.historyArr = res.Info
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      blurFixedTwoFuc() {
        if(typeof this.yearTargetValue === 'string' && this.yearTargetValue.indexOf('.') < 0) {
          this.yearTargetValue = parseInt(this.yearTargetValue).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
          // console.log(parseInt(this.yearTargetValue.replace(/,/gi,'')))
        }
        this.monthPercentCurArr.map((item) => {
          if(item['BMP_Percent'].indexOf('.') < 0) {
            return Object.assign(item, {
              BMP_Percent: parseInt(item['BMP_Percent']).toFixed(2),
            })
          }
        });
        this.teamPercentArrCur.map((item) => {
          if(item['BTP_Percent'].indexOf('.') < 0) {
            return Object.assign(item, {
              BTP_Percent: parseInt(item['BTP_Percent']),
            })
          }
        });
      }
    }
  }
</script>

<style lang="less" src="./setPublicTarget.less"></style>