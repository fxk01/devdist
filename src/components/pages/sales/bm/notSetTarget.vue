<template>
  <div class="notSetTarget">
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
          <li class="fr">
            <span class="history" v-if="getTargetData['LstTeamMonthInfo'] !== null">查看歷史銷售目標</span>
          </li>
        </ul>
      </div>

      <div class="cl-both wrap-content">
        <ul class="ta-center details-ul">
          <li>
            {{getTargetData['TeamMoney']['BYP_Year']}}年銷售額
          </li>

          <li>
            <span class="hkd-style">HKD</span>
            <span class="amount-style">&nbsp;{{getTargetData['TeamMoney']['BTP_Money'].toLocaleString()}}</span>
          </li>

          <li>
            <button class="but-style" @click="setTeamTargetFuc">设置團隊目標</button>
          </li>
        </ul>
      </div>

      <div>
        <ul>
          <li>
            <img src="@/assets/images/zs.png">
            <span class="yearSpan">銷售目標表</span>
          </li>
        </ul>

        <img class="bottom-img" src="@/assets/images/sousuo.png" v-if="getTargetData['LstTeamMonthInfo'] === null">

        <p class="notData" v-if="getTargetData['LstTeamMonthInfo'] === null">暂无数据</p>
      </div>
    </div>

    <el-dialog title="設置團隊目標" :visible.sync="dialogSetTeam" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <ul class="setWrap">
        <li>
          <span class="ax-default">年度目標</span>
          <span class="ax-tip-text">*</span>
          <span class="ax-hkd pt-lr-20">HKD</span>
          <span class="ax-money">{{getTargetData['TeamMoney']['BTP_Money'].toFixed(2)}}</span>
        </li>

        <li>
          <label class="ax-default mr-23" style="vertical-align: text-top;">銷售占比<span class="ax-tip-text">*</span></label>

          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item :label="item['Stf_Name']" v-for="(item, index) in memBerListByIDArr" :key="index">
<!--              @blur="blurFixedTwoFuc"-->
              <el-input
                  v-model="item.value"
                  maxlength="6"
                  v-validate="'required'"
                  :name="item['Stf_Name']"
                  @input="!/^\d+(\.\d{0,2})?$/.test(item.value) ? item.value = '' : item.value"
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
        <el-button @click="dialogSetTeam = false">取 消</el-button>
        <el-button type="primary" @click="dialogSetTeamFuc">确 定</el-button>
      </span>
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
    props: ['getTargetData'],
    name: 'notSetTarget',
    data() {
      return {
        dialogSetTeam: false,
        memBerListByIDArr: [],
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
      }
    },
    components: {

    },
    mounted() {
      this.getMemberListByIdFuc()
    },
    methods: {
      getMemberListByIdFuc() {
        this.$post('/api/BasicsApi/GetMemberListByManID', {}).then(res => {
          if(res['IsSuccess']) {
            this.memBerListByIDArr = res.Info;
          }
        }).catch(error => {

        });
      },
      dialogSetTeamFuc() {
        this.$validator.validate().then((valid) => {
          if(valid === true) {
            let newPercentArr = [];
            let countNum = 0;
            this.memBerListByIDArr.forEach((item) => {
              newPercentArr.push({
                Stf_ID: item['Stf_ID'],
                SPercent: item['value']
              });
              countNum = countNum + Number(item['value']);
            });

            if(countNum !== 100) {
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
              if(res['IsSuccess']) {
                this.dialogSetTeam = false;
                this.$message(res.Message);

                window.location.reload();
              }
            }).catch(error => {

            });
          } else {
            console.log(this.$validator.errors.all());
          }
        })
      },
      setTeamTargetFuc() {
        this.dialogSetTeam = true
      },
      blurFixedTwoFuc() {
        this.memBerListByIDArr.map((item) => {
          if(item['value'] && item['value'].indexOf('.') < 0) {
            return Object.assign(item, {
              value: parseInt(item['value']).toFixed(2),
            })
          }
        });
      }
    }
  }
</script>

<style lang="less" src="./notSetTarget.less"></style>