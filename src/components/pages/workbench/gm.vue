<template>
  <div class="workbenchGm">
    <workbenchBm />
  </div>
</template>

<script>
  /**
   * @Description: 工作台-总监
   * @author 李凯明
   * @date 2019/11/6
  */

  import workbenchBm from '@/components/pages/workbench/bm/bm.vue'

  export default {
    name: 'workbenchGm',
    components: {
      [workbenchBm.name]: workbenchBm
    },
  }
</script>