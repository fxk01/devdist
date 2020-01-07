<template>
  <div class="setTargetGm">
    <set-public-target
        :monthInfoArr="monthInfoArr"
        :YearPlanData="YearPlanData"
        :monthPercentArr="monthPercentArr"
        :teamPercentArr="teamPercentArr"
        :teamMemberCountArr="teamMemberCountArr"
        @update="updateDataFuc"
    />
  </div>
</template>

<script>
  /**
   * @Description: 已设置目标页面 BM,GM共用一个
   * @author 李凯明
   * @date 2019/10/28
  */

  import setPublicTarget from '@/components/common/sales/setPublicTarget.vue'

  export default {
    props: ['monthInfoArr', 'YearPlanData', 'monthPercentArr', 'teamPercentArr', 'teamMemberCountArr'],
    name: 'setTarget',
    data() {
      return {

      }
    },
    components: {
      [setPublicTarget.name]: setPublicTarget
    },
    methods: {
      updateDataFuc() {
        this.$emit('checkTeamMemberFuc');
      }
    }
  }
</script>

<style lang="less" src="./setTarget.less"></style>