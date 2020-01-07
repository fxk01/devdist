<template>
  <div class="notBMTarget">
    <invalid-target v-if="!getPlanDirectorData['Info']['ChiefIsSet'] && getPlanDirectorData['Message'] === '總監還未設置公司年度銷售目標'"/>

    <not-set-target v-if="getPlanDirectorData['Info']['ChiefIsSet'] && getPlanDirectorData['Info']['LstTeamMonthInfo'] === null" :getTargetData="getPlanDirectorDataInfo"/>

    <set-target
        v-if="getPlanDirectorData['Info']['ChiefIsSet'] && getPlanDirectorData['Info']['LstTeamMonthInfo'] !== null"
        :getTargetData="getPlanDirectorDataInfo"
        @updateDirector="GetPlanDirector"
    />
  </div>
</template>

<script>
  /**
   * @Description: 销售目标页面
   * @author 李凯明
   * @date 2019/10/25
   */

  import invalidTarget from '@/components/common/sales/invalidTarget.vue'
  import notSetTarget from '@/components/pages/sales/bm/notSetTarget.vue'
  import setTarget from '@/components/pages/sales/bm/setTarget.vue'

  export default {
    name: 'notBMTarget',
    data() {
      return {
        getPlanDirectorData: {
          Info: {
            ChiefIsSet: '',
          }
        },
        getPlanDirectorDataInfo: {}
      }
    },
    components: {
      [invalidTarget.name]: invalidTarget,
      [notSetTarget.name]: notSetTarget,
      [setTarget.name]: setTarget
    },
    mounted() {
      this.GetPlanDirector();
    },
    methods: {
      GetPlanDirector() {
        this.$post('/api/PlanApi/GetPlanDataByDir', {Year: new Date().getFullYear()}).then(res => {
          if(res['IsSuccess']) {
            this.getPlanDirectorData = res;
            this.getPlanDirectorDataInfo = res.Info;
          }
        }).catch(error => {

        });
      },
    }
  }
</script>

<style lang="less" src="./notBMTarget.less"></style>