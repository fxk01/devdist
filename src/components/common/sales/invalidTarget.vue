<template>
  <div class="invalidTarget">
    <div class="nationalTitle">
      <img src="@/assets/images/national.png" class="titleImg">
      <span class="title">銷售目標</span>
    </div>

    <div class="container">
      <div class="notData">
        <img class="bottom-img" src="@/assets/images/sousuo.png">

        <p class="not-text">暫無數據</p>

        <button class="add-but" v-if="butJudge === '銷售總監'" @click="dialogFormVisible = true">+新建目標</button>

<!--        <button class="add-but" @click="dialogFormVisible = true">+新建目標2</button>-->
      </div>
    </div>

    <el-dialog
        title="新建銷售目標"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <el-form :model="form">
        <label class="el-form-item__label" style="width: 120px;">年度目標<span class="ax-default ax-tip">*</span></label>
        <el-form-item :label-width="formLabelWidth">
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
          <el-form-item
              v-if="item['Month']"
              :label="item['Month']"
              v-for="(item, index) in monthArr"
              :key="index"
          >
            <el-input
                v-model="item['MPercent']"
                v-validate="'required'"
                :name="item['Month']"
                autocomplete="off"
                class="width-in"
                maxlength="6"
                @input="!/^\d+(\.\d{0,2})?$/.test(item['MPercent']) ? item['MPercent'] = '' : item['MPercent']"
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
            <el-input
                v-model="item['MPercent']"
                v-validate="'required'"
                :name="item['Month']"
                autocomplete="off"
                class="width-in"
                maxlength="6"
                @input="!/^\d+(\.\d{0,2})?$/.test(item['MPercent']) ? item['MPercent'] = '' : item['MPercent']"
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
          <el-form-item :label="item['BT_Name']+'（'+item['MemberCount']+'人）'" v-for="(item, index) in GetTeamCountInfo" :key="index" class="dp-ib-top width-50">
            <el-input
                v-model="item.TPercent"
                v-validate="'required'"
                :name="item['BT_Name']"
                autocomplete="off"
                class="width-in"
                maxlength="6"
                @input="onkeyupReg(item)"
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetPlanChief">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * @Description:
   * @author 李凯明
   * @date 2019/10/28
  */

  export default {
    name: 'invalidTarget',
    data() {
      return {
        butJudge: sessionStorage.getItem('fc_staffIdentity'),
        dialogTableVisible: false,
        dialogFormVisible: false,
        GetTeamCountInfo: [],
        yearTargetValue: '',
        form: {
          name: '',
          desc: '',
          label: ''
        },
        formLabelWidth: '120px',
        monthArr: [{
          Month: '1月',
          MPercent: '',
        }, {
          Month: '2月',
          MPercent: '',
        }, {
          Month: '3月',
          MPercent: '',
        }, {
          Month: '4月',
          MPercent: '',
        }, {
          Month: '5月',
          MPercent: '',
        }, {
          Month: '6月',
          MPercent: '',
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
        }]
      }
    },
    mounted() {
      this.GetTeamList();
      this.butJudge = sessionStorage.getItem('fc_staffIdentity')
    },
    methods: {
      GetTeamList() {
        if(sessionStorage.getItem('fc_staffIdentity') === '銷售總監') {
          this.$post('/api/BasicsApi/GetTeamCount', {}).then(res => {
            if(res['IsSuccess']) {
              this.GetTeamCountInfo = res.Info;
              this.GetTeamCountInfo.map((item) => {
                return Object.assign(item, { TPercent: '' })
              })
            }
          }).catch(error => {

          });
        }
      },
      submitSetPlanChief() {
        this.$validator.validate().then((valid) => {
          if(valid === true) {
            let monthCount = 0, teamCount = 0;
            let getTeamArr = [];
            let newMonthArr = [...this.monthArr, ...this.monthArr2].map((item, index) => {
              return {
                Month: index + 1,
                MPercent: Number(item['MPercent']).toFixed(2)
              }
            });
            this.GetTeamCountInfo.map((item) => {
              getTeamArr.push({
                BT_ID: item['BT_ID'],
                TPercent: Number(item['TPercent']).toFixed(2)
              })
            });
            newMonthArr.forEach((item) => {
              monthCount = Number(item['MPercent']) + monthCount
            });
            getTeamArr.forEach((item) => {
              teamCount = Number(item['TPercent']) + teamCount
            });
            if(monthCount !== 100) {
              this.$message({
                message: '月度佔比總和必須等於100%',
                type: 'error'
              });
              return false;
            }
            if(teamCount !== 100) {
              this.$message({
                message: '所有團隊佔比總和必須等於100%%',
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
              if(!res['IsSuccess']) {
                this.$message(res['Message']);
              } else {
                this.dialogFormVisible = false;
                if(res['IsSuccess']) {
                  window.location.reload()
                }
              }
            }).catch(error => {

            });
          } else {
            console.log(this.$validator.errors.all());
          }
        })
      },
      // inputBlur(obj, val) {
      //   if(val !== '' && typeof Number(val) === 'number') {
      //     obj['MPercent'] = Math.floor(val * 100) / 100
      //   }
      // }
      onkeyupReg(obj) {
        if(!/^\d+(\.\d{0,2})?$/.test(obj.TPercent)) {
          obj.TPercent = ''
        }
      }
    }
  }
</script>

<style lang="less" src="./invalidTarget.less"></style>