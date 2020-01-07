<template>
  <div class="gmNotTarget">
    <invalid-target v-if="getPlanChiefData['Info']['IsSetData'] === false"/>

    <set-target
        v-if="getPlanChiefData['Info']['IsSetData'] === true"
        :monthInfoArr="LstTeamMonthInfoArr"
        :YearPlanData="YearPlanData"
        :monthPercentArr="LstMonthPercentArr"
        :teamPercentArr="LstTeamPercentArr"
        :teamMemberCountArr="LstTeamMemberCountArr"
        @checkTeamMemberFuc="getPlanChief"
    />
  </div>
</template>

<script>
  /**
   * @Description:
   * @author 李凯明
   * @date 2019/10/28
  */

  import invalidTarget from '@/components/common/sales/invalidTarget.vue'
  import setTarget from '@/components/pages/sales/gm/setTarget.vue'

  export default {
    name: 'gmNotTarget',
    data() {
      return {
        getPlanChiefData: {
          Info: {
            IsSetData: null
          }
        },
        LstTeamMonthInfoArr: [],
        LstMonthPercentArr: [],
        LstTeamPercentArr: [],
        LstTeamMemberCountArr: [],
        YearPlanData: {
          BYP_CreateStfID: '',
          BYP_CreateTime: '',
          BYP_EffectTime: '',
          BYP_ID: '',
          BYP_Money: '',
          BYP_Status: '',
          BYP_Type: '',
          BYP_Year: ''
        }
      }
    },
    components: {
      [invalidTarget.name]: invalidTarget,
      [setTarget.name]: setTarget
    },
    mounted() {
      this.getPlanChief();
    },
    methods: {
      getPlanChief() {
        this.$post('/api/PlanApi/GetPlanDataByChief', { Year: new Date().getFullYear() }).then(res => {
          if(res['IsSuccess']) {
            this.getPlanChiefData = res;
            this.LstTeamMonthInfoArr = res.Info['LstTeamMonthInfo'];
            this.YearPlanData = res.Info['Yearplan'];
            this.LstMonthPercentArr = res.Info['LstMonthPercent'];
            this.LstTeamPercentArr = res.Info['LstTeamPercent'];
            this.LstTeamMemberCountArr = res.Info['LstTeamMemberCount']
          }
        }).catch(error => {

        });
      },
    }
  }
</script>

<style lang="less" src="./notTarget.less"></style>