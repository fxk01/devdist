<template>
  <div class="workMatter">
    <ul class="todo-wrap1" v-if="getToDoDataByDirData['NewPoolCount'] >= 0">
      <li v-if="cur === 'bm' && getToDoDataByDirData['RecoveryCount'] > 0">
        <div class="ax-u1422-text va-middle box-list">
          有同事離職，請及時收回客戶
          <span style="color:#EE3A43;">{{getToDoDataByDirData['RecoveryCount'] > 0 ? `（${getToDoDataByDirData['RecoveryCount']}）` : ''}}</span>
        </div>

        <div class="va-middle fr">
          <button class="primary-button">
            <router-link to="/recoverCustomers" class="but-lg-href" style="color: #FF0000;">立即收回</router-link>
          </button>
        </div>
      </li>

      <li v-if="getToDoDataByDirData['NewPoolCount'] > 0">
        <div class="ax-u1422-text va-middle box-list">
          公海池有新客戶，請及時跟進
          <span style="color:#EE3A43;">{{getToDoDataByDirData['NewPoolCount'] > 0 ? `（${getToDoDataByDirData['NewPoolCount']}）` : ''}}</span>
        </div>

        <div class="va-middle fr">
          <button class="primary-button">
            <router-link :to="routeIndex" class="but-lg-href" style="color: #FF0000;">立即處理</router-link>
          </button>
        </div>
      </li>

      <li v-if="getToDoDataByDirData['IsNeedSetPlan']">
        <div class="ax-u1422-text va-middle box-list">團隊銷售目標等待設置，請及時處理</div>

        <div class="va-middle fr">
          <button class="primary-button">
            <router-link :to="salesTarget" class="but-lg-href" style="color: #FF0000;">立即處理</router-link>
          </button>
        </div>
      </li>
    </ul>

    <div class="todo-wrap-data" :style="{ display: getToDoDataByDirData['noData'] === true ? 'block' : 'none' }">
      <img src="@/assets/images/img1.png">
      <p class="ax-u10672-text">太棒了，沒有待辦事項</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['getToDoDataByDirData'],
    name: 'workMatter',
    data() {
      return {
        salesTarget: sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? '/TaskDirector' : '/TaskManager',
        routeIndex: sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? `/poolGmIndex?text=${sessionStorage.getItem('fc_userid')}` : `/poolBmIndex?text=${sessionStorage.getItem('fc_userid')}`,
        cur: sessionStorage.getItem('fc_staffIdentity') === '銷售總監' ? 'gm' : 'bm',
      }
    },
    methods: {
      hrefRecoverUserFuc() {
        this.$router.push({
          path: '/recoverCustomers'
        })
      }
    }
  }
</script>

<style lang="less">
  .workMatter {
    height: 265px;
    background-color: #ffffff;
    position: relative;
    .ax-u1422-text {
      font-family: '微軟正黑體';
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      color: #333333;
      line-height: normal;
    }
    ul {
      padding: 40px 30px 25px 50px;
      list-style: inherit;
    }
    .todo-wrap1, .todo-wrap2 {
      height: 265px;
      background-color: #ffffff;
      padding: 0 18px 0 40px;
      margin: 23px 0;
    }
    .todo-wrap-data {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -60px 0 0 -50.5px;
      text-align: center;
      display: none;
      img {
        width: 85px;
        height: 81px;
      }
    }
    .todo-wrap1 li {
      padding-top: 44px;
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
  }
</style>