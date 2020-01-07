<template>
  <div class="work-am">
    <div class="container fl">
      <p class="ax-default-text">待辦事項</p>

      <ul v-if="count !== 0 || toDoDataByAgentData['LstHoliday'].length > 0" class="todo-wrap1">
        <li v-if="toDoDataByAgentData['UnFollowCount'] !== 0">
          <div class="ax-u1422-text va-middle box-list">
            超過7天沒有跟進的客戶，请及时安排跟进
            <span style="color:#EE3A43;">（{{toDoDataByAgentData['UnFollowCount']}}）</span>
          </div>

          <div class="va-middle fr">
            <button class="primary-button">
              <router-link :to="hrefCustomerIndex" class="but-lg-href" style="color: #FF0000;">立即跟進</router-link>
            </button>
          </div>
        </li>

        <li v-if="toDoDataByAgentData['OrderOverCount'] !== 0">
          <div class="ax-u1422-text va-middle box-list">
            30天內即將到期的保单，请及时跟进处理
            <span style="color:#EE3A43;">（{{toDoDataByAgentData['OrderOverCount']}}）</span>
          </div>

          <div class="va-middle fr">
            <button class="primary-button">
              <router-link :to="hrefContractIndex" class="but-lg-href" style="color: #FF0000;">立即跟進</router-link>
            </button>
          </div>
        </li>

        <li v-for="(item, index) in toDoDataByAgentData['LstHoliday']">
          <div class="ax-u1422-text va-middle box-list">
            {{item['DaysBeforeHoliday']}}天后{{item['Holiday']}}，请提前安排客户问候等事宜
<!--            <span style="color:#EE3A43;">（{{toDoDataByAgentData['HolidayAfter']}}）</span>-->
          </div>

          <div class="va-middle fr">
            <button class="primary-button" @click="dialogVisible = true">
              創建日程
            </button>
          </div>
        </li>

        <li v-if="toDoDataByAgentData['NewPoolCount'] !== 0">
          <div class="ax-u1422-text va-middle box-list">
            你有新的線索，請及時處理
            <span style="color:#EE3A43;">（{{toDoDataByAgentData['NewPoolCount']}}）</span>
          </div>

          <div class="va-middle fr">
            <button class="primary-button">
              <router-link :to="hrefClueIndex" class="but-lg-href" style="color: #FF0000;">立即跟進</router-link>
            </button>
          </div>
        </li>

        <li v-if="toDoDataByAgentData['NewAppointCount'] !== 0">
          <div class="ax-u1422-text va-middle box-list">
            你有新的指派客户，请及时处理
            <span style="color:#EE3A43;">（{{toDoDataByAgentData['NewAppointCount']}}）</span>
          </div>

          <div class="va-middle fr">
            <button class="primary-button">
              <router-link :to="hrefCustomers" class="but-lg-href" style="color: #FF0000;">立即處理</router-link>
              <!--              立即處理-->
            </button>
          </div>
        </li>
      </ul>

      <div v-if="count === 0 && toDoDataByAgentData['LstHoliday'].length < 1" class="todo-wrap1">
        <div class="todo-wrap-data">
          <img src="@/assets/images/img1.png">
          <p class="ax-u10672-text">太棒了，沒有待辦事項</p>
        </div>
      </div>

      <div>
        <span class="ax-default-text">業績完成情況</span>

        <el-select v-model="value" placeholder="请选择" class="fr" @change="(value) => {this.achieveDataByAgentFuc(value)}">
          <el-option
              v-for="(item, index) in timeFrame"
              :key="index"
              :label="item['BO_Value']"
              :value="item['BO_Value']"
          >
          </el-option>
        </el-select>
      </div>

      <div class="todo-wrap2">
        <div class="mt-progress">
          <label class="ax-u1444-text" style="position: absolute;">保單金額</label>
          <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="achieveDataByAgentData['CompletePercent'] > 100 ? 100 : achieveDataByAgentData['CompletePercent']"
              status="exception"
              class="percentage-money"
              v-bind:class="{ 'percentage-money-text': achieveDataByAgentData['CompletePercent'] === 0 }"
          />
        </div>
        
        <ul>
          <li>
            <img src="@/assets/images/ld.png">
          </li>

          <li>
            <p class="ax-u1448-text">HKD&nbsp;&nbsp;&nbsp;{{achieveDataByAgentData['CompleteMoney'].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</p>
            <p class="ax-u1561-text">完成保單</p>
          </li>

          <li>
            <p class="ax-u1422-text">HKD&nbsp;&nbsp;&nbsp;{{achieveDataByAgentData['TargetMoney'].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}</p>
            <p class="ax-u1561-text">銷售目標</p>
          </li>
        </ul>
      </div>

      <div>
        <span class="ax-default-text">數據簡報</span>

        <el-select v-model="value2" placeholder="请选择" class="fr" @change="(value) => {this.briefDataByAgentFuc(value2)}">
          <el-option
              v-for="(item, index) in timeFrame2"
              :key="index"
              :label="item['BO_Value']"
              :value="item['BO_Value']"
          >
          </el-option>
        </el-select>
      </div>

      <ul class="todo-wrap3">
        <li>
          <p class="ax-u1480-text" :style="{ color: briefDataByAgent['NewClueCount'] === 0 ? '#666666' : ''}">{{briefDataByAgent['NewClueCount']}}</p>
          <p class="ax-u1481-text">新建線索</p>
        </li>
        <li class="fr">
          <p class="ax-u1480-text" :style="{ color: briefDataByAgent['ConvertCustCount'] === 0 ? '#666666' : ''}">{{briefDataByAgent['ConvertCustCount']}}</p>
          <p class="ax-u1481-text">轉客戶</p>
        </li>
        <li>
          <p class="ax-u1480-text" :style="{ color: briefDataByAgent['OrderPendingCount'] === 0 ? '#666666' : ''}">{{briefDataByAgent['OrderPendingCount']}}</p>
          <p class="ax-u1481-text">pending</p>
        </li>
        <li class="fr">
          <p class="ax-u1480-text" :style="{ color: briefDataByAgent['OrderFormalCount'] === 0 ? '#666666' : ''}">{{briefDataByAgent['OrderFormalCount']}}</p>
          <p class="ax-u1481-text">正式保單</p>
        </li>
      </ul>
    </div>

    <div class="right-wrap fl">
      <p class="ax-default-text">日程安排</p>

      <div class="todo-wrap1 timeline-wrap" v-cloak>
        <ele-calendar
            :render-content="renderContent"
            :data="datedef"
            :prop="prop"
            @date-change="(data)=>{this.getCalendarByMonthFuc(data)}"
            @pick="(data)=>{this.getScheduleListFuc(data)}"
        >
        </ele-calendar>

        <el-timeline v-if="getScheduleList !== undefined">
          <el-timeline-item
              v-for="(activity, index) in getScheduleList"
              :key="index"
              :color="activity['BS_Status'] === '已取消' ? 'rgba(204, 204, 204, 1)' : '#FF0000'"
              :timestamp="activity.timestamp"
          >
            <div class="timeline-left-content">
              <p class="ax-u1443-text" :style="{color: activity.timeColor}">{{activity['BS_TimeStart'].split('T')[1].substring(0, 5)}}</p>
              <p :class="'ax-u1444-text ' + activity['class']">{{activity['BS_Status']}}</p>
            </div>
            <span class="ax-u1442-text" :style="{color: activity['BS_Status'] === '已取消' ? '#CCCCCC' : ''}">
              {{activity['DescShow']}}
            </span>
          </el-timeline-item>
        </el-timeline>

        <div class="ta-center" v-if="getScheduleList && getScheduleList.length === 0">
          <img src="@/assets/images/icon-not-data.png">
          <p class="ax-u10672-text" style="margin: 5px 0 28px 0">沒有任何提醒</p>
          <el-button type="primary" size="mini" plain @click="dialogVisible = true">添加日程</el-button>
        </div>

        <router-link to="/scheduleAmIndex" class="ax-u10672-text fr link-more" v-if="getScheduleList && getScheduleList.length !== 0">更多></router-link>
      </div>

      <div class="todo-wrap2">
        <div style="line-height: 32px;">
          <span class="ax-default-text va-middle">業績排行榜</span>

          <el-select v-model="value3" placeholder="请选择" class="va-middle fr" @change="(value) => {this.rankDataByAgentFuc()}">
            <el-option
                v-for="(item, index) in timeFrame3"
                :key="index"
                :label="item['BO_Value']"
                :value="item['BO_Value']"
            >
            </el-option>
          </el-select>
        </div>

        <div class="performance-ranking">
          <ul class="ranking-ul">
            <li class="sidebar-nav-li" v-for="(item, index) in rankDataByAgentData" :key="index" :style="{height: item['RankNum'] > 3 ? '43px' : ''}">
              <img class="va-middle" v-if="item['RankNum'] === 1" src="@/assets/images/one.png">
              <img class="va-middle" v-if="item['RankNum'] === 2" src="@/assets/images/two.png">
              <img class="va-middle" v-if="item['RankNum'] === 3" src="@/assets/images/three.png">
              <span class="va-middle ax-u1468-text wd80-ib" v-if="item['RankNum'] > 3" style="width: 35px;">{{item['RankNum']}}</span>
              <span class="va-middle ax-u1468-text wd80-ib" style="width: 80px;">{{item['Stf_Name']}}</span>
              <span class="va-middle ax-u1468-text wd125-ib" :style="{ color: item['SumOrderMoney'] === 0 ? '#333333' : '#FF0000'}">
                {{item['SumOrderMoney'] !== 0 ? item['SumOrderMoney'].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : '--'}}
              </span>
            </li>
          </ul>

          <div class="ta-center" style="padding-top: 82.25px;" v-show="agentTotalCount === 0">
            <img src="@/assets/images/icon-not-data.png">
            <p class="ax-u10672-text" style="margin: 5px 0 28px 0">暫無數據</p>
          </div>

          <el-pagination
              v-if="agentTotalCount > 0"
              layout="prev, pager, next"
              :page-size="5"
              :total="agentTotalCount"
              @current-change="(size) => {this.rankDataByAgentFuc(size)}"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
        title="新建日程"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="任務內容" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" placeholder="1-500；中文、英文（區分大小寫）、数字、特殊字符"></el-input>
        </el-form-item>

        <el-form-item label="開始時間" prop="startTime">
          <el-date-picker v-model="ruleForm['startTime']" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </el-form-item>

        <el-form-item label="結束時間" prop="endTime">
          <el-date-picker v-model="ruleForm['endTime']" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </el-form-item>

        <el-form-item label="提醒時間" prop="remind">
          <el-select v-model="ruleForm.remind" placeholder="请选择">
            <el-option
                v-for="(item, index) in this.reminderTimeList"
                :key="index"
                :label="item['BO_Value']"
                :value="item['BO_Value']">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="關聯客戶" prop="customers">
          <el-select v-model="ruleForm.customers" filterable placeholder="請選擇客戶" no-data-text="暫無數據" no-match-text="無匹配數據">
            <el-option
                v-for="(item, index) in this.relevanceCustomerList"
                :key="index"
                :label="item['Cst_Name']"
                :value="item['Cst_ID']">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * @Description: 工作台-代理
   * @author 李凯明
   * @date 2019/11/04
   */

  import { mapState } from 'vuex';
  import eleCalendar from 'static/plugins/ele-calendar/dev/vue-calendar';
  import 'static/plugins/ele-calendar/dev/vue-calendar.css';
  import { mixin } from '@/utils/common';

  export default {
    mixins: [mixin],
    name: 'workbenchAm',
    data() {
      return {
        hrefCustomerIndex: `/customerIndex?text=${sessionStorage.getItem('fc_userid')}`,
        hrefContractIndex: `/contractIndex?text=${sessionStorage.getItem('fc_userid')}`,
        hrefClueIndex: `/clueIndex?text=${sessionStorage.getItem('fc_userid')}`,
        hrefCustomers: `/assignCustomers`,
        curDateDay: '',
        curMonthFix: '',
        datedef: [],
        prop:'date', //对应日期字段名
        dialogVisible: false,
        ruleForm: {
          customers: '',
          startTime: this.hkDateFuc(new Date(), 'dateHM'),
          remind: '準時',
          endTime: this.hkDateFuc(new Date(), 'dateEndHM'),
          desc: ''
        },
        startTime: '',
        rules: {
          startTime: [
            { required: true, message: '開始時間不能爲空！', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '結束時間不能爲空！', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '任務內容不能爲空！', }
          ]
        },
        toDoDataByAgentData: {
          NewPoolCount: 0,
          NewAppointCount: 0,
          OrderOverCount: 0,
          UnFollowCount: 0,
          HolidayAfter: '',
          LstHoliday: [],
        },
        achieveDataByAgentData: {
          TargetMoney: 0,
          CompleteMoney: 0,
          CompletePercent: 0
        },
        briefDataByAgent: {
          NewClueCount: '',
          ConvertCustCount: '',
          OrderPendingCount: '',
          OrderFormalCount: '',
        },
        rankDataByAgentData: [],
        getScheduleList: undefined,
        calendarByMonthData: [],
        count: '',
        agentTotalCount: null,
        timeFrame: [],
        timeFrame2: [],
        timeFrame3: [],
        value: '本月',
        value2: '本月',
        value3: '本月'
      }
    },
    components: {
      eleCalendar,
    },
    computed: {
      ...mapState ([
        'reminderTimeList',
        'relevanceCustomerList',
      ])
    },
    watch : {
      dialogVisible(val) {
        if(!val) {
          this.$refs['ruleForm'].resetFields();
        }
      },
    },
    mounted() {
      this.getToDoDataByAgentFuc();
      this.achieveDataByAgentFuc();
      this.briefDataByAgentFuc();
      this.rankDataByAgentFuc();
      this.getScheduleListFuc();
      this.getCalendarByMonthFuc();
      this.$store.dispatch('getTypeData', '提醒時間');
      this.$store.dispatch('getRelevanceCustomer');
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('/api/BasicsApi/AddSchedule', {
              BS_TimeStart: this.ruleForm['startTime'],
              BS_TimeEnd: this.ruleForm['endTime'],
              BS_Description: this.ruleForm['desc'],
              TipTimeType: this.ruleForm['remind'],
              Cst_ID: this.ruleForm['customers'],
            }).then(res => {
              if(res['IsSuccess']) {
                this.dialogVisible = false;
                this.getCalendarByMonthFuc();
                this.getScheduleListFuc(this.curDateDay)
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
      getToDoDataByAgentFuc() {
        this.$store.dispatch('getTypeData', '時間範圍').then(() => {
          this.timeFrame3 = this.timeFrame2 = this.timeFrame = this.$store.state['timeFrame'];
        });
        this.$post('/api/WorkSpaceApi/GetToDoDataByAgent', {}).then(res => {
          if(res['IsSuccess']) {
            this.count = 0;
            this.toDoDataByAgentData = res['Info'];
            for(let v in this.toDoDataByAgentData) {
              if(typeof this.toDoDataByAgentData[v] === 'number') {
                this.count += this.toDoDataByAgentData[v]
              }
            }
            console.log(this.toDoDataByAgentData.LstHoliday.length)
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      achieveDataByAgentFuc() {
        this.$post('/api/WorkSpaceApi/GetAchieveDataByAgent', {DateRangeType: this.value}).then(res => {
          if(res['IsSuccess']) {
            this.achieveDataByAgentData = res['Info'];

            if(this.achieveDataByAgentData['CompletePercent'] > 100) {
              document.getElementsByClassName('el-progress-bar__innerText')[0].innerHTML = this.achieveDataByAgentData['CompletePercent'] + '%'
            }
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      briefDataByAgentFuc() {
        this.$post('/api/WorkSpaceApi/GetBriefDataByAgent', {DateRangeType: this.value2}).then(res => {
          if(res['IsSuccess']) {
            this.briefDataByAgent = res.Info
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      rankDataByAgentFuc(size) {
        this.$post('/api/WorkSpaceApi/GetRankDataByAgent', {
          DateRangeType: this.value3,
          PageIndex: size || 1,
          PageSize: 5
        }).then(res => {
          if(res['IsSuccess']) {
            this.rankDataByAgentData = res['Datas'];
            this.agentTotalCount = res['TotalCount']
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      getScheduleListFuc(data) {
        this.curDateDay = data;
        let _data = data || new Date(),
          dom = document.getElementsByClassName('sameDayCur');
        if(this.fmtDate(_data) !== this.fmtDate()) {
          dom[0].style.display = 'block'
        } else {
          dom[0].style.display = 'none'
        }
        this.$post('/api/BasicsApi/GetScheduleList', {
          CurDate: this.fmtDate(_data),
        }).then(res => {
          if(res['IsSuccess']) {
            if(res['Info'].length > 5) {
              this.getScheduleList = res['Info'].slice(0, 5);
            } else {
              this.getScheduleList = res['Info'];
            }
            this.getScheduleList.forEach((item) => {
              if(item['BS_Status'] === '已結束') {
                item['timeColor'] = '#868686';
                item['class'] = 'timeTine-ended'
              } else if(item['BS_Status'] === '執行中') {
                item['timeColor'] = '#EE3A43';
                item['class'] = 'timeTine-execution'
              } else if(item['BS_Status'] === '未開始') {
                item['timeColor'] = '#EE3A43';
                item['class'] = 'timeTine-execution timeTine-noBegun'
              } else if(item['BS_Status'] === '已取消') {
                item['timeColor'] = '#777777';
                item['class'] = 'timeTine-cancelled'
              }
            });
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      renderContent(h, parmas) {
        const loop = data => {
          return (
            data.defvalue.value ? (
              <div>
                <span class="calendar-record"></span>
                <div>
                    {data.defvalue.text}
                  </div>
                </div>) :
              <div>
                {data.defvalue.text}
              </div>
          )
        };
        return (
          <div>
          {loop(parmas)}
          </div>
        )
      },
      getCalendarByMonthFuc(data) {
        if(data) {
          this.curMonthFix = this.fmtDate(_data).substring(0, 7);
        }
        let _data = this.curMonthFix || this.fmtDate(new Date()).substring(0, 7);
        this.$post('/api/BasicsApi/GetCalendarByMonth', {CurMonth: this.fmtDate(_data).substring(0, 7)}).then(res => {
          if(res['IsSuccess']) {
            this.datedef.splice(0, this.datedef.length);
            res.Info.forEach((item) => {
              this.calendarByMonthData.push(parseInt(item['ScheduleDate'].substr(-1)));
              this.datedef.push({
                date: item['ScheduleDate'],
                content: null,
                cid: null
              })
            });
          } else {
            this.$message(res.Message);
          }
        }).catch(error => {

        });
      },
      routeCustomersFuc() {
        this.$router.push({
          path: '/assignCustomers'
        })
      }
    }
  }
</script>

<style lang="less">
  .work-am {
    .container {
      width: 70%;
      padding: 20px 0 20px 0.5%;
      .todo-wrap1, .todo-wrap2 {
        height: 265px;
        background-color: #ffffff;
        padding: 0 18px 0 40px;
        margin: 23px 0;
        overflow-y: auto;
        position: relative;
      }
      .todo-wrap1 li {
        padding-top: 44px;
      }
      .todo-wrap1 li:last-child {
        padding-bottom: 44px;
      }
      .todo-wrap2 {
        height: 225px;
        .percentage-money .el-progress-bar__outer {
          background-color: rgba(228, 228, 228, 1);
        }
        .percentage-money-text .el-progress-bar__innerText {
          color: #1E1E1E;
          font-size: 14px;
          margin: 0 5px;
        }
      }
      .todo-wrap2 ul {
        text-align: center;
      }
      .todo-wrap2 li {
        display: inline-block;
        vertical-align: middle;
        text-align: left;
      }
      .todo-wrap2 li:first-child {
        margin-right: 23px;
      }
      .todo-wrap2 li:nth-child(2) {
        margin-right: 170px;
      }
      .todo-wrap3 {
        clear: both;
        margin-top: 25px;
      }
      .todo-wrap3 li {
        background-color: #ffffff;
        height: 107px;
        float: left;
        width: 50%;
        text-align: center;
        margin-bottom: 9px;
        padding-top: 53px;
      }
      .todo-wrap3 li:nth-child(even) {
        width: 49.3%;
        float: right;
      }
      .todo-wrap3 li p {
        line-height: inherit;
      }
      .primary-button {
        color: #FF0000;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 13px;
        text-align: center;
        line-height: normal;
        width: 71px;
        height: 29px;
        background: inherit;
        background-color: rgba(255, 255, 255, 0);
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(238, 58, 67, 1);
        border-radius: 5px;
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
        box-shadow: none;
        margin-right: 13px;
        cursor: pointer;
      }
      .box-list {
        display: inline-block;
        line-height: 29px;
      }
      .mt-progress {
        padding: 63px 0 53px 0;
      }
      .el-progress {
        padding-left: 90px;
      }
      .el-progress-bar__inner {
        border-radius: 0;
      }
      .el-progress-bar__outer {
        border-radius: 0;
      }
      .todo-wrap-data {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -60px 0 0 -50.5px;
        text-align: center;
        img {
          width: 85px;
          height: 81px;
        }
      }
    }

    .right-wrap {
      padding-top: 20px;
      width: 29%;
      margin-left: 0.5%;
      .pr-50 {
        padding-right: 50px;
      }
      .pr-10 {
        padding-right: 10px;
      }
      .timeline-wrap {
        padding: 20px;
        height: 519px;
      }
      .todo-wrap1 {
        background-color: #ffffff;
        margin: 23px 0;
        position: relative;
      }
      .performance-ranking {
        height: 329px;
        background-color: #ffffff;
        margin-top: 18px;
        position: relative;
      }
      .performance-ranking .ranking-ul {
        padding: 20px 0;
      }
      .performance-ranking .ranking-ul li {
        text-align: center;
      }
      .el-select {
        margin-left: 20px;
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
      .sidebar-nav-li {
        text-align: center;
        margin-bottom: 15px;
        line-height: 43px;
      }
      .wd80-ib {
        width: 80px;
        display: inline-block;
      }
      .wd125-ib {
        display: inline-block;
        width: 125px;
        text-align: right;
      }
      .el-dialog__footer {
        padding: 10px 20px 20px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
      }
      .el-date-picker-calendar {
        padding: 10px 0;
      }
      .el-date-picker-calendar__header {
        margin: 0 12px;
      }
      .el-date-table-calendar th {
        padding: 0;
      }
      .el-timeline {
        margin: 25px 0 0 0;
        font-size: 14px;
        list-style: none;
        padding-left: 75px;
      }
      .el-timeline-item:last-child {
        padding-bottom: 0;
      }
      .timeline-left-content {
        position: absolute;
        left: -55px;
      }
      /*.el-date-table-calendar td {*/
      /*  width: 10%;*/
      /*  display: inline-block;*/
      /*}*/
      .calendar-record {
        position: absolute;
        display: inline-block;
        background-color: #409EFF;
        width: 4px;
        height: 4px;
        border-radius: 50px;
        right: 46.5%;
        bottom: 0;
      }
      .el-date-table-calendar td.today {
        color: #ffffff;
        background-color: #409EFF;
      }
      .el-date-table-calendar td.current .calendar-record {
        top: 30px;
      }
      .el-date-table-calendar td.today .calendar-record {
        top: 30px;
      }
      .link-more {
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 0 23px 23px 0;
      }
      .sameDayCur {
        border: 1px solid #c0c4cc;
        background-color: #ffffff;
        cursor: pointer;
        padding: 2px;
        font-size: 12px;
        color: #c0c4cc;
        margin-top: 3px;
        display: none;
      }
      .timeTine-ended {
        background-color: rgba(215, 215, 215, 1);
        border-radius: 5px;
        width: 43px;
        text-align: center;
      }
      .timeTine-execution {
        background-color: rgba(255, 51, 102, 1);
        border-radius: 5px;
        width: 43px;
        text-align: center;
        color: #fff;
      }
      .timeTine-noBegun {
        background-color: rgba(255, 153, 0, 1);
      }
      .timeTine-cancelled {
        background-color: rgba(204, 204, 204, 1);
        border-radius: 5px;
        width: 43px;
        text-align: center;
        color: #fff;
      }
    }

    [v-cloak] {
      display: none;
    }

    .el-dialog {
      width: 795px;
      height: 650px;
      .el-dialog__header {
        padding: 20px 20px 10px;
        background-color: rgba(242, 242, 242, 1);
      }
      .demo-ruleForm {
        .el-select {
          width: 100%;
        }
        .el-form-item--small.el-form-item {
          margin-bottom: 30px;
        }
      }
      .el-dialog__footer {
        text-align: center;
      }
    }

    .el-date-editor.el-input {
      width: 100%;
    }

    .el-input__inner {
      width: 100%;
    }

    .el-textarea__inner {
      height: 135px;
    }
  }
</style>